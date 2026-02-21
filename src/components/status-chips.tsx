
import { Badge } from "@/components/ui/badge";
import { StatoPost, StatoValidazione } from "@/lib/types";

export function PostStatoChip({ stato }: { stato: StatoPost }) {
  const styles: Record<StatoPost, string> = {
    bozza: "bg-gray-200 text-gray-700 hover:bg-gray-300",
    da_approvare: "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200",
    approvato: "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200",
    pubblicato: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200",
  };

  const labels: Record<StatoPost, string> = {
    bozza: "Bozza",
    da_approvare: "Da Approvare",
    approvato: "Approvato",
    pubblicato: "Pubblicato",
  };

  return (
    <Badge variant="outline" className={`${styles[stato]} capitalize px-3 py-1`}>
      {labels[stato]}
    </Badge>
  );
}

export function MaterialeStatoChip({ stato }: { stato: StatoValidazione }) {
  const styles: Record<StatoValidazione, string> = {
    in_attesa: "bg-slate-100 text-slate-700 border-slate-200",
    validato: "bg-green-100 text-green-700 border-green-200",
    rifiutato: "bg-rose-100 text-rose-700 border-rose-200",
  };

  const labels: Record<StatoValidazione, string> = {
    in_attesa: "In Attesa",
    validato: "Validato",
    rifiutato: "Rifiutato",
  };

  return (
    <Badge variant="outline" className={`${styles[stato]} capitalize px-3 py-1`}>
      {labels[stato]}
    </Badge>
  );
}
