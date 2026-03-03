
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth, useFirestore } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, Eye, EyeOff, Loader2, Lock, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const ADMIN_EMAIL = 'emanueleadelini@gmail.com';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const entry = searchParams.get('entry'); // 'admin' o 'client'

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      
      // Controllo ruolo per reindirizzamento corretto
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        if (data.ruolo === 'super_admin' || data.ruolo === 'operatore' || user.email === ADMIN_EMAIL) {
          router.push('/admin');
        } else {
          router.push('/cliente');
        }
      } else {
        // Fallback email
        if (user.email === ADMIN_EMAIL) {
          router.push('/admin');
        } else {
          router.push('/cliente');
        }
      }
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Accesso negato',
        description: 'Email o password non validi. Riprova.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white border border-slate-100 rounded-[2rem] mb-6 shadow-2xl rotate-3 p-1">
            <div className={`w-full h-full rounded-[1.8rem] flex items-center justify-center ${entry === 'admin' ? 'bg-indigo-600' : 'bg-slate-900'}`}>
              {entry === 'admin' ? <ShieldCheck className="w-10 h-10 text-white" /> : <UserCircle className="w-10 h-10 text-white" />}
            </div>
          </div>
          <h1 className="text-4xl font-headline font-bold text-slate-900 mb-2">
            AD next lab <span className="text-indigo-600">Pro</span>
          </h1>
          <div className="flex justify-center mt-4">
            {entry === 'admin' ? (
              <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 px-4 py-1 font-black uppercase text-[10px] tracking-widest">
                Porta d'accesso Agenzia
              </Badge>
            ) : (
              <Badge className="bg-slate-100 text-slate-600 border-slate-200 px-4 py-1 font-black uppercase text-[10px] tracking-widest">
                Hub Riservato Clienti
              </Badge>
            )}
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-10 space-y-8 shadow-xl border border-slate-100">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-black uppercase text-[10px] tracking-widest ml-1">Email Aziendale</Label>
              <Input
                id="email"
                type="email"
                placeholder="nome@azienda.it"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-50 border-slate-200 text-slate-900 h-14 rounded-2xl focus:ring-indigo-500/20 px-5 font-medium"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 font-black uppercase text-[10px] tracking-widest ml-1">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-50 border-slate-200 text-slate-900 h-14 rounded-2xl pr-14 focus:ring-indigo-500/20 px-5 font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors p-2"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className={`w-full h-14 rounded-2xl font-black uppercase tracking-widest text-sm shadow-lg shadow-indigo-500/20 mt-4 ${entry === 'admin' ? 'gradient-primary' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                'Entra nell\'Hub'
              )}
            </Button>
          </form>

          <div className="text-center pt-6 border-t border-slate-100">
            <Link href="/" className="text-slate-400 hover:text-indigo-600 text-xs font-black uppercase tracking-widest transition-all">
              ← Torna alla Home
            </Link>
          </div>
        </div>

        <p className="text-center text-slate-400 text-[10px] font-black uppercase tracking-widest mt-10">
          Supporto Tecnico: nexus@adnextlab.it
        </p>
      </div>
    </div>
  );
}
