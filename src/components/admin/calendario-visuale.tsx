
'use client';

import React, { useMemo, useState } from 'react';
import { 
  DndContext, 
  DragOverlay, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent,
  DragStartEvent,
  useDroppable
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay, 
  addMonths, 
  subMonths,
  startOfWeek,
  endOfWeek
} from 'date-fns';
import { it } from 'date-fns/locale';
import { Post, STATO_POST_COLORS, STATO_POST_LABELS, PIATTAFORMA_LABELS } from '@/types/post';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, GripVertical, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { doc, updateDoc, serverTimestamp, Timestamp, arrayUnion } from 'firebase/firestore';
import { useFirestore, useUser } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';

interface Props {
  clienteId: string;
  posts: Post[];
}

// Componente per il singolo post trascinabile nella griglia
function DraggablePostCard({ post, isOverlay = false }: { post: Post; isOverlay?: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: post.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`mb-1 p-1.5 rounded text-[10px] border cursor-grab active:cursor-grabbing transition-all hover:shadow-sm ${STATO_POST_COLORS[post.stato].bg} ${STATO_POST_COLORS[post.stato].text} border-current/10 flex items-center gap-1 group`}
    >
      <GripVertical className="w-3 h-3 opacity-30 group-hover:opacity-100" />
      <span className="truncate font-bold uppercase flex-1">{post.titolo}</span>
      <Badge variant="outline" className="text-[7px] py-0 px-1 border-current/20 opacity-70">
        {PIATTAFORMA_LABELS[post.piattaforma].charAt(0)}
      </Badge>
    </div>
  );
}

// Zona di rilascio per il singolo giorno del calendario
function CalendarDayCell({ date, posts }: { date: Date; posts: Post[] }) {
  const { setNodeRef, isOver } = useDroppable({
    id: format(date, 'yyyy-MM-dd'),
    data: { date }
  });

  const isToday = isSameDay(date, new Date());

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[100px] border-r border-b p-1 transition-colors flex flex-col ${isOver ? 'bg-indigo-50/50' : ''} ${isToday ? 'bg-gray-50/30' : ''}`}
    >
      <div className={`text-[10px] font-bold mb-1 ml-1 flex justify-between items-center ${isToday ? 'text-indigo-600' : 'text-gray-400'}`}>
        <span>{format(date, 'd')}</span>
        {isToday && <span className="h-1.5 w-1.5 rounded-full bg-indigo-600"></span>}
      </div>
      <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar max-h-[80px]">
        {posts.map(post => (
          <DraggablePostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

export function CalendarioVisuale({ clienteId, posts }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeId, setActiveId] = useState<string | null>(null);
  const db = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = useMemo(() => {
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [calendarStart, calendarEnd]);

  const activePost = useMemo(() => {
    return posts.find(p => p.id === activeId);
  }, [posts, activeId]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const post = posts.find(p => p.id === active.id);
      if (!post || !user) return;

      // Se over.id è una data (formato yyyy-MM-dd)
      const targetDateStr = over.id as string;
      const targetDate = new Date(targetDateStr);
      
      // Mantieni l'ora originale se possibile, altrimenti usa 10:00
      const originalDate = post.data_pubblicazione?.toDate() || new Date();
      targetDate.setHours(originalDate.getHours() || 10);
      targetDate.setMinutes(originalDate.getMinutes() || 0);

      const postRef = doc(db, 'clienti', clienteId, 'post', post.id);

      // Aggiornamento ottimistico non-blocking
      updateDoc(postRef, {
        data_pubblicazione: Timestamp.fromDate(targetDate),
        aggiornato_il: serverTimestamp(),
        storico_stati: arrayUnion({
          stato: post.stato,
          autore_uid: user.uid,
          timestamp: Timestamp.now(),
          nota: `Post spostato al ${format(targetDate, 'dd/MM/yyyy HH:mm')}`
        })
      }).catch(e => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: postRef.path,
          operation: 'update'
        }));
      });

      toast({
        title: "Calendario aggiornato",
        description: `"${post.titolo}" spostato al ${format(targetDate, 'dd MMMM', { locale: it })}`,
      });
    }
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-headline font-bold capitalize">
            {format(currentDate, 'MMMM yyyy', { locale: it })}
          </h2>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={prevMonth}><ChevronLeft className="w-4 h-4" /></Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={nextMonth}><ChevronRight className="w-4 h-4" /></Button>
            <Button variant="outline" size="sm" className="h-8 text-xs px-3 ml-2" onClick={() => setCurrentDate(new Date())}>Oggi</Button>
          </div>
        </div>
        <div className="flex gap-4">
           {['bozza', 'da_approvare', 'approvato', 'pubblicato'].map(s => (
             <div key={s} className="flex items-center gap-1.5">
               <div className={`h-2 w-2 rounded-full ${STATO_POST_COLORS[s as any].bg.replace('bg-', 'bg-')}`}></div>
               <span className="text-[10px] font-bold text-gray-400 uppercase">{STATO_POST_LABELS[s as any]}</span>
             </div>
           ))}
        </div>
      </div>

      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCenter} 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-7 bg-gray-50 border-b">
            {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map(day => (
              <div key={day} className="py-2 text-center text-[10px] font-bold text-gray-400 uppercase border-r last:border-r-0">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 border-l">
            {days.map(day => {
              const postsInDay = posts.filter(p => p.data_pubblicazione && isSameDay(p.data_pubblicazione.toDate(), day));
              return (
                <CalendarDayCell key={day.toISOString()} date={day} posts={postsInDay} />
              );
            })}
          </div>
        </div>

        <DragOverlay>
          {activePost ? (
            <div className={`p-2 rounded text-[10px] border shadow-xl opacity-90 ${STATO_POST_COLORS[activePost.stato].bg} ${STATO_POST_COLORS[activePost.stato].text} border-current/20 w-40 font-bold uppercase`}>
              {activePost.titolo}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
