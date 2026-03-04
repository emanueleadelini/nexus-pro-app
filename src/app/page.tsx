
"use client";

import { useState, useEffect, useRef } from 'react';
import {
  Menu, X, ArrowRight, Sparkles, Zap,
  Users, CheckCircle2,
  Lock, Mail, Play, FileText,
  Bell, RefreshCw, Calculator, MessageSquare,
  TrendingUp, Clock, Award, Star, ArrowUpRight,
  Building2, UtensilsCrossed, Megaphone, ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Messaggio inviato!',
      description: 'Ti contatteremo entro 24 ore.',
    });
    setContactOpen(false);
  };

  const products = [
    {
      id: 'nexuspro',
      name: 'Nexus Pro',
      tagline: 'Per Agenzie di Comunicazione',
      description: 'Hub digitale completo per gestire clienti, contenuti e workflow di approvazione. Silenzio assenso in 24h.',
      icon: Megaphone,
      color: 'from-violet-600 to-purple-600',
      bgGlow: 'bg-violet-500/20',
      stats: [
        { value: '150+', label: 'Agenzie' },
        { value: '2M+', label: 'Contenuti' },
        { value: '98%', label: 'Approvazione' }
      ],
      features: ['Workflow Silenzio Assenso', 'Dashboard Clienti', 'Analytics Real-time', 'AI Content Assistant'],
      cta: 'Prova Nexus Pro',
      demo: 'Guarda Demo',
      href: '/login?entry=client'
    },
    {
      id: 'placeat',
      name: 'Placeat',
      tagline: 'Per Ristoranti, Pizzerie, Bar & Agriturismi',
      description: 'Gestione tavoli interattiva con piantina personalizzata e sistema automatico di raccolta recensioni Google.',
      icon: UtensilsCrossed,
      color: 'from-emerald-500 to-teal-600',
      bgGlow: 'bg-emerald-500/20',
      stats: [
        { value: '300%', label: '+ Recensioni' },
        { value: '10min', label: 'Setup' },
        { value: '4.8★', label: 'Media' }
      ],
      features: ['Editor Piantina Interattivo', 'QR Code Recensioni', 'Prenotazioni Online', 'ReviewFlow Automatico'],
      cta: 'Prova Placeat',
      demo: 'Guarda Demo',
      href: '/placeat'
    }
  ];

  const professionalTools = [
    {
      id: 'fatturaparse',
      name: 'FatturaParse',
      tagline: 'Estrazione Automatica Fatture',
      description: 'Estrazione dati da fatture elettroniche XML (FatturaPA) e PDF. Zero data entry, 100% accuratezza su XML.',
      icon: FileText,
      color: 'from-blue-500 to-cyan-500',
      badge: 'ROI in 2 settimane',
      specs: [
        { label: 'XML', value: '17 Campi' },
        { label: 'Accuracy', value: '100%' },
        { label: 'Speed', value: '0.3s/doc' }
      ],
      features: [
        'FatturaPA XML: estrazione deterministica',
        'PDF: regex + AI fallback',
        'Output Google Sheets con dedup',
        '17 campi estratti per fattura'
      ],
      value: '€3.000',
      price: 'da €49/mese',
      cta: 'Richiedi Demo',
      demo: 'Guarda Demo'
    },
    {
      id: 'normaguard',
      name: 'NormaGuard',
      tagline: 'Monitoraggio Normativa Fiscale',
      description: 'Monitoraggio automatico normativa fiscale e professionale. Gazzetta Ufficiale, Agenzia delle Entrate, CNDCEC.',
      icon: Bell,
      color: 'from-amber-500 to-orange-500',
      badge: 'Risparmio 5h/settimana',
      specs: [
        { label: 'Fonti', value: '3' },
        { label: 'Classificazione', value: 'AI' },
        { label: 'Bollettino', value: 'Daily' }
      ],
      features: [
        'RSS da GU, AdE, CNDCEC',
        'Classificazione per rilevanza',
        'Categorizzazione: fiscale, lavoro, società',
        'Bollettino su Google Sheets'
      ],
      value: '€1.000',
      price: 'da €49/mese',
      cta: 'Richiedi Demo',
      demo: 'Guarda Demo'
    },
    {
      id: 'fatturamatch',
      name: 'FatturaMatch',
      tagline: 'Riconciliazione Automatica',
      description: 'Riconciliazione automatica fatture emesse vs ricevute. Importa CSV, trova discrepanze, genera report.',
      icon: RefreshCw,
      color: 'from-pink-500 to-rose-500',
      badge: 'Da 30min a 3sec',
      specs: [
        { label: 'Matched', value: '247' },
        { label: 'Warning', value: '3' },
        { label: 'Accuracy', value: '98.4%' }
      ],
      features: [
        'Import CSV con rilevamento colonne',
        'Matching fuzzy numero fattura',
        'Tolleranza importo configurabile',
        'Report per severità'
      ],
      value: '€1.500',
      price: 'da €49/mese',
      cta: 'Richiedi Demo',
      demo: 'Guarda Demo'
    },
    {
      id: 'fiscoauto',
      name: 'FiscoAuto',
      tagline: 'Automazione Dichiarazioni Fiscali',
      description: 'Automazione dichiarazioni fiscali e liquidazioni IVA. Calcola IVA dovuta, ritenute, genera bozze F24.',
      icon: Calculator,
      color: 'from-indigo-500 to-blue-600',
      badge: 'Da 4h a 3sec',
      specs: [
        { label: 'IVA', value: '4 Aliquote' },
        { label: 'F24', value: 'Auto' },
        { label: 'Breakdown', value: 'Full' }
      ],
      features: [
        'Liquidazione IVA automatica',
        'Bozza F24 codici tributo corretti',
        'Breakdown per aliquota IVA',
        'Input da CSV o Google Sheets'
      ],
      value: '€2.000',
      price: 'da €49/mese',
      cta: 'Richiedi Demo',
      demo: 'Guarda Demo'
    },
    {
      id: 'studioflow',
      name: 'StudioFlow',
      tagline: 'CRM per Studi Professionali',
      description: 'CRM automatizzato per studi professionali. Promemoria scadenze, follow-up clienti, raccolta documenti.',
      icon: MessageSquare,
      color: 'from-emerald-500 to-green-600',
      badge: 'Zero scadenze perse',
      specs: [
        { label: 'Scadenze', value: '2026' },
        { label: 'Promemoria', value: 'Auto' },
        { label: 'Follow-up', value: 'Smart' }
      ],
      features: [
        'Calendario scadenze fiscali 2026',
        'Promemoria automatici',
        'Follow-up clienti inattivi',
        'Bozze Gmail con labels'
      ],
      value: '€1.500',
      price: 'da €49/mese',
      cta: 'Richiedi Demo',
      demo: 'Guarda Demo'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/50' : 'bg-transparent'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl blur-sm" />
                <div className="relative w-full h-full bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  AD Next Lab
                </span>
                <span className="hidden sm:block text-xs text-slate-500">Innovation Studio</span>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-1">
              {[
                { label: 'Prodotti', id: 'prodotti' },
                { label: 'Tool Professionali', id: 'tools' },
                { label: 'Processo', id: 'processo' },
                { label: 'Contatti', id: 'contatti' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800/50"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <a
                href="/login?entry=admin"
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors rounded-lg hover:bg-indigo-500/10 font-bold border border-indigo-500/20"
              >
                <ShieldCheck className="w-4 h-4" />
                Area Agenzia
              </a>
              <a
                href="/login?entry=client"
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800/50"
              >
                <Lock className="w-4 h-4" />
                Area Clienti
              </a>
              <Button
                onClick={() => setContactOpen(true)}
                className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white border-0 shadow-lg shadow-indigo-500/25"
              >
                Inizia Ora
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-slate-800/50"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-950/98 backdrop-blur-xl border-b border-slate-800">
            <div className="px-4 py-6 space-y-2">
              {[
                { label: 'Prodotti', id: 'prodotti' },
                { label: 'Tool Professionali', id: 'tools' },
                { label: 'Processo', id: 'processo' },
                { label: 'Contatti', id: 'contatti' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <a href="/login?entry=admin" className="flex items-center gap-2 px-4 py-3 text-indigo-400 hover:text-indigo-300 hover:bg-slate-800/50 rounded-lg font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  Area Agenzia (Admin)
                </a>
                <a href="/login?entry=client" className="flex items-center gap-2 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg">
                  <Lock className="w-4 h-4" />
                  Area Clienti
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-slate-950">
          <div
            className="absolute w-[800px] h-[800px] rounded-full blur-[150px] transition-all duration-1000 ease-out"
            style={{
              background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)',
              left: `${mousePosition.x * 30}%`,
              top: `${mousePosition.y * 30}%`,
              transform: 'translate(-50%, -50%)'
            }}
          />
          <div
            className="absolute w-[600px] h-[600px] rounded-full blur-[120px] transition-all duration-1000 ease-out"
            style={{
              background: 'radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)',
              right: `${(1 - mousePosition.x) * 20}%`,
              bottom: `${(1 - mousePosition.y) * 20}%`,
              transform: 'translate(50%, 50%)'
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                <span className="text-sm text-indigo-300">Hub SaaS per Agenzie & Professionisti</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                <span className="block text-white">I nostri software ti aiuteranno</span>
                <span className="block bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
                  ad ottimizzare i tuoi processi aziendali.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-400 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                Costruiamo <strong>tool intelligenti</strong> per aziende, ristoranti e studi professionali.
                Testati, pronti, con <span className="text-emerald-400">risultati garantiti</span>.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12">
                <Button
                  size="lg"
                  onClick={() => scrollToSection('prodotti')}
                  className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white border-0 px-8 h-14 text-lg shadow-xl shadow-indigo-500/25 transition-all"
                >
                  Scopri i Prodotti
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setContactOpen(true)}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white px-8 h-14 text-lg"
                >
                  <Play className="mr-2 w-5 h-5" />
                  Richiedi Demo
                </Button>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-violet-500/20 to-emerald-500/20 rounded-3xl blur-3xl" />
                <div className="absolute top-0 right-0 w-64 transform rotate-6 hover:rotate-0 transition-transform duration-500">
                  <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 shadow-2xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Megaphone className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">Nexus Pro</div>
                        <div className="text-xs text-slate-400">Agenzie</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">98%</div>
                    <div className="text-xs text-slate-500">Tasso approvazione</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS SECTION */}
      <section id="prodotti" className="py-24 lg:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
              I Nostri Prodotti
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">
              Soluzioni per Ogni Settore
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {products.map((product) => (
              <Card key={product.id} className="group bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all duration-500 overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-2">
                    <div className={`relative p-8 bg-gradient-to-br ${product.color} overflow-hidden`}>
                      <div className={`absolute inset-0 ${product.bgGlow} blur-3xl`} />
                      <div className="relative">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mb-6">
                          <product.icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">{product.name}</h3>
                        <p className="text-white/80 text-sm">{product.tagline}</p>
                      </div>
                    </div>
                    <div className="p-8">
                      <p className="text-slate-400 mb-6">{product.description}</p>
                      <ul className="space-y-3 mb-8">
                        {product.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <div className="flex gap-3">
                        <a href={product.href} className="flex-1">
                          <Button className={`w-full bg-gradient-to-r ${product.color} hover:opacity-90 text-white border-0`}>
                            {product.cta}
                            <ArrowRight className="ml-2 w-4 h-4" />
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* PROFESSIONAL TOOLS SECTION */}
      <section id="tools" className="py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
              Suite Professionale
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">
              Automazione per Professionisti
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {professionalTools.map((tool) => (
              <Card key={tool.id} className="group bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${tool.color} rounded-xl flex items-center justify-center`}>
                      <tool.icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge className="bg-slate-800 text-slate-300 border-slate-700">{tool.badge}</Badge>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{tool.name}</h3>
                  <p className="text-slate-400 text-sm mb-6">{tool.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <div className="text-lg font-bold text-emerald-400">{tool.price}</div>
                    <Button
                      size="sm"
                      onClick={() => setContactOpen(true)}
                      className={`bg-gradient-to-r ${tool.color} hover:opacity-90 text-white border-0`}
                    >
                      Demo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl blur-sm" />
                  <div className="relative w-full h-full bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <span className="text-xl font-bold text-white">AD Next Lab</span>
                  <span className="block text-xs text-slate-500">Innovation Studio</span>
                </div>
              </div>
              <p className="text-slate-400 text-sm max-w-sm">
                Software specializzati per agenzie, ristoranti e studi professionali.
                Testati, pronti, risultati dal giorno 1.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Prodotti</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/login?entry=client" className="text-slate-400 hover:text-white">Nexus Pro</a></li>
                <li><a href="/placeat" className="text-slate-400 hover:text-white">Placeat</a></li>
                <li><button onClick={() => scrollToSection('tools')} className="text-slate-400 hover:text-white">Suite Tool</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Area Riservata</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/login?entry=admin" className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    Accesso Agenzia (Admin)
                  </a>
                </li>
                <li>
                  <a href="/login?entry=client" className="flex items-center gap-2 text-slate-400 hover:text-white">
                    <Lock className="w-4 h-4" />
                    Area Clienti
                  </a>
                </li>
                <li>
                  <button onClick={() => setContactOpen(true)} className="text-slate-400 hover:text-white">
                    Richiedi Supporto
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">© 2024 AD Next Lab. Tutti i diritti riservati.</p>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <a href="#" className="hover:text-white">Privacy</a>
              <a href="#" className="hover:text-white">Termini</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Contact Dialog */}
      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Richiedi Demo</DialogTitle>
            <DialogDescription className="text-slate-400">
              Compila il form e ti contatteremo entro 24 ore.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleContactSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-bold uppercase">Nome e Cognome *</label>
              <Input placeholder="Mario Rossi" className="bg-slate-800 border-slate-700" required />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-bold uppercase">Email *</label>
              <Input type="email" placeholder="mario@azienda.it" className="bg-slate-800 border-slate-700" required />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-bold uppercase">Messaggio</label>
              <Textarea placeholder="Descrivi le tue esigenze..." className="bg-slate-800 border-slate-700 min-h-[100px]" />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white">
              Invia Richiesta
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
