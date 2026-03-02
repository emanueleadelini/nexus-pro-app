'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { query, collection, where, orderBy, limit, collectionGroup } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Users, 
  FileText, 
  Clock, 
  TrendingUp, 
  Plus, 
  ArrowRight, 
  CheckCircle2,
  Calendar,
  AlertCircle,
  Zap
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user, userData, isAdmin } = useUser();
  const db = useFirestore();

  const clientsQuery = useMemoFirebase(() => {
    if (!user || !isAdmin) return null;
    return query(collection(db, 'clienti'), orderBy('creato_il', 'desc'), limit(5));
  }, [db, user, isAdmin]);
  const { data: clients, isLoading: isClientsLoading } = useCollection<any>(clientsQuery);

  const pendingPostsQuery = useMemoFirebase(() => {
    if (!user || !isAdmin) return null;
    return query(
      collectionGroup(db, 'post'), 
      where('stato', '==', 'da_approvare'),
      limit(5)
    );
  }, [db, user, isAdmin]);
  const { data: pendingPosts, isLoading: isPostsLoading } = useCollection<any>(pendingPostsQuery);

  const totalUsed = clients?.reduce((acc: number, c: any) => acc + (c.post_usati || 0), 0) || 0;

  if (isClientsLoading || isPostsLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-2xl bg-white/5" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-[400px] rounded-2xl bg-white/5" />
          <Skeleton className="h-[400px] rounded-2xl bg-white/5" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-white mb-2">Hub Direzionale</h1>
          <p className="text-slate-400 font-medium">Benvenuto nel cockpit di AD next lab, {userData?.email.split('@')[0]}.</p>
        </div>
        <Link href="/admin/clienti">
          <Button className="gradient-primary h-14 px-8 rounded-2xl font-bold text-lg gap-3">
            <Plus className="w-6 h-6" /> Nuovo Cliente
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Clienti Hub", val: clients?.length || 0, icon: Users, color: "text-indigo-400", bg: "bg-indigo-500/10", tag: "ACTIVE" },
          { label: "In Approvazione", val: pendingPosts?.length || 0, icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10", tag: "PENDING" },
          { label: "Post Mensili", val: totalUsed, icon: FileText, color: "text-emerald-400", bg: "bg-emerald-500/10", tag: "MONTHLY" },
          { label: "Efficienza Hub", val: "98.4%", icon: Zap, color: "text-purple-400", bg: "bg-purple-500/10", tag: "REALTIME" }
        ].map((stat, i) => (
          <Card key={i} className="glass-card border-none overflow-hidden group hover:border-white/20 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-7 h-7" />
                </div>
                <Badge variant="outline" className="text-[10px] font-black tracking-widest border-white/10 text-slate-400">{stat.tag}</Badge>
              </div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <p className="text-4xl font-bold text-white tracking-tighter">{stat.val}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glass-card border-none">
          <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-6">
            <CardTitle className="text-xl font-headline flex items-center gap-3">
              <Users className="w-6 h-6 text-indigo-400" /> Clienti Recenti
            </CardTitle>
            <Link href="/admin/clienti">
              <Button variant="ghost" size="sm" className="text-xs font-bold text-indigo-400 hover:text-white uppercase tracking-wider">
                Vedi tutti <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-6 px-0">
            <div className="divide-y divide-white/5">
              {clients?.map((client: any) => (
                <Link key={client.id} href={`/admin/clienti/${client.id}`}>
                  <div className="p-5 flex items-center justify-between hover:bg-white/5 transition-all cursor-pointer group">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center font-black text-xl text-indigo-400 group-hover:border-indigo-500/50">
                        {client.nome_azienda.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">{client.nome_azienda}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{client.settore || 'Servizi Professionali'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-white">{client.post_usati} / {client.post_totali}</p>
                      <p className="text-[9px] text-slate-500 uppercase font-bold tracking-tighter">Budget Post</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-none">
          <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-6">
            <CardTitle className="text-xl font-headline flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-amber-400" /> Workflow 24h
            </CardTitle>
            <Badge className="bg-amber-500/20 text-amber-400 border-none px-3 py-1 text-[10px] font-black uppercase tracking-widest">
              {pendingPosts?.length || 0} Task
            </Badge>
          </CardHeader>
          <CardContent className="pt-6 px-0">
            <div className="divide-y divide-white/5">
              {pendingPosts?.map((post: any) => (
                <div key={post.id} className="p-5 flex items-center justify-between hover:bg-white/5 transition-all group">
                  <div className="flex items-center gap-5">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.5)] animate-pulse" />
                    <div className="min-w-0">
                      <p className="text-base font-bold text-white truncate max-w-[220px]">{post.titolo}</p>
                      <p className="text-[10px] text-slate-500 uppercase font-black flex items-center gap-2 tracking-widest mt-1">
                        <Calendar className="w-3.5 h-3.5 text-indigo-400" /> {post.piattaforma}
                      </p>
                    </div>
                  </div>
                  <Link href={`/admin/clienti/${post.cliente_id}?postId=${post.id}`}>
                    <Button size="sm" variant="ghost" className="h-10 px-4 text-[10px] font-black uppercase tracking-[0.15em] text-indigo-400 hover:bg-indigo-500 hover:text-white rounded-xl transition-all">
                      Apri Task
                    </Button>
                  </Link>
                </div>
              ))}
              {(!pendingPosts || pendingPosts.length === 0) && (
                <div className="p-20 text-center flex flex-col items-center justify-center space-y-4">
                  <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500/50" />
                  </div>
                  <p className="text-slate-400 font-medium italic">Hub in ordine. Tutti i workflow sono completati.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}