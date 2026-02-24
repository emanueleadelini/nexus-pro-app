# AD next lab - Documentazione Tecnica e Funzionale (CRM Social Media)

## 1. Descrizione del Sistema
**AD next lab** è un CRM di livello enterprise progettato per centralizzare la collaborazione tra agenzia di comunicazione e clienti. Il sistema gestisce l'intero ciclo di vita del Piano Editoriale (PED), dalla pianificazione strategica assistita da AI alla validazione degli asset multimediali, garantendo trasparenza, controllo e versioning dei contenuti.

## 2. Architettura Tecnologica
- **Frontend**: Next.js 15 (App Router) - Reattività e performance server-side.
- **Backend**: Firebase (Authentication per l'accesso, Firestore per i dati real-time).
- **AI Engine**: Google Gemini 2.0 Flash via Genkit - Generazione copy ottimizzata per piattaforma e tono di voce.
- **UI Framework**: Tailwind CSS + ShadCN UI - Design professionale e responsive.

## 3. Gestione Accessi e Ruoli (RBAC)
Il sistema implementa 4 livelli di accesso con permessi granulari (Sprint 1C):
- **Super Admin**: Controllo totale su sistema, clienti, piani e configurazioni.
- **Operatore (Agenzia)**: Gestione quotidiana dei post, degli asset e della strategia AI.
- **Referente (Cliente)**: Potere decisionale; approva o richiede revisioni sui post del proprio brand.
- **Collaboratore (Cliente)**: Visualizzazione calendario e caricamento materiali (senza poteri di approvazione).

## 4. Moduli Core

### 4.1 Piano Editoriale (PED) Avanzato (Sprint 1A/1B)
Ogni post è un'entità strategica che include:
- **Workflow a 7 stati**: `bozza` -> `revisione_interna` -> `da_approvare` -> `revisione` -> `approvato` -> `programmato` -> `pubblicato`.
- **Dati Strategici**: Piattaforma (IG, FB, LI, TikTok, etc.), Formato (Reel, Carosello, etc.), Campagna di riferimento e Tag.
- **Versioning**: Ogni modifica al copy viene registrata in uno storico versioni per permettere il recupero di testi precedenti.

### 4.2 Archivio Asset e Materiali (Sprint 1/2)
Gestione ottimizzata dei contenuti multimediali:
- **Limite 50MB**: Caricamento diretto per file standard per garantire la velocità del sistema.
- **Supporto Link Esterni**: Supporto obbligatorio per file pesanti (>50MB) o cartelle tramite link (Google Drive, WeTransfer).
- **Archivio Diviso**: Separazione netta tra materiali inviati dall'agenzia e materiali inviati dal cliente.

### 4.3 Collaborazione Real-time (Sprint 2)
- **Sidebar Commenti**: Chat contestuale su ogni post per discutere modifiche e feedback.
- **Centro Notifiche**: Sistema di avvisi (Campanella) per nuovi post da approvare, commenti ricevuti o materiali caricati.

### 4.4 Intelligenza Artificiale Strategica
- **Generazione Bozza**: Creazione post basata su settore, tono di voce richiesto e vincoli della piattaforma social.
- **Ottimizzazione**: Strumenti per migliorare il copy esistente tramite prompt engineering avanzato.

## 5. Logiche di Business e Sicurezza
- **Gestione Crediti**: Ogni cliente ha un numero fisso di post mensili. Il sistema scala i crediti alla creazione della bozza e gestisce le richieste di upgrade.
- **Multi-tenancy**: Isolamento totale dei dati tramite Firestore Security Rules. Un utente cliente può accedere esclusivamente ai dati associati al proprio `cliente_id`.
- **Protezione Dati**: Solo l'agenzia può modificare gli stati critici (pubblicazione), mentre solo il referente può dare l'approvazione finale.

---
*Documento aggiornato automaticamente allo stato corrente dello sviluppo.*