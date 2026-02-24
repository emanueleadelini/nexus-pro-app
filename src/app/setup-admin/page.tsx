
'use client';

import { useState, useEffect } from 'react';
import { useAuth, useFirestore } from '@/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, User } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { PERMESSI_DEFAULT } from '@/types/user';

export default function SetupAdminPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const auth = useAuth();
  const db = useFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleSetup = async () => {
    setStatus('loading');
    const email = 'emanueleadelini@gmail.com';
    const pass = 'Angela25!';

    try {
      let user = currentUser;

      if (!user || user.email !== email) {
        try {
          const res = await createUserWithEmailAndPassword(auth, email, pass);
          user = res.user;
        } catch (authError: any) {
          if (authError.code === 'auth/email-already-in-use') {
            try {
              const res = await signInWithEmailAndPassword(auth, email, pass);
              user = res.user;
            } catch (signInError: any) {
              throw new Error("L'utente esiste già ma la password nel codice non corrisponde. Elimina l'utente dalla console Firebase (Authentication) e riprova.");
            }
          } else {
            throw authError;
          }
        }
      }

      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const adminData = {
          email: user.email,
          ruolo: 'super_admin', // Aggiornato per lo Sprint 1C
          nomeAzienda: 'AD next lab',
          permessi: PERMESSI_DEFAULT['super_admin'],
          creatoIl: serverTimestamp()
        };

        setDoc(docRef, adminData)
          .then(() => {
            setStatus('success');
            setMessage('Configurazione completata! L\'account ' + user.email + ' è ora Super Admin.');
          })
          .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
              path: docRef.path,
              operation: 'create',
              requestResourceData: adminData,
            });
            errorEmitter.emit('permission-error', permissionError);
            setStatus('error');
            setMessage("Errore di permessi Firestore. Le regole sono state aggiornate, attendi qualche secondo e riprova.");
          });
      }
    } catch (error: any) {
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
          <CardTitle className="text-2xl font-headline font-bold">Configurazione Super Admin</CardTitle>
          <CardDescription>
            Imposta <strong>emanueleadelini@gmail.com</strong> come Super Admin per AD next lab.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {status === 'idle' && (
            <div className="space-y-4">
              <Button onClick={handleSetup} className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 font-bold transition-all shadow-lg shadow-indigo-100">
                Configura Admin Ora
              </Button>
            </div>
          )}

          {status === 'loading' && (
            <div className="flex flex-col items-center py-4">
              <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-2" />
              <p className="text-sm text-gray-500 font-medium">Salvataggio dati su Firestore...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4 text-center animate-in fade-in zoom-in duration-300">
              <div className="flex justify-center">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <p className="text-green-700 font-medium leading-relaxed">{message}</p>
              <Link href="/login" className="block w-full">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 h-11">Vai al Login</Button>
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <AlertCircle className="w-12 h-12 text-red-500" />
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                <p className="text-xs text-red-700 font-medium leading-relaxed">{message}</p>
              </div>
              <Button onClick={() => setStatus('idle')} variant="outline" className="w-full">Riprova</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
