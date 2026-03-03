'use client';

import { useState } from 'react';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { doc, setDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ShieldCheck, Loader2, CheckCircle, AlertCircle, Lock } from 'lucide-react';
import Link from 'next/link';
import { PERMESSI_DEFAULT } from '@/types/user';

export default function SetupAdminPage() {
  const { user } = useUser();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [setupKey, setSetupKey] = useState('');
  const db = useFirestore();

  const handleSetup = async () => {
    // Rendiamo il controllo più robusto (trim e lowercase)
    const sanitizedKey = setupKey.trim().toLowerCase();
    
    if (sanitizedKey !== 'nexus2024') {
      setStatus('error');
      setMessage('Master Key non valida. Verifica di aver inserito "nexus2024" correttamente senza spazi.');
      return;
    }

    if (!user) {
      setStatus('error');
      setMessage('Devi essere autenticato per attivare i privilegi. Effettua il login e torna su questa pagina.');
      return;
    }

    setStatus('loading');

    try {
      const batch = writeBatch(db);
      
      // 1. Aggiorna il profilo utente con il ruolo super_admin
      const userRef = doc(db, 'users', user.uid);
      batch.set(userRef, {
        email: user.email,
        ruolo: 'super_admin',
        nomeAzienda: 'AD next lab',
        permessi: PERMESSI_DEFAULT['super_admin'],
        creatoIl: serverTimestamp(),
        ultimo_accesso: serverTimestamp()
      }, { merge: true });

      // 2. Crea il marker critico per le Security Rules nella collezione /admins/
      const adminMarkerRef = doc(db, 'admins', user.uid);
      batch.set(adminMarkerRef, {
        active: true,
        updatedAt: serverTimestamp(),
        email: user.email
      });

      await batch.commit();
      
      setStatus('success');
      setMessage(`Successo! L'account ${user.email} è ora Amministratore Master.`);
    } catch (error: any) {
      console.error("Setup Error:", error);
      setStatus('error');
      setMessage(`Errore tecnico: ${error.message}. Verifica i permessi Firestore.`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <Card className="w-full max-w-md shadow-2xl border-indigo-100 bg-white rounded-[2.5rem] overflow-hidden">
        <CardHeader className="text-center bg-slate-50 pb-8 pt-10 border-b border-slate-100">
          <div className="flex justify-center mb-4">
            <div className="bg-indigo-600 p-4 rounded-2xl shadow-xl shadow-indigo-200 animate-in zoom-in duration-500">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-headline font-bold text-slate-900">Attivazione Hub Admin</CardTitle>
          <CardDescription className="text-slate-500 font-medium">Configura l'accesso privilegiato per AD next lab</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-8">
          {!user && status === 'idle' && (
            <div className="bg-amber-50 border border-amber-100 p-5 rounded-2xl space-y-3">
              <p className="text-xs text-amber-700 font-bold leading-relaxed">Attenzione: non risulti loggato. Accedi prima con la tua email aziendale.</p>
              <Link href="/login?entry=admin" className="block">
                <Button variant="outline" className="w-full border-amber-200 text-amber-700 hover:bg-amber-100 font-bold rounded-xl">Vai al Login</Button>
              </Link>
            </div>
          )}

          {status === 'idle' && user && (
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  <Lock className="w-3 h-3" /> Master Activation Key
                </div>
                <Input 
                  type="text" 
                  value={setupKey} 
                  onChange={(e) => setSetupKey(e.target.value)} 
                  placeholder="Inserisci nexus2024" 
                  className="bg-slate-50 h-14 rounded-2xl border-slate-200 text-center font-bold tracking-widest focus:ring-indigo-500/20"
                />
              </div>
              <Button onClick={handleSetup} className="w-full bg-indigo-600 hover:bg-indigo-700 h-14 font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-200 rounded-2xl transition-all">
                Attiva Privilegi Master
              </Button>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] text-center text-slate-400 font-bold uppercase">Account da promuovere:</p>
                <p className="text-xs text-center text-slate-900 font-black mt-1">{user.email}</p>
              </div>
            </div>
          )}

          {status === 'loading' && (
            <div className="flex flex-col items-center py-12">
              <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mb-4" />
              <p className="text-sm text-slate-500 font-bold animate-pulse uppercase tracking-widest">Sincronizzazione Hub...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-6 text-center animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>
              <div className="space-y-2">
                <p className="text-slate-900 font-black text-lg">{message}</p>
                <p className="text-sm text-slate-500 font-medium">Ora puoi accedere a tutte le funzioni dell'Hub.</p>
              </div>
              <Link href="/admin" className="block w-full">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 h-14 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-200">Entra nell'Area Admin</Button>
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-5 text-center animate-in shake-in duration-300">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto border border-red-100">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-red-700 font-bold text-sm leading-relaxed">{message}</p>
              <Button onClick={() => setStatus('idle')} variant="outline" className="w-full h-12 rounded-xl font-bold border-red-100 text-red-600 hover:bg-red-50">Riprova</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
