'use client';

import { useState } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Check, X, Clock, Zap, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Post, STATO_POST_LABELS, STATO_POST_COLORS } from '@/types/post';
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
    <Card className="max-w-[500px] mx-auto bg-white border border-gray-200 shadow-sm overflow-hidden rounded-xl">
      {/* Header */}
      <div className="p-3 flex items-center justify-between border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            {clienteLogo ? <AvatarImage src={clienteLogo} /> : <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs font-bold">{clienteNome.charAt(0)}</AvatarFallback>}
          </Avatar>
          <div className="flex flex-col">
            <span className="text-xs font-bold leading-none">{clienteNome}</span>
            <span className="text-[10px] text-gray-500 flex items-center gap-1">
              {post.tipo_pianificazione === 'immediata' ? <Zap className="w-2 h-2 text-amber-500 fill-amber-500" /> : <Clock className="w-2 h-2" />}
              {post.tipo_pianificazione === 'immediata' ? 'Pubblicazione Immediata' : 'Programmato'}
            </span>
          </div>
        </div>
        <Badge className={`${STATO_POST_COLORS[post.stato].bg} ${STATO_POST_COLORS[post.stato].text} text-[9px] uppercase border-none`}>
          {STATO_POST_LABELS[post.stato]}
        </Badge>
      </div>

      {/* Media Content */}
      <div className="aspect-square bg-gray-50 relative group">
        {materialUrl ? (
          <Image src={materialUrl} alt={post.titolo} fill className="object-cover" />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-300">
            <div className="w-16 h-16 mb-2 bg-gray-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-200">
              <span className="text-2xl">🖼️</span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest">In attesa di asset grafico</span>
          </div>
        )}
      </div>

      {/* Interaction Bar */}
      <div className="p-3 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Heart 
              className={`w-6 h-6 cursor-pointer transition-all hover:scale-110 ${liked ? 'fill-red-500 text-red-500' : 'text-gray-900'}`} 
              onClick={() => setLiked(!liked)} 
            />
            <MessageCircle 
              className="w-6 h-6 text-gray-900 cursor-pointer hover:text-indigo-600 transition-colors" 
              onClick={onComment} 
            />
            <Send className="w-6 h-6 text-gray-900 cursor-pointer" />
          </div>
          <Bookmark 
            className={`w-6 h-6 cursor-pointer ${saved ? 'fill-gray-900 text-gray-900' : 'text-gray-900'}`} 
            onClick={() => setSaved(!saved)}
          />
        </div>

        <div className="space-y-1">
          <p className="text-sm">
            <span className="font-bold">{clienteNome}</span>
            <span className="font-bold ml-1 text-indigo-600">{post.titolo}</span>
          </p>
          <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{post.testo}</p>
        </div>

        {isUrgent && (
          <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-100 flex items-center gap-2 text-[10px] font-bold text-amber-700 uppercase animate-pulse">
            <Timer className="w-3.5 h-3.5" /> Scadenza approvazione: {scadenzaStr}
          </div>
        )}
      </div>

      {/* Approval Actions */}
      {showActions && (
        <CardFooter className="p-3 bg-gray-50 border-t flex flex-col gap-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase text-center w-full">Azioni Richieste</p>
          <div className="flex gap-2 w-full">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 text-red-600 border-red-100 bg-white font-bold hover:bg-red-50" 
              onClick={onReject}
            >
              <X className="w-4 h-4 mr-1" /> Revisione
            </Button>
            <Button 
              size="sm" 
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 font-bold" 
              onClick={onApprove}
            >
              <Check className="w-4 h-4 mr-1" /> Approva
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
