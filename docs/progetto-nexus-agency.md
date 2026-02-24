# Progetto AD next lab - Documentazione Tecnica e Funzionale

## 1. Descrizione Generale
Il CRM AD next lab è una piattaforma gestionale multi-tenant di livello enterprise progettata per la collaborazione avanzata tra agenzia e clienti.

## 2. Architettura Tecnologica
- **Frontend**: Next.js 15 (App Router).
- **Backend**: Firebase (Auth, Firestore).
- **AI**: Gemini 1.5 Flash via Genkit.

## 3. Struttura Dati Avanzata (Sprint 1)

### 3.1 Utenti e Permessi
Il sistema implementa un RBAC (Role-Based Access Control) a 4 livelli:
- **Super Admin**: Controllo totale su sistema, clienti e fatturazione.
- **Operatore**: Gestione operativa quotidiana dei post e degli asset.
- **Referente (Cliente)**: Unico autorizzato ad approvare i contenuti per l'azienda.
- **Collaboratore (Cliente)**: Visualizzazione e caricamento asset senza poteri decisionali.

### 3.2 Workflow Post a 7 Stati
Il ciclo di vita di un post segue un percorso rigido per garantire la qualità:
1. `bozza`: In lavorazione.
2. `revisione_interna`: Review tra colleghi in agenzia.
3. `da_approvare`: Visibile al cliente per feedback.
4. `revisione`: Richiesta di modifiche da parte del cliente (blocca il post).
5. `approvato`: Confermato dal cliente.
6. `programmato`: In attesa di pubblicazione automatica/manuale.
7. `pubblicato`: Archivio storico.

## 4. Logiche di Business Core

### 4.1 Gestione Crediti Post
Ogni cliente ha un limite mensile di post. Il sistema scala un credito alla creazione e lo riaccredita alla cancellazione. Un indicatore visivo (verde/arancione/rosso) segnala lo stato dei crediti.

### 4.2 Versioning e Storico
Ogni post mantiene:
- **Versioni**: Storico dei testi e titoli con autore e timestamp.
- **Storico Stati**: Registro di ogni passaggio di stato con autore e note.

### 4.3 Gestione Asset e Limiti
- **Upload Diretto**: Max 50MB per file per immagini e grafiche.
- **Link Esterni**: Obbligatori per video pesanti o cartelle tramite integrazione link (Drive/WeTransfer).

## 5. Sicurezza
Le **Security Rules** di Firestore proteggono i dati in modalità multi-tenant:
- Gli operatori dell'agenzia vedono tutti i clienti.
- Gli utenti cliente vedono solo i dati associati al proprio `cliente_id`.
- Le transizioni di stato sono protette e permesse solo ai ruoli corretti.
