
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useFirestore, useMemoFirebase, useCollection, useDoc, useAuth, useUser } from '@/firebase';
import { collection, doc, query, orderBy, updateDoc, serverTimestamp, deleteDoc, increment, arrayUnion, Timestamp, getDocs, where } from 'firebase/firestore';
import { StatoPost, STATO_POST_LABELS, STATO_POST_COLORS, Post } from '@/types/post';
import { Material, getFileTypeInfo, STATO_VALIDAZIONE_LABELS, STATO_VALIDAZIONE_COLORS, DESTINAZIONE_LABELS } from '@/types/material';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  CalendarDays, 
  FolderOpen, 
  Sparkles, 
  ChevronLeft, 
  UploadCloud, 
  Edit3, 
  Trash2, 
  MessageSquare, 
  LayoutGrid, 
  List, 
  ShieldAlert, 
  KeyRound, 
  Download, 
  Plus,
  Loader2,
  History,
  ShieldCheck,
  Briefcase,
  PieChart,
  FileText,
  Zap,
  Clock
} from 'lucide-react';
import { useState } from 'react';
import { GeneraBozzaModal } from '@/components/admin/genera-bozza-modal';
import { CreaPostManualeModal } from '@/components/admin/crea-post-manuale-modal';
import { ModificaPostModal } from '@/components/admin/modifica-post-modal';
import { ModificaPianoModal } from '@/components/admin/modifica-piano-modal';
import { CaricaMaterialeModal } from '@/components/admin/carica-materiale-modal';
import { CommentiSidebar } from '@/components/commenti-sidebar';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { usePermessi } from '@/hooks/use-permessi';
import { CalendarioVisuale } from '@/components/admin/calendario-visuale';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const TRANSIZIONI_PERMESSE: Record<StatoPost, StatoPost[]> = {
  bozza: ["da_approvare"],
  revisione_interna: ["da_approvare"],
  da_approvare: ["approvato", "revisione"],
  revisione: ["da_approvare"],
  approvato: ["programmato", "pubblicato"],
  programmato: ["pubblicato"],
  pubblicato: []
};

