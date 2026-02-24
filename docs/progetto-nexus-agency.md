# Progetto AD next lab - Documentazione Tecnica e Funzionale

## 1. Descrizione Generale
Il CRM AD next lab è una piattaforma gestionale multi-tenant progettata per ottimizzare la collaborazione tra un'agenzia di comunicazione e i suoi clienti. Il sistema gestisce il Piano Editoriale (PED), l'archiviazione di asset multimediali e la generazione di contenuti tramite Intelligenza Artificiale.

## 2. Architettura Tecnologica
- **Frontend**: Next.js 15 (App Router) con TypeScript.
- **Interfaccia Utente**: Tailwind CSS e Shadcn UI per un design reattivo e professionale.
- **Backend**: Firebase Suite (Authentication, Firestore Database).
- **AI**: Google Gemini Pro tramite Genkit per la generazione assistita di copy social.

## 3. Struttura Dati (Firestore)

### 3.1 Collezione `users/{uid}`
Memorizza i profili utente e gestisce i permessi di accesso.
- `email`: Email dell'utente.
- `ruolo`: "admin" (Agenzia) o "cliente".
- `cliente_id`: Riferimento univoco all'azienda associata (solo per ruolo cliente).
- `nomeAzienda`: Nome visualizzato dell'azienda.
- `creatoIl`: Timestamp di creazione del profilo.

### 3.2 Collezione `clienti/{clienteId}`
Rappresenta le aziende clienti gestite dall'agenzia.
- `nome_azienda`: Ragione sociale o nome commerciale.
- `settore`: Settore merceologico.
- `email_riferimento`: Contatto primario per comunicazioni.
- `post_totali`: Limite massimo di post inclusi nel piano mensile.
- `post_usati`: Conteggio dinamico dei post inseriti nel calendario.
- `richiesta_upgrade`: Booleano per segnalare richieste di aumento budget post.
- `creato_il`: Timestamp di registrazione.

#### Sotto-collezione `post/{postId}`
Gestisce il Calendario Editoriale.
- `titolo`: Titolo interno del post.
- `testo`: Copy definitivo del post.
- `stato`: "bozza", "da_approvare", "approvato", "pubblicato".
- `materiale_id`: Riferimento all'asset multimediale collegato.
- `data_pubblicazione`: Timestamp della data programmata.
- `aggiornato_il`: Timestamp dell'ultima modifica (automatico).

#### Sotto-collezione `materiali/{materialId}`
Archivio degli asset multimediali scambiati.
- `nome_file`: Nome originale del file o descrizione link.
- `url_storage`: URL del file (per caricamenti diretti).
- `link_esterno`: URL WeTransfer/Drive/Dropbox per file pesanti.
- `caricato_da`: UID dell'utente che ha effettuato l'upload.
- `stato_validazione`: "in_attesa", "validato", "rifiutato".
- `destinazione`: "social", "sito", "offline".
- `creato_il`: Timestamp automatico (Server Timestamp).

## 4. Workflow e Logiche di Business

### 4.1 Gestione Crediti Post
Il sistema implementa un countdown automatico dei crediti. Ogni volta che un post viene creato (manualmente o via AI), il contatore `post_usati` aumenta. L'eliminazione di un post riaccredita automaticamente il punto al cliente. Una barra di progresso segnala visivamente il raggiungimento del limite.

### 4.2 Piano Editoriale (PED) Social-Style
I post sono visualizzati in un'interfaccia che simula un feed social (Facebook/Instagram style) per permettere a cliente e agenzia di valutare l'impatto visivo reale del contenuto prima della pubblicazione.

### 4.3 Collaborazione sugli Asset
- **Limite 50MB**: Per caricamenti diretti di foto e grafiche.
- **Supporto Link**: Obbligatorio per video o cartelle pesanti (>50MB) tramite integrazione link esterni.
- **Validazione**: L'Admin può approvare o rifiutare gli asset del cliente fornendo feedback immediato.

### 4.4 Intelligenza Artificiale
Il modulo AI utilizza modelli Gemini per generare bozze basate su:
- Piattaforma specifica (Instagram, LinkedIn, ecc.).
- Tono di voce desiderato.
- Argomento e note specifiche.

## 5. Sicurezza e Privacy
L'accesso è regolato da **Firestore Security Rules** che garantiscono il multi-tenancy: i clienti possono accedere esclusivamente ai propri dati, mentre gli amministratori hanno una visione globale e il controllo totale sulla configurazione dei piani e degli utenti.

## 6. Sincronizzazione Temporale
Tutte le azioni critiche (caricamento file, creazione post, cambio stato) utilizzano i **Server Timestamp** di Firebase, garantendo che la cronologia degli scambi sia certificata e non modificabile manualmente dagli utenti.
