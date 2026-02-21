
'use client';

import { useParams } from "next/navigation";
import { MOCK_CLIENTS, MOCK_POSTS, MOCK_MATERIALS } from "@/lib/mock-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PostStatoChip, MaterialeStatoChip } from "@/components/status-chips";
import { CalendarDays, FolderOpen, MoreVertical, Plus, CheckCircle2, XCircle } from "lucide-react";
import { PostGenerator } from "@/components/post-generator";

export default function AdminClientDetail() {
  const { id } = useParams();
  const client = MOCK_CLIENTS.find(c => c.id === id);
  const posts = MOCK_POSTS[id as string] || [];
  const materials = MOCK_MATERIALS[id as string] || [];

  if (!client) return <div>Cliente non trovato</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-headline font-bold text-primary">{client.nome_azienda}</h1>
            <Button variant="ghost" size="icon"><MoreVertical className="w-5 h-5" /></Button>
          </div>
          <p className="text-muted-foreground">{client.settore} • {client.email_riferimento}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-primary text-primary">Invia Report</Button>
          <Button className="bg-primary">Crea Nuovo Post</Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Tabs defaultValue="calendar" className="w-full">
            <TabsList className="bg-muted p-1 mb-4">
              <TabsTrigger value="calendar" className="flex gap-2">
                <CalendarDays className="w-4 h-4" /> Calendario Editoriale
              </TabsTrigger>
              <TabsTrigger value="materials" className="flex gap-2">
                <FolderOpen className="w-4 h-4" /> Materiali & Asset
              </TabsTrigger>
            </TabsList>

            <TabsContent value="calendar" className="space-y-4">
              {posts.length === 0 ? (
                <Card className="flex flex-col items-center justify-center p-12 text-center">
                  <CalendarDays className="w-12 h-12 text-muted-foreground mb-4 opacity-20" />
                  <h3 className="text-lg font-medium">Nessun post pianificato</h3>
                  <p className="text-muted-foreground max-w-xs mx-auto">Inizia a creare il calendario editoriale per questo cliente.</p>
                </Card>
              ) : (
                posts.map(post => (
                  <Card key={post.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <CardTitle className="text-lg font-headline">{post.titolo}</CardTitle>
                          <CardDescription>Pianificato per: {post.data_pubblicazione ? new Date(post.data_pubblicazione).toLocaleDateString() : 'Non impostata'}</CardDescription>
                        </div>
                        <PostStatoChip stato={post.stato} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm line-clamp-3 text-muted-foreground leading-relaxed italic border-l-2 border-accent/20 pl-4 bg-muted/30 p-2 rounded-r">
                        "{post.testo}"
                      </p>
                    </CardContent>
                    <CardFooter className="pt-2 border-t flex justify-end gap-2">
                      <Button variant="ghost" size="sm">Modifica</Button>
                      <Button variant="outline" size="sm" className="text-primary border-primary">Pubblica</Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="materials" className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                {materials.map(mat => (
                  <Card key={mat.id} className="overflow-hidden">
                    <div className="h-32 bg-muted flex items-center justify-center border-b group relative">
                      <FolderOpen className="w-10 h-10 text-muted-foreground/30" />
                      {mat.stato_validazione === 'in_attesa' && (
                         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition-opacity">
                            <Button size="icon" variant="secondary" className="h-10 w-10 bg-green-500 hover:bg-green-600 border-none"><CheckCircle2 className="text-white"/></Button>
                            <Button size="icon" variant="secondary" className="h-10 w-10 bg-red-500 hover:bg-red-600 border-none"><XCircle className="text-white"/></Button>
                         </div>
                      )}
                    </div>
                    <CardHeader className="p-4">
                      <div className="flex flex-col gap-2">
                        <span className="font-medium truncate" title={mat.nome_file}>{mat.nome_file}</span>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">{new Date(mat.creato_il).toLocaleDateString()}</span>
                          <MaterialeStatoChip stato={mat.stato_validazione} />
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
                <Card className="border-dashed flex flex-col items-center justify-center p-8 h-full bg-accent/5 hover:bg-accent/10 transition-colors cursor-pointer border-2">
                   <Plus className="w-8 h-8 text-accent mb-2" />
                   <span className="text-sm font-medium text-accent">Carica Asset</span>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <PostGenerator clientName={client.nome_azienda} clientIndustry={client.settore} />
          
          <Card className="bg-primary text-primary-foreground overflow-hidden">
            <CardHeader className="pb-0">
               <CardTitle className="text-lg font-headline">Statistiche Account</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-6">
                <div className="text-center flex-1 border-r border-primary-foreground/20">
                  <div className="text-3xl font-bold">{client.post_totali}</div>
                  <div className="text-[10px] uppercase opacity-60">Totali</div>
                </div>
                <div className="text-center flex-1 border-r border-primary-foreground/20">
                  <div className="text-3xl font-bold">{client.post_usati}</div>
                  <div className="text-[10px] uppercase opacity-60">Utilizzati</div>
                </div>
                <div className="text-center flex-1">
                  <div className="text-3xl font-bold">{client.post_totali - client.post_usati}</div>
                  <div className="text-[10px] uppercase opacity-60">Residui</div>
                </div>
              </div>
              <Button variant="secondary" className="w-full">Modifica Piano</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
