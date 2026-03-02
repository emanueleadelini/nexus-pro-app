'use client';

import { Badge } from "@/components/ui/badge";
import { StatoPost, STATO_POST_LABELS } from "@/types/post";
import { StatoValidazione, STATO_VALIDAZIONE_LABELS } from "@/types/material";

export function PostStatoChip({ stato }: { stato: StatoPost }) {
  // Stili ad alta visibilità per Dark Mode
  const styles: Record<string, string> = {
    bozza: 'bg-slate-800 text-slate-300 border-slate-700',
    revisione_interna: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    da_approvare: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    revisione: 'bg-red-500/20 text-red-400 border-red-500/30',
    approvato: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    programmato: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    pubblicato: 'bg-indigo-600 text-white border-transparent',
  };

  const label = STATO_POST_LABELS[stato] || stato;

  return (
    <Badge variant="outline" className={`${styles[stato] || styles.bozza} px-2.5 py-0.5 border font-bold text-[10px] uppercase tracking-wider`}>
      {label}
    </Badge>
  );
}

export function MaterialeStatoChip({ stato }: { stato: StatoValidazione }) {
  const styles: Record<string, string> = {
    in_attesa: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    validato: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    rifiutato: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  const label = STATO_VALIDAZIONE_LABELS[stato] || stato;

  return (
    <Badge variant="outline" className={`${styles[stato] || styles.in_attesa} px-2.5 py-0.5 border font-bold text-[10px] uppercase tracking-wider`}>
      {label}
    </Badge>
  );
}