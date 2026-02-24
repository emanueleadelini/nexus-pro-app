# AD next lab - Documentazione Tecnica e Funzionale (CRM Social Media)

## 1. Descrizione del Sistema
**AD next lab** è un CRM di livello enterprise progettato per centralizzare la collaborazione tra agenzia e clienti. Il sistema gestisce l'intero ciclo di vita della comunicazione social, dalla pianificazione strategica assistita da AI alla pubblicazione finale, garantendo trasparenza e controllo tramite un sistema di versioning e feedback in tempo reale.

## 2. Architettura Tecnologica
- **Frontend**: Next.js 15 (App Router) - Reattività e performance server-side.
- **Backend**: Firebase (Authentication per l'accesso sicuro, Firestore per i dati real-time).
- **AI Engine**: Google Gemini 1.5 Flash via Genkit - Generazione copy basata su Brand Brief.
- **UI Framework**: Tailwind CSS + ShadCN UI - Design moderno, responsive e professionale.

## 3. Gestione Accessi e Ruoli (RBAC)
Il sistema implementa 4 livelli di accesso con permessi granulari:
- **Super Admin**: Controllo totale su sistema, clienti, piani e configurazioni.
- **Operatore**: Gestione quotidiana dei post, degli asset e della strategia AI.
- **Referente (Cliente)**: Potere decisionale; approva o richiede revisioni sui post.
- **Collaboratore (Cliente)**: Visualizzazione calendario e caricamento materiali senza poteri di approvazione.

## 4. Moduli Core

### 4.1 Piano Editoriale (PED) Avanzato
Ogni post segue un workflow rigido a 7 stati:
1. `bozza` -> 2. `revisione_interna` -> 3. `da_approvare` -> 4. `revisione` -> 5. `approvato` -> 6. `programmato` -> 7. `pubblicato`.
Il sistema registra ogni cambio di stato in una timeline dedicata e mantiene la cronologia completa di ogni modifica al testo (Versioning).

### 4.2 Archivio Asset e Materiali
Gestione intelligente dei file multimediali:
- **Limite 50MB**: Caricamento diretto di immagini e brevi video per mantenere la piattaforma performante.
- **Link Esterni**: Supporto obbligatorio per file pesanti (>50MB) tramite integrazione di link (Google Drive, WeTransfer).
- **Archivio Diviso**: Separazione netta tra materiali inviati dall'agenzia e materiali inviati dal cliente per una chiara responsabilità degli asset.

### 4.3 Collaborazione e Feedback
- **Sidebar Commenti**: Ogni post dispone di una chat contestuale dove agenzia e cliente discutono le modifiche.
- **Centro Notifiche**: Sistema di notifiche push in-app (Campanella) per avvisare di nuovi post da approvare o nuovi commenti ricevuti.

### 4.4 Intelligenza Artificiale Strategica
Strumenti di supporto al copywriting:
- **Generazione Bozza**: Crea post personalizzati basati sul settore del cliente, il tono di voce e la piattaforma (Instagram, Facebook, LinkedIn, TikTok, ecc.).
- **Ottimizzazione**: Suggerimenti automatici per migliorare l'engagement e il tono di voce.

## 5. Logiche di Business e Sicurezza
- **Gestione Crediti**: Ogni cliente ha un numero fisso di post mensili. Il sistema scala automaticamente i crediti e avvisa l'agenzia in caso di esaurimento o richiesta di upgrade.
- **Multi-tenancy**: Isolamento totale dei dati tra i diversi clienti tramite Firestore Security Rules. Un cliente può vedere esclusivamente i post e i materiali associati al proprio ID azienda.

---
*Documento aggiornato automaticamente allo stato corrente dello sviluppo.*