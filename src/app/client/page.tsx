
'use client';

import { MOCK_CLIENTS, MOCK_POSTS, MOCK_MATERIALS } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PostStatoChip, MaterialeStatoChip } from "@/components/status-chips";
import { CalendarCheck, Upload, HelpCircle, ArrowUpRight, Check, X, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export default function ClientDashboard() {
  const client = MOCK_CLIENTS[0]; // Simulate logged in client
  const posts = MOCK_POSTS[client.id] || [];
  const materials = MOCK_MATERIALS[client.id] || [];
  const { toast } = useToast();

  const handleApprove = (postTitle: string) => {
    toast({
      title: "Post Approvato!",
      description: `Il post "${postTitle}" è stato approvato per la pubblicazione.`,
    });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-bold text-primary">Benvenuto, {client.nome_azienda}</h1>
          <p className="text-muted-foreground">Ecco la panoramica del tuo piano di comunicazione.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="flex gap-2">
             <HelpCircle className="w-4 h-4" /> Supporto
           </Button>
           <Button className="bg-accent text-primary-foreground hover:bg-accent/90 flex gap-2">
             <Upload className="w-4 h-4" /> Nuovo Materiale
           </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <Card className="md:col-span-1 shadow-lg bg-white overflow-hidden">
          <CardHeader className="bg-accent text-primary-foreground">
            <CardTitle className="text-xl font-headline">Il Tuo Saldo Post</CardTitle>
            <CardDescription className="text-primary-foreground/80">Rinnovo previsto per fine mese</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="flex items-center justify-between">
               <span className="text-sm font-medium">Post Rimanenti</span>
               <span className="text-2xl font-bold">{client.post_totali - client.post_usati} / {client.post_totali}</span>
            </div>
            <Progress value={((client.post_usati) / client.post_totali) * 100} className="h-3" />
            <div className="bg-muted p-4 rounded-lg">
               <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2 flex items-center gap-2">
                 <CalendarCheck className="w-3 h-3 text-accent" /> Prossima Uscita
               </h4>
               <p className="text-sm font-medium">Natale Gourmet 2023</p>
               <p className="text-xs text-muted-foreground">Venerdì 15 Dicembre</p>
            </div>
            <Button variant="link" className="w-full text-accent p-0 flex items-center justify-center gap-1">
               Richiedi Post Extra <ArrowUpRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
           <Tabs defaultValue="posts" className="w-full">
             <TabsList className="mb-4">
               <TabsTrigger value="posts">Calendario Editoriale</TabsTrigger>
               <TabsTrigger value="materials">Asset Inviati</TabsTrigger>
             </TabsList>
             
             <TabsContent value="posts" className="space-y-4">
               {posts.filter(p => p.stato === 'da_approvare').length > 0 && (
                 <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-center justify-between mb-4">
                    <div className="flex gap-3 items-center">
                       <HelpCircle className="w-5 h-5 text-amber-500" />
                       <span className="text-sm text-amber-800 font-medium">Hai post in attesa di approvazione!</span>
                    </div>
                 </div>
               )}
               {posts.map(post => (
                 <Card key={post.id} className="group transition-all hover:border-accent">
                   <CardHeader className="pb-2">
                     <div className="flex justify-between items-start">
                        <div className="space-y-1">
                           <CardTitle className="text-lg font-headline">{post.titolo}</CardTitle>
                           <CardDescription>Target: Feed Instagram + Storie</CardDescription>
                        </div>
                        <PostStatoChip stato={post.stato} />
                     </div>
                   </CardHeader>
                   <CardContent>
                      <p className="text-sm text-muted-foreground bg-muted/20 p-4 rounded-md italic">
                        "{post.testo}"
                      </p>
                   </CardContent>
                   {post.stato === 'da_approvare' && (
                     <CardFooter className="flex justify-end gap-3 pt-0">
                       <Button variant="ghost" className="text-destructive hover:bg-destructive/5"><X className="w-4 h-4 mr-2" /> Rifiuta</Button>
                       <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => handleApprove(post.titolo)}>
                         <Check className="w-4 h-4 mr-2" /> Approva Post
                       </Button>
                     </CardFooter>
                   )}
                 </Card>
               ))}
             </TabsContent>

             <TabsContent value="materials" className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                   {materials.map(mat => (
                     <Card key={mat.id} className="group">
                       <CardContent className="p-4 flex gap-4 items-center">
                          <div className="p-3 bg-muted rounded-lg group-hover:bg-accent/10 transition-colors">
                             <FileText className="w-6 h-6 text-primary group-hover:text-accent" />
                          </div>
                          <div className="flex-1 min-w-0">
                             <p className="font-medium text-sm truncate">{mat.nome_file}</p>
                             <MaterialeStatoChip stato={mat.stato_validazione} />
                          </div>
                       </CardContent>
                       {mat.stato_validazione === 'rifiutato' && mat.note_rifiuto && (
                         <div className="px-4 pb-4">
                            <div className="text-[10px] text-rose-600 font-bold uppercase mb-1">Motivo Rifiuto</div>
                            <p className="text-xs text-muted-foreground bg-rose-50 p-2 rounded border border-rose-100">{mat.note_rifiuto}</p>
                         </div>
                       )}
                     </Card>
                   ))}
                </div>
             </TabsContent>
           </Tabs>
        </div>
      </div>
    </div>
  );
}
