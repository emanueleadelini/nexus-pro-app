'use client';

import { useState } from 'react';
import { useFirestore, useUser } from '@/firebase';
import { doc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ShieldCheck, Loader2, CheckCircle, AlertCircle, Lock, Crown } from 'lucide-react';
import Link from 'next/link';
import { PERMESSI_DEFAULT } from '@/types/user';

export default function SetupAdminPage() {
  const { user } = useUser();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [setupKey, setSetupKey] = useState('');
  const db = useFirestore();

  const isEmanuele = user?.email === 'emanueleadelini@gmail.com';

  const handleSetup = async () => {
    const sanitizedKey = setupKey.trim().toLowerCase();
    
    if (sanitizedKey !== 'nexus2024') {
      setStatus('error');
      setMessage('Master Key non valida. Inserisci "nexus2024".');
      return;
    }

    if (!user) {
      setStatus('error');
      setMessage('Devi essere loggato per attivare i privilegi.');
      return;
    }

    setStatus('loading');

    try {
      const batch = writeBatch(db);
      
      // 1. Profilo Utente
      const userRef = doc(db, 'users', user.uid);
      batch.set(userRef, {
        email: user.email,
        ruolo: 'super_admin',
        nomeAzienda: 'AD next lab',
        permessi: PERMESSI_DEFAULT['super_admin'],
        creatoIl: serverTimestamp(),
        ultimo_accesso: serverTimestamp()
      }, { merge: true });

      // 2. Marker Admin per Security Rules
      const adminMarkerRef = doc(db, 'admins', user.uid);
      batch.set(adminMarkerRef, {
        active: true,
        email: user.email,
        updatedAt: serverTimestamp(),
        isMainAdmin: isEmanuele
      });

      await batch.commit();
      
      setStatus('success');
      setMessage(`Benvenuto Comandante. Privilegi attivati per ${user.email}`);
    } catch (error: any) {
      console.error("Setup Error:", error);
      setStatus('error');
      setMessage(`Errore tecnico: ${error.message}. Assicurati di essere loggato come emanueleadelini@gmail.com`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <Card className="w-full max-w-md shadow-2xl border-indigo-100 bg-white rounded-[2.5rem] overflow-hidden">
        <CardHeader className="text-center bg-slate-50 pb-8 pt-10 border-b border-slate-100">
          <div className="flex justify-center mb-4">
            <div className="bg-indigo-600 p-4 rounded-2xl shadow-xl shadow-indigo-200">
              {isEmanuele ? <Crown className="w-8 h-8 text-white" /> : <ShieldCheck className="w-8 h-8 text-white" />}
            </div>
          </div>
          <CardTitle className="text-2xl font-headline font-bold text-slate-900">
            {isEmanuele ? 'Bentornato Emanuele' : 'Attivazione Hub Admin'}
          </CardTitle>
          <CardDescription className="text-slate-500 font-medium">
            {isEmanuele ? 'Configura il tuo accesso prioritario' : 'Sblocca i permessi per AD next lab'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-8">
          {!user && status === 'idle' && (
            <div className="bg-amber-50 border border-amber-100 p-5 rounded-2xl space-y-3">
              <p className="text-xs text-amber-700 font-bold text-center">Accedi con emanueleadelini@gmail.com per procedere.</p>
              <Link href="/login?entry=admin" className="block">
                <Button variant="outline" className="w-full border-amber-200 text-amber-700 font-bold rounded-xl">Vai al Login</Button>
              </Link>
            </div>
          )}

          {status === 'idle' && user && (
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  <Lock className="w-3 h-3" /> Master Key Sicurezza
                </div>
                <Input 
                  type="text" 
                  value={setupKey} 
                  onChange={(e) => setSetupKey(e.target.value)} 
                  placeholder="nexus2024" 
                  className="bg-slate-50 h-14 rounded-2xl border-slate-200 text-center font-bold tracking-widest focus:ring-indigo-500/20"
                />
              </div>
              <Button onClick={handleSetup} className="w-full bg-indigo-600 hover:bg-indigo-700 h-14 font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-200 rounded-2xl gap-2">
                {isEmanuele && <Crown className="w-4 h-4" />} Attiva Privilegi Master
              </Button>
              <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 text-center">
                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-tighter">Account Rilevato:</p>
                <p className="text-xs text-indigo-900 font-black">{user.email}</p>
              </div>
            </div>
          )}

          {status === 'loading' && (
            <div className="flex flex-col items-center py-12">
              <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mb-4" />
              <p className="text-sm text-slate-500 font-bold animate-pulse uppercase tracking-widest">Sincronizzazione Hub Master...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-6 text-center animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>
              <p className="text-slate-900 font-black text-lg">{message}</p>
              <Link href="/admin" className="block w-full">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 h-14 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-200">Accedi alla Dashboard</Button>
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-5 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-red-700 font-bold text-sm leading-relaxed">{message}</p>
              <Button onClick={() => setStatus('idle')} variant="outline" className="w-full h-12 rounded-xl font-bold border-red-100 text-red-600">Riprova Procedura</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}