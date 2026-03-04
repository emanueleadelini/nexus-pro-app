export type UserRole = 'super_admin' | 'admin_agenzia' | 'cliente_finale';

export interface UserProfile {
  uid: string;
  email: string;
  ruolo: UserRole;
  cliente_id?: string;
  agenzia_id?: string;
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
    "gestione_campagne", "uso_ai", "gestione_agenzie"
  ],
  admin_agenzia: [
    "gestione_clienti", "creazione_post", "modifica_post",
    "approvazione_materiali", "visualizzazione_analytics",
    "gestione_campagne", "uso_ai"
  ],
  cliente_finale: [
    "approvazione_post", "upload_materiali", "visualizzazione_analytics",
    "richiesta_upgrade", "commenti", "visualizzazione_calendario"
  ]
};
