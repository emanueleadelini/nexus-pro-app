
'use client';

import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useFirestore, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp, Timestamp, doc, updateDoc, increment, getDocs, query, where } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2, FilePlus2, Calendar, UploadCloud, X, FileIcon, ImageIcon, Share2, Layout, Zap, Clock } from 'lucide-react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { DestinazioneAsset } from '@/types/material';
import { PiattaformaPost, FormatoPost, PIATTAFORMA_LABELS, FORMATO_LABELS, StatoPost, TipoPianificazione } from '@/types/post';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  clienteId: string;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024;

export function CreaPostManualeModal({ isOpen, onClose, clienteId }: Props) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [destinazione, setDestinazione] = useState<DestinazioneAsset>('social');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    titolo: '',
    testo: '',
    data_pubblicazione: '',
    piattaforma: 'instagram' as PiattaformaPost,
    formato: 'immagine_singola' as FormatoPost,
    tags: '',
    tipo_pianificazione: 'programmata' as TipoPianificazione
  });
  
  const db = useFirestore();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > MAX_FILE_SIZE) {
        toast({ variant: 'destructive', title: 'File troppo grande', description: 'Il limite è 50MB.' });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titolo || !formData.testo || !user) return;

    setLoading(true);
    try {
      let materialeId = null;
      if (selectedFile) {
        const matRef = await addDoc(collection(db, 'clienti', clienteId, 'materiali'), {
          nome_file: selectedFile.name,
          url_storage: null,
          caricato_da: user.uid,
          ruolo_caricatore: 'admin',
          destinazione: destinazione,
          stato_validazione: 'validato',
          creato_il: serverTimestamp()
        });
        materialeId = matRef.id;
      }

      const timestamp = Timestamp.now();
      // Scadenza approvazione: +24 ore da adesso
      const scadenza = new Date();
      scadenza.setHours(scadenza.getHours() + 24);

      const postData = {
        titolo: formData.titolo,
        testo: formData.testo,
        stato: 'da_approvare' as StatoPost, // Creato direttamente in attesa per avviare il workflow
        materiale_id: materialeId,
        data_pubblicazione: formData.data_pubblicazione ? Timestamp.fromDate(new Date(formData.data_pubblicazione)) : null,
        tipo_pianificazione: formData.tipo_pianificazione,
        scadenza_approvazione: Timestamp.fromDate(scadenza),
        creato_il: serverTimestamp(),
        aggiornato_il: serverTimestamp(),
        piattaforma: formData.piattaforma,
        formato: formData.formato,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        numero_revisioni: 0,
        versione_corrente: 0,
        storico_stati: [{ stato: 'da_approvare', autore_uid: user.uid, timestamp }],
        versioni: [{ titolo: formData.titolo, testo: formData.testo, autore_uid: user.uid, autore_nome: 'Admin', timestamp }]
      };

      const newPostRef = await addDoc(collection(db, 'clienti', clienteId, 'post'), postData);
      await updateDoc(doc(db, 'clienti', clienteId), { post_usati: increment(1) });

      // NOTIFICA AL CLIENTE
      const usersSnap = await getDocs(query(collection(db, 'users'), where('cliente_id', '==', clienteId), where('ruolo', '==', 'referente')));
      for (const refDoc of usersSnap.docs) {
        await addDoc(collection(db, 'users', refDoc.id, 'notifiche'), {
          tipo: 'post_da_approvare',
          messaggio: `Nuovo post "${formData.titolo}" pronto! Approva entro 24 ore.`,
          destinatario_uid: refDoc.id,
          cliente_id: clienteId,
          riferimento_tipo: 'post',
          riferimento_id: newPostRef.id,
          letta: false,
          creato_il: serverTimestamp()
        });
      }

      toast({ title: 'Post Inviato!', description: 'Il cliente è stato notificato. Scadenza approvazione: 24h.' });
      resetForm();
      onClose();
    } catch (e: any) {
      errorEmitter.emit('permission-error', new FirestorePermissionError({ path: `clienti/${clienteId}/post`, operation: 'create' }));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ titolo: '', testo: '', data_pubblicazione: '', piattaforma: 'instagram', formato: 'immagine_singola', tags: '', tipo_pianificazione: 'programmata' });
    setSelectedFile(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) resetForm(); onClose(); }}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FilePlus2 className="w-5 h-5 text-indigo-600" /> Nuovo Post & Workflow 24h
          </DialogTitle>
          <DialogDescription>Inviando il post, il cliente avrà 24 ore per approvare prima della pubblicazione automatica.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-6 py-4">
          <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 space-y-3">
            <Label className="text-xs font-bold uppercase text-indigo-600 tracking-widest">Modalità di Uscita</Label>
            <RadioGroup 
              value={formData.tipo_pianificazione} 
              onValueChange={(v: any) => setFormData({...formData, tipo_pianificazione: v})}
              className="grid grid-cols-2 gap-4"
            >
              <div className={`flex items-center space-x-2 border p-3 rounded-lg bg-white cursor-pointer ${formData.tipo_pianificazione === 'immediata' ? 'border-indigo-600 ring-1 ring-indigo-600' : ''}`}>
                <RadioGroupItem value="immediata" id="imm" />
                <Label htmlFor="immediata" className="flex items-center gap-2 cursor-pointer">
                  <Zap className="w-4 h-4 text-amber-500" /> Pubblica Subito
                </Label>
              </div>
              <div className={`flex items-center space-x-2 border p-3 rounded-lg bg-white cursor-pointer ${formData.tipo_pianificazione === 'programmata' ? 'border-indigo-600 ring-1 ring-indigo-600' : ''}`}>
                <RadioGroupItem value="programmata" id="prog" />
                <Label htmlFor="programmata" className="flex items-center gap-2 cursor-pointer">
                  <Clock className="w-4 h-4 text-indigo-500" /> Programma
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Piattaforma</Label>
              <Select value={formData.piattaforma} onValueChange={(v: any) => setFormData({...formData, piattaforma: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{Object.entries(PIATTAFORMA_LABELS).map(([id, label]) => <SelectItem key={id} value={id}>{label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Formato</Label>
              <Select value={formData.formato} onValueChange={(v: any) => setFormData({...formData, formato: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{Object.entries(FORMATO_LABELS).map(([id, label]) => <SelectItem key={id} value={id}>{label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="titolo">Titolo Interno</Label>
              <Input id="titolo" value={formData.titolo} onChange={(e) => setFormData({...formData, titolo: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="testo">Copy del Post</Label>
              <Textarea id="testo" value={formData.testo} onChange={(e) => setFormData({...formData, testo: e.target.value})} className="min-h-[120px]" required />
            </div>
          </div>

          <div className="space-y-4 border-t pt-4">
            <Label className="text-indigo-600 font-bold flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Media Asset</Label>
            <div onClick={() => fileInputRef.current?.click()} className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer ${selectedFile ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200'}`}>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
              {selectedFile ? <span className="text-xs font-bold">{selectedFile.name}</span> : <UploadCloud className="w-8 h-8 text-gray-300" />}
            </div>
          </div>

          {formData.tipo_pianificazione === 'programmata' && (
            <div className="space-y-2">
              <Label>Data di Uscita Prevista</Label>
              <Input type="datetime-local" value={formData.data_pubblicazione} onChange={(e) => setFormData({...formData, data_pubblicazione: e.target.value})} />
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>Annulla</Button>
            <Button type="submit" disabled={loading} className="bg-indigo-600">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Invia al Cliente'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
