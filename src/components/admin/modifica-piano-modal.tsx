'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useFirestore } from '@/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CreditCard, ChevronUp, ChevronDown, ShieldCheck, Briefcase, PieChart } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  clienteId: string;
  postTotaliAttuali: number;
  includeBP?: boolean;
  includeBM?: boolean;
}

export function ModificaPianoModal({ isOpen, onClose, clienteId, postTotaliAttuali, includeBP = false, includeBM = false }: Props) {
  const [loading, setLoading] = useState(false);
  const [nuoviPost, setNuoviPost] = useState(postTotaliAttuali);
  const [hasBP, setHasBP] = useState(includeBP);
  const [hasBM, setHasBM] = useState(includeBM);
  
  const db = useFirestore();
  const { toast } = useToast();

  useEffect(() => {
    setNuoviPost(postTotaliAttuali);
    setHasBP(includeBP);
    setHasBM(includeBM);
  }, [postTotaliAttuali, includeBP, includeBM, isOpen]);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const clientRef = doc(db, 'clienti', clienteId);
      await updateDoc(clientRef, {
        post_totali: nuoviPost,
        include_business_plan: hasBP,
        include_business_model: hasBM,
        richiesta_upgrade: false,
        aggiornato_il: serverTimestamp(),
      });

      toast({ 
        title: 'Piano aggiornato', 
        description: `Configurazione salvata con successo.` 
      });
      onClose();
    } catch (error) {
      toast({ 
        variant: 'destructive', 
        title: 'Errore', 
        description: 'Impossibile aggiornare il piano.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-600" /> Modifica Piano Post & Servizi
          </DialogTitle>
          <DialogDescription>
            Gestisci crediti post e moduli strategici inclusi.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Label className="text-xs font-bold uppercase text-gray-400">Post Totali Mensili</Label>
            <div className="flex items-center gap-6">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-12 w-12 rounded-full border-2"
                onClick={() => setNuoviPost(prev => Math.max(1, prev - 1))}
              >
                <ChevronDown className="w-6 h-6" />
              </Button>
              <div className="text-6xl font-headline font-bold text-gray-900 w-24 text-center">
                {nuoviPost}
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-12 w-12 rounded-full border-2"
                onClick={() => setNuoviPost(prev => prev + 1)}
              >
                <ChevronUp className="w-6 h-6" />
              </Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <Label className="text-xs font-bold uppercase text-gray-400 tracking-widest">Servizi Strategici Inclusi</Label>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 p-2 rounded-lg"><Briefcase className="w-4 h-4 text-indigo-600" /></div>
                <div>
                  <p className="text-sm font-bold">Business Plan</p>
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Consulenza Master</p>
                </div>
              </div>
              <Switch checked={hasBP} onCheckedChange={setHasBP} />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-violet-100 p-2 rounded-lg"><PieChart className="w-4 h-4 text-violet-600" /></div>
                <div>
                  <p className="text-sm font-bold">Business Model Canvas</p>
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Consulenza Strategica</p>
                </div>
              </div>
              <Switch checked={hasBM} onCheckedChange={setHasBM} />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={loading}>Annulla</Button>
          <Button 
            onClick={handleUpdate} 
            disabled={loading} 
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salva Modifiche'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
