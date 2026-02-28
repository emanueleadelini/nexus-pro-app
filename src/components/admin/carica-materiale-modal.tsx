'use client';

import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFirestore, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UploadCloud, FileIcon, X, Link as LinkIcon, Plus, AlertCircle, ShieldCheck } from 'lucide-react';
import { DestinazioneAsset } from '@/types/material';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  clienteId: string;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export function CaricaMaterialeModal({ isOpen, onClose, clienteId }: Props) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [externalLink, setExternalLink] = useState('');
  const [destinazione, setDestinazione] = useState<DestinazioneAsset>('social');
  const [tipoStrategico, setTipoStrategico] = useState<string>('piano_strategico');
  const [uploadType, setUploadType] = useState<'file' | 'link'>('file');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const db = useFirestore();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const oversizedFiles = files.filter(f => f.size > MAX_FILE_SIZE);
      
      if (oversizedFiles.length > 0) {
        toast({
          variant: 'destructive',
          title: 'File troppo grande',
          description: `Uno o più file superano il limite di 50MB. Per favore, usa l'opzione "Link" per questi file.`,
        });
        const validFiles = files.filter(f => f.size <= MAX_FILE_SIZE);
        setSelectedFiles(prev => [...prev, ...validFiles]);
      } else {
        setSelectedFiles(prev => [...prev, ...files]);
      }
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (uploadType === 'file' && selectedFiles.length === 0) {
      toast({ variant: 'destructive', title: 'Errore', description: 'Seleziona almeno un file.' });
      return;
    }
    if (uploadType === 'link' && !externalLink) {
      toast({ variant: 'destructive', title: 'Errore', description: 'Inserisci un link valido.' });
      return;
    }

    setLoading(true);
    try {
      const matColRef = collection(db, 'clienti', clienteId, 'materiali');

      if (uploadType === 'file') {
        const uploadPromises = selectedFiles.map(file => 
          addDoc(matColRef, {
            nome_file: file.name,
            url_storage: null,
            caricato_da: user.uid,
            ruolo_caricatore: 'admin',
            destinazione: destinazione,
            tipo_strategico: destinazione === 'strategico' ? tipoStrategico : null,
            stato_validazione: 'validato',
            note_rifiuto: null,
            creato_il: serverTimestamp()
          })
        );
        await Promise.all(uploadPromises);
      } else {
        await addDoc(matColRef, {
          nome_file: destinazione === 'strategico' ? `Link Documento Strategico` : 'Link Esterno',
          url_storage: null,
          link_esterno: externalLink,
          caricato_da: user.uid,
          ruolo_caricatore: 'admin',
          destinazione: destinazione,
          tipo_strategico: destinazione === 'strategico' ? tipoStrategico : null,
          stato_validazione: 'validato',
          note_rifiuto: null,
          creato_il: serverTimestamp()
        });
      }

      toast({ title: 'Materiale caricato!', description: 'Gli asset sono stati aggiunti all\'archivio.' });
      resetForm();
      onClose();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Errore', description: 'Impossibile caricare il materiale.' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedFiles([]);
    setExternalLink('');
    setDestinazione('social');
    setUploadType('file');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) resetForm(); onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">Invia Materiale al Cliente</DialogTitle>
          <DialogDescription>Carica asset creativi o documenti strategici master.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-6 py-4">
          <Tabs value={uploadType} onValueChange={(v: any) => setUploadType(v)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="file">File Locale</TabsTrigger>
              <TabsTrigger value="link">Link Esterno</TabsTrigger>
            </TabsList>

            <TabsContent value="file" className="space-y-4 pt-4">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors ${selectedFiles.length > 0 ? 'border-indigo-400 bg-indigo-50/50' : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'}`}
              >
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple />
                {selectedFiles.length > 0 ? (
                  <div className="w-full space-y-2">
                    {selectedFiles.map((f, i) => (
                      <div key={i} className="flex items-center justify-between bg-white p-2 rounded border text-xs">
                        <span className="truncate flex-1 mr-2">{f.name}</span>
                        <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={(e) => { e.stopPropagation(); removeFile(i); }}>
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex justify-center pt-2">
                      <Button type="button" variant="outline" size="sm" className="h-8 text-[10px] font-bold uppercase"><Plus className="w-3 h-3 mr-1" /> Aggiungi Altri</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="w-10 h-10 text-gray-300" />
                    <div className="text-center space-y-1">
                      <p className="text-sm font-medium text-gray-600">Trascina o clicca per caricare</p>
                      <p className="text-[10px] text-gray-400">Limite 50MB per file.</p>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="link" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="link">URL del File</Label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input id="link" value={externalLink} onChange={(e) => setExternalLink(e.target.value)} placeholder="https://..." className="pl-10" />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label>Destinazione d'uso</Label>
              <Select value={destinazione} onValueChange={(val: DestinazioneAsset) => setDestinazione(val)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="social">📱 Social Media</SelectItem>
                  <SelectItem value="sito">🌐 Sito Web</SelectItem>
                  <SelectItem value="offline">🖨️ Grafiche Offline</SelectItem>
                  <SelectItem value="strategico">🛡️ Documentazione Strategica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {destinazione === 'strategico' && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
                <Label>Tipo di Documento Strategico</Label>
                <Select value={tipoStrategico} onValueChange={setTipoStrategico}>
                  <SelectTrigger className="w-full border-indigo-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="piano_strategico">🎯 Piano Strategico Master</SelectItem>
                    <SelectItem value="piano_comunicazione">📣 Piano di Comunicazione</SelectItem>
                    <SelectItem value="business_plan">💼 Business Plan</SelectItem>
                    <SelectItem value="business_model">🧱 Business Model Canvas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>Annulla</Button>
            <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Invia al Cliente'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
