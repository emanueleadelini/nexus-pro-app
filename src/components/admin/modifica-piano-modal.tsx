'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useFirestore } from '@/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CreditCard, ChevronUp, ChevronDown, Briefcase, FileSignature, Fingerprint, Printer } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  clienteId: string;
  postTotaliAttuali: number;
  includeContratto?: boolean;
  includeVisualIdentity?: boolean;
  includeOffline?: boolean;
}

export function ModificaPianoModal({ 
  isOpen, 
  onClose, 
  clienteId, 
  postTotaliAttuali, 
  includeContratto = true, 
  includeVisualIdentity = true, 
  includeOffline = true 
}: Props) {
  const [loading, setLoading] = useState(false);
  const [nuoviPost, setNuoviPost] = useState(postTotaliAttuali);
  const [hasContratto, setHasContratto] = useState(includeContratto);
  const [hasVisual, setHasVisual] = useState(includeVisualIdentity);
  const [hasOffline, setHasOffline] = useState(includeOffline);
  
  const db = useFirestore();
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setNuoviPost(postTotaliAttuali);
      setHasContratto(includeContratto);
      setHasVisual(includeVisualIdentity);
      setHasOffline(includeOffline);
    }
  }, [postTotaliAttuali, includeContratto, includeVisualIdentity, includeOffline, isOpen]);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const clientRef = doc(db, 'clienti', clienteId);
      await updateDoc(clientRef, {
        post_totali: nuoviPost,
        include_contratto: hasContratto,
        include_visual_identity: hasVisual,
        include_offline: hasOffline,
        aggiornato_il: serverTimestamp(),
      });

      toast({ 
        title: 'Impostazioni aggiornate', 
        description: `I moduli per il cliente sono stati riconfigurati.` 
      });
      onClose();
    } catch (error) {
      toast({ 
        variant: 'destructive', 
        title: 'Errore', 
        description: 'Impossibile aggiornare le impostazioni del cliente.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-900">
            <CreditCard className="w-5 h-5 text-indigo-600" /> Configurazione Hub Cliente
          </DialogTitle>
          <DialogDescription className="text-slate-500 font-medium">
            Sblocca o nascondi le sezioni visibili dal cliente.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Post Totali Mensili</Label>
            <div className="flex items-center gap-6">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-12 w-12 rounded-full border-2 border-slate-100"
                onClick={() => setNuoviPost(prev => Math.max(1, prev - 1))}
              >
                <ChevronDown className="w-6 h-6 text-slate-600" />
              </Button>
              <div className="text-6xl font-headline font-black text-slate-900 w-24 text-center tracking-tighter">
                {nuoviPost}
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-12 w-12 rounded-full border-2 border-slate-100"
                onClick={() => setNuoviPost(prev => prev + 1)}
              >
                <ChevronUp className="w-6 h-6 text-slate-600" />
              </Button>
            </div>
          </div>

          <Separator className="bg-slate-100" />

          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Moduli Visibili al Cliente</Label>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-all">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-xl shadow-sm"><FileSignature className="w-4 h-4 text-slate-900" /></div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Sezione Contratto</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase">Documentazione legale</p>
                </div>
              </div>
              <Switch checked={hasContratto} onCheckedChange={setHasContratto} className="data-[state=checked]:bg-indigo-600" />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-all">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-xl shadow-sm"><Fingerprint className="w-4 h-4 text-indigo-600" /></div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Visual Identity</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase">Loghi e Brand Assets</p>
                </div>
              </div>
              <Switch checked={hasVisual} onCheckedChange={setHasVisual} className="data-[state=checked]:bg-indigo-600" />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-all">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-xl shadow-sm"><Printer className="w-4 h-4 text-emerald-600" /></div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Grafiche Offline</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase">Brochure, 6x3, Volantini</p>
                </div>
              </div>
              <Switch checked={hasOffline} onCheckedChange={setHasOffline} className="data-[state=checked]:bg-emerald-600" />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onClose} disabled={loading} className="font-bold text-slate-500">Annulla</Button>
          <Button 
            onClick={handleUpdate} 
            disabled={loading} 
            className="gradient-primary font-bold h-12 rounded-xl px-8"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salva Configurazione'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
