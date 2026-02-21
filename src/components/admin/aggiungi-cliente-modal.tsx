'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Building2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function AggiungiClienteModal({ isOpen, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome_azienda: '',
    settore: '',
    email_riferimento: '',
    post_totali: 6
  });
  const db = useFirestore();
  const { toast } = useToast();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome_azienda) {
      toast({ variant: 'destructive', title: 'Errore', description: 'Il nome azienda è obbligatorio.' });
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'clienti'), {
        nome_azienda: formData.nome_azienda,
        settore: formData.settore,
        email_riferimento: formData.email_riferimento,
        post_totali: Number(formData.post_totali),
        post_usati: 0,
        creato_il: serverTimestamp()
      });

      toast({ title: 'Cliente aggiunto!', description: `${formData.nome_azienda} è stato creato correttamente.` });
      setFormData({ nome_azienda: '', settore: '', email_riferimento: '', post_totali: 6 });
      onClose();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Errore', description: 'Impossibile salvare il cliente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" /> Nuovo Cliente
          </DialogTitle>
          <DialogDescription>Inserisci i dati dell'azienda per iniziare a gestire il piano editoriale.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome Azienda *</Label>
            <Input 
              id="nome" 
              value={formData.nome_azienda} 
              onChange={(e) => setFormData({...formData, nome_azienda: e.target.value})} 
              placeholder="es. Nexus S.r.l."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="settore">Settore</Label>
            <Input 
              id="settore" 
              value={formData.settore} 
              onChange={(e) => setFormData({...formData, settore: e.target.value})} 
              placeholder="es. Ristorazione, Tech, Fashion..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Riferimento</Label>
            <Input 
              id="email" 
              type="email"
              value={formData.email_riferimento} 
              onChange={(e) => setFormData({...formData, email_riferimento: e.target.value})} 
              placeholder="marketing@azienda.it"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="post">Post Totali (Piano)</Label>
            <Input 
              id="post" 
              type="number"
              min="1"
              value={formData.post_totali} 
              onChange={(e) => setFormData({...formData, post_totali: Number(e.target.value)})} 
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>Annulla</Button>
            <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Crea Cliente'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
