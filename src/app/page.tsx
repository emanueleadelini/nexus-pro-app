'use client';

import { useRouter } from 'next/navigation';
import { useUser, useFirestore } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { 
  ShieldCheck, 
  Sparkles, 
  ChevronRight, 
  ArrowRight,
  LayoutDashboard,
  Building2,
  CheckCircle2,
  Zap,
  Globe,
  GraduationCap,
  Cpu,
  MousePointer2
} from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LandingPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

  const handleDashboardRedirect = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const ruolo = userDoc.data().ruolo;
        if (['super_admin', 'operatore', 'admin'].includes(ruolo)) {
          router.push('/admin');
        } else {
          router.push('/cliente');
        }
      } else {
        router.push('/login');
      }
    } catch (error) {
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-body selection:bg-indigo-500/30 selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/50 backdrop-blur-xl border-b border-white/5 h-20 flex items-center px-6 md:px-20 justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-headline font-bold text-white tracking-tight">AD next lab <span className="text-indigo-500">Pro</span></span>
        </div>
        <div className="flex items-center gap-4">
          {!isUserLoading && user ? (
            <Button onClick={handleDashboardRedirect} className="gradient-primary font-bold gap-2 rounded-full px-6 shadow-xl shadow-indigo-500/10">
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Button>
          ) : (
            <Link href="/login">
              <Button variant="ghost" className="text-slate-300 font-bold hover:text-white hover:bg-white/5">Accedi</Button>
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 md:px-20 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-600/10 blur-[120px] rounded-full -z-10" />
        
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 px-4 py-1.5 rounded-full text-xs font-bold border border-indigo-500/20 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> Nexus Pro v5.5: L'Hub del Futuro
          </div>
          <h1 className="text-5xl md:text-7xl font-headline font-bold text-white leading-tight">
            Smetti di spendere in Marketing. <br />
            <span className="gradient-text">Inizia a investire in Competenze.</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Il primo Hub italiano che unisce Formazione d'eccellenza, Strategia Digitale potenziata dall'AI e Automazione Tech.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
            <Button size="lg" className="gradient-primary text-lg font-bold h-14 px-10 rounded-full shadow-2xl shadow-indigo-500/20">
              Prenota Consulenza <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button onClick={handleDashboardRedirect} variant="outline" size="lg" className="text-lg font-bold h-14 px-10 rounded-full border-white/10 hover:bg-white/5 bg-transparent text-white">
              Area Riservata
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto mt-24 border-t border-white/5 pt-12">
          {[
            { label: "Aziende in Hub", val: "200+" },
            { label: "Professionisti", val: "5.000+" },
            { label: "Risparmio Tech", val: "40%" },
            { label: "Aumento ROI", val: "3x" }
          ].map((s, i) => (
            <div key={i} className="space-y-1">
              <div className="text-3xl font-bold text-white">{s.val}</div>
              <div className="text-xs font-bold uppercase tracking-widest text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pillars Section */}
      <section className="py-24 px-6 md:px-20 bg-slate-900/30">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-headline font-bold text-white">I 3 Pilastri di AD next lab</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Un ecosistema integrato per trasformare la tua presenza digitale.</p>
          </div>

          <Tabs defaultValue="digital" className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto bg-slate-900/50 border border-white/5 h-14 p-1 rounded-2xl mb-12">
              <TabsTrigger value="digital" className="rounded-xl data-[state=active]:bg-indigo-600 data-[state=active]:text-white font-bold">Digital</TabsTrigger>
              <TabsTrigger value="tech" className="rounded-xl data-[state=active]:bg-emerald-600 data-[state=active]:text-white font-bold">Tech</TabsTrigger>
              <TabsTrigger value="academy" className="rounded-xl data-[state=active]:bg-amber-600 data-[state=active]:text-white font-bold">Academy</TabsTrigger>
            </TabsList>
            
            <TabsContent value="digital" className="animate-in fade-in zoom-in-95 duration-500">
              <div className="grid lg:grid-cols-2 gap-12 items-center bg-slate-900/50 border border-white/5 p-8 md:p-16 rounded-[2.5rem]">
                <div className="space-y-6 text-left">
                  <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center">
                    <Globe className="w-6 h-6" />
                  </div>
                  <h3 className="text-4xl font-bold text-white">Marketing + IA</h3>
                  <p className="text-slate-400 leading-relaxed">Strategie di comunicazione basate sui dati e potenziate dall'Intelligenza Artificiale per massimizzare la visibilità e il conversion rate.</p>
                  <ul className="space-y-3">
                    {['Content Strategy AI-Driven', 'Social Media Management', 'Performance Marketing', 'SEO & Brand Positioning'].map((f, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-300 font-medium">
                        <CheckCircle2 className="w-5 h-5 text-indigo-500" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="aspect-video bg-indigo-600/20 rounded-3xl border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">Preview Strategia Digitale</div>
              </div>
            </TabsContent>

            <TabsContent value="tech" className="animate-in fade-in zoom-in-95 duration-500">
              <div className="grid lg:grid-cols-2 gap-12 items-center bg-slate-900/50 border border-white/5 p-8 md:p-16 rounded-[2.5rem]">
                <div className="space-y-6 text-left">
                  <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <h3 className="text-4xl font-bold text-white">Automazione & Software</h3>
                  <p className="text-slate-400 leading-relaxed">Costruiamo l'infrastruttura tecnologica che serve alla tua azienda per scalare senza aumentare il carico di lavoro manuale.</p>
                  <ul className="space-y-3">
                    {['CRM & Sales Automation', 'Sviluppo Web/App custom', 'Integrazioni API complesse', 'Nexus Pro SaaS Platform'].map((f, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-300 font-medium">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="aspect-video bg-emerald-600/20 rounded-3xl border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">Preview Automazione Tech</div>
              </div>
            </TabsContent>

            <TabsContent value="academy" className="animate-in fade-in zoom-in-95 duration-500">
              <div className="grid lg:grid-cols-2 gap-12 items-center bg-slate-900/50 border border-white/5 p-8 md:p-16 rounded-[2.5rem]">
                <div className="space-y-6 text-left">
                  <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <h3 className="text-4xl font-bold text-white">Formazione Master</h3>
                  <p className="text-slate-400 leading-relaxed">Trasferiamo le nostre competenze al tuo team per renderti indipendente e padrone delle tecnologie di domani.</p>
                  <ul className="space-y-3">
                    {['Masterclass AI Generativa', 'Formazione Digital Marketing', 'Workshop Automazione', 'Mentoring per Manager'].map((f, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-300 font-medium">
                        <CheckCircle2 className="w-5 h-5 text-amber-500" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="aspect-video bg-amber-600/20 rounded-3xl border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold">Preview ADNext Academy</div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Methodology */}
      <section className="py-24 px-6 md:px-20 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-headline font-bold text-center mb-20 text-white">Metodologia ADNext</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            { step: "01", title: "Audit", desc: "Analisi profonda dei dati e dei processi attuali.", icon: MousePointer2 },
            { step: "02", title: "Strategia", desc: "Design del piano d'azione personalizzato.", icon: ShieldCheck },
            { step: "03", title: "Build", desc: "Implementazione tech e produzione creativa.", icon: Cpu },
            { step: "04", title: "Optimize", desc: "Monitoraggio real-time e scalabilità.", icon: Zap }
          ].map((m, i) => (
            <div key={i} className="relative p-8 glass-card rounded-3xl space-y-4 group hover:border-indigo-500/50 transition-colors">
              <div className="text-4xl font-black text-white/5 absolute top-4 right-6">{m.step}</div>
              <div className="w-10 h-10 bg-indigo-600/20 text-indigo-400 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <m.icon className="w-5 h-5" />
              </div>
              <h4 className="text-xl font-bold text-white">{m.title}</h4>
              <p className="text-slate-400 text-sm leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 md:px-20 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[3rem] p-12 md:p-24 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 text-center space-y-8 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-headline font-bold leading-tight">Pronto a scalare la tua azienda?</h2>
            <p className="text-indigo-100 text-xl">Entra nel futuro del marketing digitale. Prenota oggi la tua sessione strategica gratuita.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Button size="lg" className="bg-white text-indigo-600 hover:bg-slate-100 font-bold h-16 px-12 rounded-full text-xl">
                Prenota Consulenza
              </Button>
              <Button onClick={() => router.push('/login')} variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 font-bold h-16 px-12 rounded-full text-xl bg-transparent">
                Accedi Hub
              </Button>
            </div>
          </div>
          {/* Background effects */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 px-6 md:px-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="font-headline font-bold text-white text-lg tracking-tight">AD next lab</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">© {new Date().getFullYear()} AD next lab Hub Digitale. Tutti i diritti riservati.</p>
          <div className="flex gap-8 text-sm font-bold text-slate-400">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Termini</Link>
            <Link href="#" className="hover:text-white transition-colors">Supporto</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}