export default function ClienteDettaglio() {
  const { clienteId } = useParams() as { clienteId: string };
  const db = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  const [isGeneraOpen, setIsGeneraOpen] = useState(false);
  const [isCreaManualeOpen, setIsCreaManualeOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isPianoOpen, setIsPianoOpen] = useState(false);
  const [postDaModificare, setPostDaModificare] = useState<Post | null>(null);
  const [postPerCommenti, setPostPerCommenti] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState('');

  const clientDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(db, 'clienti', clienteId);
  }, [db, clienteId, user]);
  const { data: client, isLoading: isClientLoading } = useDoc<any>(clientDocRef);

  const postsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(db, 'clienti', clienteId, 'post'), orderBy('creato_il', 'desc'));
  }, [db, clienteId, user]);
  const { data: posts } = useCollection<Post>(postsQuery);

  const materialsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(db, 'clienti', clienteId, 'materiali'), orderBy('creato_il', 'desc'));
  }, [db, clienteId, user]);
  const { data: materials } = useCollection<Material>(materialsQuery);

  const handleTransizione = (post: Post, nuovoStato: StatoPost) => {
    if (!user) return;
    const postRef = doc(db, 'clienti', clienteId, 'post', post.id);
    
    // Logica Silenzio Assenso: se invio in approvazione, calcolo scadenza
    const updateData: any = { 
      stato: nuovoStato, 
      aggiornato_il: serverTimestamp(),
      storico_stati: arrayUnion({
        stato: nuovoStato,
        autore_uid: user.uid,
        timestamp: Timestamp.now(),
        nota: `Workflow 2.0: Spostato in ${STATO_POST_LABELS[nuovoStato]}`
      })
    };

    if (nuovoStato === 'da_approvare') {
      const scadenza = new Date();
      scadenza.setHours(scadenza.getHours() + 24);
      updateData.scadenza_approvazione = Timestamp.fromDate(scadenza);
    }

    updateDoc(postRef, updateData).catch(e => errorEmitter.emit('permission-error', new FirestorePermissionError({ path: postRef.path, operation: 'update' })));
    toast({ title: "Stato Aggiornato", description: `Post ora in ${STATO_POST_LABELS[nuovoStato]}` });
  };

  if (isClientLoading) return <div className="p-8"><Skeleton className="h-64"/></div>;
  if (!client) return <div className="p-8">Cliente non trovato.</div>;

  const usagePercent = (client.post_usati / (client.post_totali || 1)) * 100;
  
  return (
    <div className="space-y-8">
      {/* Header Admin */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center overflow-hidden">
            {client.logo_url ? <img src={client.logo_url} className="w-full h-full object-cover" /> : <Briefcase className="w-8 h-8 text-indigo-200" />}
          </div>
          <div>
            <h1 className="text-4xl font-headline font-bold">{client.nome_azienda}</h1>
            <p className="text-muted-foreground">{client.settore} • Gestione Workflow 24h</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setIsCreaManualeOpen(true)} className="border-indigo-600 text-indigo-700"><Plus className="w-4 h-4 mr-2"/> Nuovo Post</Button>
          <Button onClick={() => setIsGeneraOpen(true)} className="bg-violet-600 shadow-lg"><Sparkles className="w-4 h-4 mr-2"/> Genera AI</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <Tabs defaultValue="list">
            <TabsList className="bg-transparent border-b rounded-none h-12 w-full justify-start p-0 mb-6">
              <TabsTrigger value="list" className="data-[state=active]:border-b-2 border-indigo-600 px-6">Elenco Post & Workflow</TabsTrigger>
              <TabsTrigger value="visual" className="px-6">Calendario</TabsTrigger>
              <TabsTrigger value="strategic" className="px-6">Strategia</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-4">
               {posts?.map(post => (
                 <Card key={post.id} className={`hover:shadow-md transition-shadow ${post.stato === 'da_approvare' ? 'border-amber-200 bg-amber-50/10' : ''}`}>
                    <CardHeader className="pb-3 flex flex-row items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge className={`${STATO_POST_COLORS[post.stato].bg} ${STATO_POST_COLORS[post.stato].text} border-none text-[10px] uppercase`}>
                          {STATO_POST_LABELS[post.stato]}
                        </Badge>
                        <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                          {post.tipo_pianificazione === 'immediata' ? <Zap className="w-3 h-3 text-amber-500" /> : <Clock className="w-3 h-3" />}
                          {post.tipo_pianificazione === 'immediata' ? 'IMMEDIATA' : 'PROGRAMMATA'}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setPostPerCommenti(post.id)}><MessageSquare className="w-4 h-4"/></Button>
                        <Button variant="ghost" size="icon" onClick={() => setPostDaModificare(post)}><Edit3 className="w-4 h-4"/></Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <h4 className="font-bold">{post.titolo}</h4>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">{post.testo}</p>
                    </CardContent>
                    <CardFooter className="bg-gray-50/50 p-3 flex justify-between items-center">
                       <div className="text-[10px] font-bold text-gray-400">
                         {post.stato === 'da_approvare' && post.scadenza_approvazione && (
                           <span className="text-amber-600 flex items-center gap-1">
                             <Timer className="w-3 h-3" /> Silenzio assenso: {post.scadenza_approvazione.toDate().toLocaleString()}
                           </span>
                         )}
                       </div>
                       <div className="flex gap-2">
                         {TRANSIZIONI_PERMESSE[post.stato].map(next => (
                           <Button key={next} size="sm" onClick={() => handleTransizione(post, next)} className={`h-8 text-[10px] font-bold uppercase ${STATO_POST_COLORS[next].bg} ${STATO_POST_COLORS[next].text} border-none`}>
                             Passa a {STATO_POST_LABELS[next]}
                           </Button>
                         ))}
                       </div>
                    </CardFooter>
                 </Card>
               ))}
            </TabsContent>

            <TabsContent value="visual">
              {posts && <CalendarioVisuale clienteId={clienteId} posts={posts} onAddPost={() => setIsCreaManualeOpen(true)} />}
            </TabsContent>

            <TabsContent value="strategic" className="space-y-6">
              {/* Strategia docs */}
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card className="rounded-xl shadow-md border-indigo-100">
            <CardHeader className="bg-indigo-600 text-white rounded-t-xl"><CardTitle className="text-lg">Crediti & Piano</CardTitle></CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="text-center bg-gray-50 rounded-xl p-4 border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Post Residui</span>
                <div className="text-5xl font-bold mt-1">{Math.max(0, (client.post_totali || 0) - (client.post_usati || 0))}</div>
              </div>
              <Progress value={usagePercent} className="h-2" />
              <Button variant="outline" className="w-full text-indigo-600" onClick={() => setIsPianoOpen(true)}>Gestisci Piano</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <GeneraBozzaModal isOpen={isGeneraOpen} onClose={() => setIsGeneraOpen(false)} clienteId={clienteId} clienteNome={client.nome_azienda} clienteSettore={client.settore || ''} />
      <CreaPostManualeModal isOpen={isCreaManualeOpen} onClose={() => setIsCreaManualeOpen(false)} clienteId={clienteId} />
      <ModificaPostModal isOpen={!!postDaModificare} onClose={() => setPostDaModificare(null)} clienteId={clienteId} post={postDaModificare} />
      <ModificaPianoModal isOpen={isPianoOpen} onClose={() => setIsPianoOpen(false)} clienteId={clienteId} postTotaliAttuali={client.post_totali} includeBP={client.include_business_plan} includeBM={client.include_business_model} />
      <CaricaMaterialeModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} clienteId={clienteId} />
      {postPerCommenti && <CommentiSidebar clienteId={clienteId} postId={postPerCommenti} isOpen={!!postPerCommenti} onClose={() => setPostPerCommenti(null)} />}
    </div>
  );
}
