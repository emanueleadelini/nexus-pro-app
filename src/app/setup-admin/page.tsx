'use client';

import { useState } from 'react';
import { useAuth, useFirestore } from '@/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function SetupAdminPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const auth = useAuth();
  const db = useFirestore();

  const handleSetup = async () => {
    setStatus('loading');
    const email = 'emanueleadelini@gmail.com';
    const pass = 'Agnela25!';

    try {
      let user;
      try {
        // Tenta di creare l'utente
        const res = await createUserWithEmailAndPassword(auth, email, pass);
        user = res.user;
      } catch (authError: any) {
        // Se l'utente esiste già, prova a fare il login per ottenere l'UID
        if (authError.code === 'auth/email-already-in-progress' || authError.code === 'auth/email-already-in-use') {
          const res = await signInWithEmailAndPassword(auth, email, pass);
          user = res.user;
        } else {
          throw authError;
        }
      }

      if (user) {
        // Crea il profilo admin in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          email: email,
          ruolo: 'admin',
          nomeAzienda: 'Nexus Agency',
          creatoIl: serverTimestamp()
        });

        setStatus('success');
        setMessage('Configurazione completata! Ora puoi accedere come admin.');
      }
    } catch (error: any) {
      console.error(error);
      setStatus('error');
      setMessage(error.message || 'Errore durante la configurazione.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <Card className="w-full max-w-md shadow-xl border-indigo-100">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-indigo-600 p-3 rounded-full">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-headline font-bold">Configurazione Admin</CardTitle>
          <CardDescription>Clicca il tasto sotto per configurare automaticamente l'account admin emanueleadelini@gmail.com</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {status === 'idle' && (
            <Button onClick={handleSetup} className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 font-bold">
              Configura Admin Ora
            </Button>
          )}

          {status === 'loading' && (
            <div className="flex flex-col items-center py-4">
              <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-2" />
              <p className="text-sm text-gray-500">Creazione account in corso...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <p className="text-green-700 font-medium">{message}</p>
              <Link href="/login" className="block w-full">
                <Button className="w-full bg-indigo-600">Vai al Login</Button>
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <AlertCircle className="w-12 h-12 text-red-500" />
              </div>
              <p className="text-red-700 font-medium">{message}</p>
              <Button onClick={() => setStatus('idle')} variant="outline" className="w-full">Riprova</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
