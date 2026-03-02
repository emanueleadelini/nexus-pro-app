
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useFirestore } from '@/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Save, Loader2, BrainCircuit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface Props {
  clienteId: string;
  initialData?: any;
}

export function BrandTrainingForm({ clienteId, initialData }: Props) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    brand_voice: initialData?.brand_voice || '',
    target_audience: initialData?.target_audience || '',
    key_values: initialData?.key_values || '',
    main_topics: initialData?.main_topics || '',
    competitors: initialData?.competitors || ''
  });
  
  const db = useFirestore();
  const { toast } = useToast();

  const handleSave = async () => {
    setLoading(true);
    try {
      const clientRef = doc(db, 'clienti', clienteId);
      await updateDoc(clientRef, {
        ai_training: data,
        aggiornato_il: serverTimestamp()
      });
      toast({ title: "DNA Brand Salvato", description: "L'AI è ora addestrata per questo cliente." });
    } catch (e) {
      toast({ variant: 'destructive', title: "Errore salvataggio" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glass-card border-none rounded-[2.5rem] overflow-hidden shadow-sm bg-white">
      <CardHeader className="bg-violet-50 border-b border-violet-100 p-8">
        <div className="flex items-center gap-3">
          <div className="bg-violet-600 p-2 rounded-xl">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl font-headline font-bold text-violet-900">AI Brand Training</CardTitle>
            <CardDescription className="text-violet-600 font-medium">Addestra l'AI a scrivere come il brand.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Personalità & Tono</Label>
            <Textarea 
              value={data.brand_voice} 
              onChange={(e) => setData({...data, brand_voice: e.target.value})}
              placeholder="Es: Ironico, professionale, amichevole, autorevole..."
              className="bg-slate-50 border-slate-200 rounded-xl min-h-[100px] resize-none focus:ring-violet-500/20"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Pubblico Target</Label>
            <Textarea 
              value={data.target_audience} 
              onChange={(e) => setData({...data, target_audience: e.target.value})}
              placeholder="Chi sono i clienti ideali? Età, interessi, problemi..."
              className="bg-slate-50 border-slate-200 rounded-xl min-h-[100px] resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Valori & Mission</Label>
            <Textarea 
              value={data.key_values} 
              onChange={(e) => setData({...data, key_values: e.target.value})}
              placeholder="Cosa rende unica l'azienda? Qual è la promessa?"
              className="bg-slate-50 border-slate-200 rounded-xl min-h-[100px] resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Pilastri di Contenuto</Label>
            <Textarea 
              value={data.main_topics} 
              onChange={(e) => setData({...data, main_topics: e.target.value})}
              placeholder="Di cosa parliamo di solito? Prodotti, dietro le quinte, tips..."
              className="bg-slate-50 border-slate-200 rounded-xl min-h-[100px] resize-none"
            />
          </div>
        </div>
        <div className="pt-4 flex justify-end">
          <Button onClick={handleSave} disabled={loading} className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl h-12 px-8 font-bold gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Salva Istruzioni Strategiche</>}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
