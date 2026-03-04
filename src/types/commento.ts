import { Timestamp } from 'firebase/firestore';

import { UserRole } from './user';

export type TipoCommento = "commento" | "suggerimento" | "approvazione" | "revisione";

export interface Commento {
  id: string;
  testo: string;
  autore_uid: string;
  autore_nome: string;
  autore_ruolo: UserRole;
  tipo: TipoCommento;
  risolto: boolean;
  creato_il: Timestamp;
}
