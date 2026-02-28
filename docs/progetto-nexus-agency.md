# Nexus Agency (AD Next Lab) - Manuale Tecnico Master v5.2

Questo documento rappresenta la documentazione definitiva per l'analisi tecnica e commerciale della piattaforma AD Next Lab. Progettata come soluzione SaaS multi-tenant per agenzie di comunicazione.

---

## 1. Architettura di Sistema
La piattaforma utilizza uno stack moderno basato su **Next.js 15**, **React 19** e **Firebase Cloud**.
- **Isolamento Multi-tenant**: Ogni cliente è identificato da un `cliente_id` univoco. Tutti i dati (Post, Materiali, Commenti) sono filtrati tramite questo ID a livello di Security Rules.
- **RBAC (Role-Based Access Control)**:
  - `super_admin`: Controllo totale su sistema, clienti e fatturazione.
  - `operatore`: Produzione contenuti per tutti i clienti dell'agenzia.
  - `referente`: Manager lato cliente con poteri di approvazione e upload.
  - `collaboratore`: Visualizzatore lato cliente con possibilità di upload e commento.

---

## 2. Sicurezza & Data Isolation (Firestore)
Le Security Rules (V5.2 Production) garantiscono che nessun utente possa leggere o modificare dati al di fuori del proprio perimetro.

### Logica di Accesso & Cancellazione:
1. **Accesso**: Filtrato per `ruolo` e `cliente_id` memorizzati nel profilo Firestore dell'utente.
2. **Cancellazione Tenant**: L'operazione di eliminazione di un cliente rimuove ricorsivamente il documento dell'azienda, tutti i post, i materiali e i profili utente Firestore associati. 
   - *Nota Tecnica*: La cancellazione del profilo Firestore revoca istantaneamente l'accesso all'app. L'email nel modulo Auth di Firebase persiste finché non rimossa manualmente dalla console (standard di sicurezza Firebase Client SDK).

---

## 3. Workflow Operativi

### 3.1 Editorial Calendar (Produttività)
Sistema dinamico basato su `dnd-kit` per il riposizionamento dei post nel PED. Lo stato di un post segue un workflow blindato:
1. `bozza` -> 2. `revisione_interna` -> 3. `da_approvare` -> 4. `revisione` -> 5. `approvato` -> 6. `programmato` -> 7. `pubblicato`.

### 3.2 Workflow di Approvazione (Security)
Il **Referente** può solo modificare lo stato del post da `da_approvare` a `approvato` o `revisione`. Non ha il permesso di alterare i testi o le immagini strategiche prodotte dall'agenzia.

### 3.3 Credit System (Monetizzazione SaaS)
Ogni cliente ha un limite di `post_totali` mensili. Il sistema monitora i `post_usati` in tempo reale. Predisposto per integrazione gateway pagamenti per l'acquisto di pacchetti post extra.

---

## 4. AI Post Generator Engine
Integrazione con **Gemini 2.5 Flash** tramite **Genkit 1.x**.
- **Prompt strategico**: L'IA genera copy personalizzati basati su settore, tono di voce e piattaforma social, garantendo coerenza di brand.

---

## 5. Esportazione e Backup
La piattaforma permette all'Admin di scaricare un archivio JSON completo di un cliente prima della cancellazione, garantendo la portabilità dei dati e la conformità GDPR.

---
*Documento di Audit Tecnico - Versione 5.2 - Pronto per la fase di Go-Live Commerciale*