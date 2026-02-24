
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

export default function RootPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

  useEffect(() => {
    if (isUserLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    const checkRoleAndRedirect = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          const ruolo = data.ruolo;
          
          if (ruolo === 'super_admin' || ruolo === 'operatore' || ruolo === 'admin') {
            router.push('/admin');
          } else if (ruolo === 'referente' || ruolo === 'collaboratore' || ruolo === 'cliente') {
            router.push('/cliente');
          } else {
            router.push('/login');
          }
        } else {
          router.push('/login');
        }
      } catch (error) {
        router.push('/login');
      }
    };

    checkRoleAndRedirect();
  }, [user, isUserLoading, db, router]);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-50">
      <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mb-4" />
      <p className="text-gray-400 font-medium text-sm animate-pulse italic">Reindirizzamento in corso...</p>
    </div>
  );
}
