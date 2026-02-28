'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase, useAuth } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { LogOut, Loader2, UserCircle, Briefcase, ShieldCheck } from 'lucide-react';
import { NotificheBell } from '@/components/notifiche-bell';

export default function ClienteLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const auth = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [nomeAzienda, setNomeAzienda] = useState('');
  const [clienteId, setClienteId] = useState<string | null>(null);

  useEffect(() => {
    if (isUserLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    const checkRole = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          const ruolo = data.ruolo;
          if (ruolo === 'referente' || ruolo === 'collaboratore') {
            setIsAuthorized(true);
            setNomeAzienda(data.nomeAzienda || 'La tua Azienda');
            setClienteId(data.cliente_id);
          } else {
            router.push('/login');
          }
        } else {
          router.push('/login');
        }
      } catch (e) {
        console.error("Errore verifica ruolo:", e);
      }
    };
    checkRole();
  }, [user, isUserLoading, db, router]);

  const clientDocRef = useMemoFirebase(() => {
    if (!user || !clienteId) return null;
    return doc(db, 'clienti', clienteId);
  }, [db, clienteId, user]);
  const { data: clientData } = useDoc<any>(clientDocRef);

  if (isUserLoading || !isAuthorized) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-950">
        <Loader2 className="animate-spin text-indigo-500 w-12 h-12 mb-4" />
        <p className="text-slate-400 font-medium animate-pulse text-sm">Caricamento Hub Pro...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <header className="bg-slate-900/50 backdrop-blur-xl border-b border-white/5 h-20 flex items-center justify-between px-6 md:px-12 sticky top-0 z-30 shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="font-headline font-bold text-xl text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 shadow-inner overflow-hidden flex items-center justify-center p-1">
              {clientData?.logo_url ? (
                <img src={clientData.logo_url} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <ShieldCheck className="w-6 h-6 text-indigo-500" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="leading-tight">AD next lab</span>
              <span className="text-[10px] text-indigo-400 uppercase tracking-widest font-black">Nexus Pro</span>
            </div>
          </div>
          <div className="hidden md:block h-8 w-px bg-white/10" />
          <div className="hidden md:flex items-center gap-3 text-xs text-slate-300 font-bold bg-white/5 px-4 py-2 rounded-full border border-white/5">
             <UserCircle className="w-4 h-4 text-indigo-400" /> {nomeAzienda}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <NotificheBell />
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-slate-400 font-bold gap-2 hover:bg-red-500/10 hover:text-red-400 transition-all rounded-lg" 
            onClick={() => auth.signOut()}
          >
            <LogOut className="w-4 h-4" /> 
            <span className="hidden sm:inline text-xs">Esci</span>
          </Button>
        </div>
      </header>
      
      <main className="flex-1 p-4 md:p-12 max-w-7xl mx-auto w-full animate-in fade-in duration-700">
        {children}
      </main>

      <footer className="bg-slate-900/30 border-t border-white/5 p-8 text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest">
        &copy; {new Date().getFullYear()} AD next lab Hub Digitale &bull; Progettato per l'eccellenza digitale
      </footer>
    </div>
  );
}