'use client';

import { useState } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Check, X, Clock, Zap, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Post } from '@/types/post';
import { PostStatoChip } from '@/components/status-chips';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';
import Image from 'next/image';

interface FeedInstagramPreviewProps {
  post: Post;
  clienteNome: string;
  clienteLogo?: string;
  onApprove?: () => void;
  onReject?: () => void;
  onComment?: () => void;
  showActions?: boolean;
  materialUrl?: string | null;
}

export function FeedInstagramPreview({ 
  post, 
  clienteNome, 
  clienteLogo,
  onApprove, 
  onReject, 
  onComment,
  showActions = false,
  materialUrl
}: FeedInstagramPreviewProps) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const scadenzaStr = post.scadenza_approvazione && typeof post.scadenza_approvazione.toDate === 'function'
    ? formatDistanceToNow(post.scadenza_approvazione.toDate(), { addSuffix: true, locale: it })
    : null;
  
  const isUrgent = post.stato === 'da_approvare' && scadenzaStr;

  return (
    <Card className="max-w-[500px] mx-auto bg-slate-900 border border-white/5 shadow-2xl overflow-hidden rounded-2xl">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-0.5 rounded-full bg-gradient-to-tr from-amber-400 to-fuchsia-600">
            <Avatar className="h-9 w-9 border-2 border-slate-900">
              {clienteLogo ? <AvatarImage src={clienteLogo} /> : <AvatarFallback className="bg-slate-800 text-white text-xs font-bold">{clienteNome.charAt(0)}</AvatarFallback>}
            </Avatar>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white leading-none">{clienteNome}</span>
            <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
              {post.tipo_pianificazione === 'immediata' ? <Zap className="w-2.5 h-2.5 text-amber-400 fill-amber-400" /> : <Clock className="w-2.5 h-2.5" />}
              {post.tipo_pianificazione === 'immediata' ? 'Sponsorizzato' : 'Programmato'}
            </span>
          </div>
        </div>
        <PostStatoChip stato={post.stato} />
      </div>

      {/* Media Content */}
      <div className="aspect-square bg-slate-950 relative group">
        {materialUrl ? (
          <Image src={materialUrl} alt={post.titolo} fill className="object-cover" />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-700">
            <div className="w-20 h-20 mb-3 bg-slate-900 rounded-3xl flex items-center justify-center border-2 border-dashed border-slate-800">
              <span className="text-3xl">📸</span>
            </div>
            <span className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-500">Asset In Produzione</span>
          </div>
        )}
      </div>

      {/* Interaction Bar */}
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <Heart 
              className={`w-7 h-7 cursor-pointer transition-all hover:scale-110 ${liked ? 'fill-red-500 text-red-500' : 'text-white'}`} 
              onClick={() => setLiked(!liked)} 
            />
            <MessageCircle 
              className="w-7 h-7 text-white cursor-pointer hover:text-indigo-400 transition-colors" 
              onClick={onComment} 
            />
            <Send className="w-7 h-7 text-white cursor-pointer -rotate-12" />
          </div>
          <Bookmark 
            className={`w-7 h-7 cursor-pointer ${saved ? 'fill-white text-white' : 'text-white'}`} 
            onClick={() => setSaved(!saved)}
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm leading-relaxed">
            <span className="font-bold text-white mr-2">{clienteNome.toLowerCase().replace(/\s+/g, '')}</span>
            <span className="text-slate-300 whitespace-pre-wrap">{post.testo}</span>
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {post.tags?.map((tag, i) => (
              <span key={i} className="text-sm text-indigo-400 font-medium">#{tag}</span>
            ))}
          </div>
        </div>

        {isUrgent && (
          <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/20 flex items-center gap-3 text-xs font-bold text-amber-400 animate-pulse">
            <Timer className="w-4 h-4" /> Scadenza tra {scadenzaStr}
          </div>
        )}
      </div>

      {/* Approval Actions */}
      {showActions && (
        <CardFooter className="p-4 bg-slate-950/50 border-t border-white/5 flex flex-col gap-4">
          <div className="flex gap-3 w-full">
            <Button 
              variant="outline" 
              className="flex-1 border-red-500/30 text-red-400 bg-red-500/5 font-bold h-12 rounded-xl hover:bg-red-500/10" 
              onClick={onReject}
            >
              <X className="w-4 h-4 mr-2" /> Revisione
            </Button>
            <Button 
              className="flex-1 gradient-primary font-bold h-12 rounded-xl" 
              onClick={onApprove}
            >
              <Check className="w-4 h-4 mr-2" /> Approva Post
            </Button>
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">
            Il post verrà pubblicato automaticamente tra 24h
          </p>
        </CardFooter>
      )}
    </Card>
  );
}