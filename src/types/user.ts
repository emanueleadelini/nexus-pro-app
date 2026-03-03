export type UserRole = 'super_admin' | 'operatore' | 'referente' | 'collaboratore' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  ruolo: UserRole;
  cliente_id?: string;
  nomeAzienda?: string;
  creatoIl?: any;
  permessi: string[];
  ultimo_accesso?: any;
}

export const PERMESSI_DEFAULT: Record<UserRole, string[]> = {
  super_admin: [
    "gestione_clienti", "gestione_piani", "gestione_utenti",
    "creazione_post", "modifica_post", "approvazione_materiali",
    "visualizzazione_analytics", "configurazione_sistema",
    "gestione_campagne", "uso_ai"
  ],
  admin: [
    "gestione_clienti", "gestione_piani", "gestione_utenti",
    "creazione_post", "modifica_post", "approvazione_materiali",
    "visualizzazione_analytics", "configurazione_sistema",
    "uso_ai"
  ],
  operatore: [
    "creazione_post", "modifica_post", "approvazione_materiali",
    "visualizzazione_analytics", "gestione_campagne", "uso_ai"
  ],
  referente: [
    "approvazione_post", "upload_materiali", "visualizzazione_analytics",
    "richiesta_upgrade", "commenti"
  ],
  collaboratore: [
    "upload_materiali", "commenti", "visualizzazione_calendario"
  ]
};
