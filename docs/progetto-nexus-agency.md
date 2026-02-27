# AD Next Lab - Manuale Tecnico Master (Nexus Agency)

Questo documento contiene l'analisi ingegneristica completa, l'architettura e il codice sorgente logico della piattaforma AD Next Lab.

---

## 1. Architettura di Sistema
- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS, ShadCN UI.
- **Backend**: Firebase 11 (Firestore, Authentication).
- **AI Engine**: Genkit 1.x con Gemini 2.5 Flash.
- **Pattern**: Multi-tenant basato su `cliente_id` con RBAC a 4 livelli: `super_admin`, `operatore`, `referente`, `collaboratore`.

---

## 2. Modelli Dati (Firestore)

### 2.1 UserProfile (`/users/{uid}`)
Definisce l'identità e i permessi dell'utente.
- `ruolo`: `super_admin`, `operatore`, `referente`, `collaboratore`.
- `cliente_id`: Collega l'utente (referente/collaboratore) a una specifica azienda cliente.
- `permessi`: Array di stringhe per granularità fine (es. `creazione_post`, `uso_ai`).

### 2.2 Client (`/clienti/{clienteId}`)
Gestione dell'azienda cliente e dei crediti.
- `post_totali`: Budget mensile di post inclusi nel piano.
- `post_usati`: Contatore dei post creati nel mese corrente.
- `richiesta_upgrade`: Flag per segnalare necessità di post extra all'agenzia.

### 2.3 Post (`/clienti/{clienteId}/post/{postId}`)
Contenuto strategico con workflow a 7 stati.
- **Workflow**: `bozza` -> `revisione_interna` -> `da_approvare` -> `revisione` -> `approvato` -> `programmato` -> `pubblicato`.
- `piattaforma`: Instagram, LinkedIn, Facebook, TikTok, X, Pinterest, Google Business.
- `versione_corrente`: Indice dell'ultima versione del copy salvata nell'array `versioni`.

---

## 3. Logiche di Business Core

### 3.1 Sistema Crediti & Limiti
Ogni post creato incrementa `post_usati`. L'eliminazione di un post in stato `bozza` riaccredita il punto. Il sistema impedisce la creazione se `post_usati >= post_totali`, a meno che l'operatore non forzi l'operazione.

### 3.2 Gestione Asset (Material Strategy)
- **Direct Upload**: Supportato per file < 50MB.
- **External Assets**: Per file > 50MB (video pesanti, cartelle), il sistema memorizza un `link_esterno` (Drive/WeTransfer).
- **Validazione**: Gli asset caricati dal cliente entrano in stato `in_attesa` e devono essere validati dall'agenzia prima di poter essere associati a un post.

---

## 4. Codice Sorgente Logico (Core Snippets)

### 4.1 Security Rules (Robust Fallback Strategy)
Le regole utilizzano un sistema di verifica a 3 livelli: JWT Claims, Hardcoded UID (per emergenza) e Firestore Fetch.
```javascript
function getUserRole() {
  return request.auth.token.ruolo != null
    ? request.auth.token.ruolo
    : (exists(/databases/$(database)/documents/users/$(request.auth.uid)) 
        ? get(/databases/$(database)/documents/users/$(request.auth.uid)).data.ruolo 
        : 'guest');
}
```

### 4.2 AI Flow: Strategia Social
Utilizza Gemini 2.5 Flash per trasformare i requisiti in copy persuasivo, adattando automaticamente tono di voce e limiti di caratteri per ogni piattaforma social.

---
*Documento generato per audit tecnico - Versione 1.8*
