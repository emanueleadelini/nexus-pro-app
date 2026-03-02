import { Timestamp } from 'firebase/firestore';
import { FileText, Image as ImageIcon, Video, Camera, Share2, Globe, Printer, Link as LinkIcon, ShieldCheck, FileSignature, Fingerprint, CreditCard, Gift, Ticket } from 'lucide-react';

export type StatoValidazione = 'in_attesa' | 'validato' | 'rifiutato';
export type DestinazioneAsset = 'social' | 'sito' | 'offline' | 'strategico' | 'visual_identity' | 'contratto';
export type TipoAsset = 'grafica' | 'foto' | 'video' | 'documento' | 'link' | 'strategia' | 'legale';

export const STATO_VALIDAZIONE_LABELS: Record<StatoValidazione, string> = {
  in_attesa: 'In attesa',
  validato: 'Validato',
  rifiutato: 'Rifiutato',
};

export const STATO_VALIDAZIONE_COLORS: Record<StatoValidazione, { bg: string; text: string }> = {
  in_attesa: { bg: 'bg-amber-100', text: 'text-amber-800' },
  validato: { bg: 'bg-green-100', text: 'text-green-800' },
  rifiutato: { bg: 'bg-red-100', text: 'text-red-800' },
};

export const DESTINAZIONE_LABELS: Record<DestinazioneAsset, string> = {
  social: 'Social Media',
  sito: 'Sito Web',
  offline: 'Grafica Offline',
  strategico: 'Documento Strategico',
  visual_identity: 'Visual Identity (Logo)',
  contratto: 'Contratto & Accordi',
};

export interface Material {
  id: string;
  nome_file: string;
  url_storage: string | null;
  link_esterno?: string | null;
  caricato_da: string;
  ruolo_caricatore: 'admin' | 'cliente';
  stato_validazione: StatoValidazione;
  destinazione: DestinazioneAsset; 
  tipo_strategico?: 'piano_strategico' | 'piano_comunicazione' | 'business_plan' | 'business_model';
  tipo_offline?: 'brochure' | 'volantino' | '6x3' | '3x6' | 'bigliettini' | 'gadget' | 'altro';
  note_rifiuto: string | null;
  creato_il: Timestamp;
}

export function getFileTypeInfo(fileName: string, isLink?: boolean, destinazione?: DestinazioneAsset) {
  if (destinazione === 'contratto') return { icon: FileSignature, color: 'text-slate-900', bg: 'bg-slate-100' };
  if (destinazione === 'visual_identity') return { icon: Fingerprint, color: 'text-indigo-600', bg: 'bg-indigo-50' };
  if (isLink) return { icon: LinkIcon, color: 'text-blue-600', bg: 'bg-blue-50' };
  
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (['jpg', 'jpeg', 'png', 'webp'].includes(ext || '')) return { icon: Camera, color: 'text-emerald-500', bg: 'bg-emerald-50' };
  return { icon: FileText, color: 'text-indigo-500', bg: 'bg-indigo-50' };
}
