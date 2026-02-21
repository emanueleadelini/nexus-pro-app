
export type Role = 'admin' | 'cliente';

export type UserProfile = {
  uid: string;
  email: string;
  ruolo: Role;
  cliente_id?: string;
  nomeAzienda: string;
  creatoIl: string;
};

export type StatoPost = 'bozza' | 'da_approvare' | 'approvato' | 'pubblicato';

export type PostModel = {
  id: string;
  titolo: string;
  testo: string;
  stato: StatoPost;
  data_pubblicazione: string | null;
  creato_il: string;
  aggiornato_il: string;
};

export type StatoValidazione = 'in_attesa' | 'validato' | 'rifiutato';

export type MaterialModel = {
  id: string;
  nome_file: string;
  url_storage: string | null;
  caricato_da: string;
  stato_validazione: StatoValidazione;
  note_rifiuto: string | null;
  creato_il: string;
};

export type ClientModel = {
  id: string;
  nome_azienda: string;
  settore: string;
  email_riferimento: string;
  post_totali: number;
  post_usati: number;
  creato_il: string;
};
