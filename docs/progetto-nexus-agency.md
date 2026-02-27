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
- `cliente_id`: Collega l'utente a una specifica azienda cliente.
- `permessi`: Array di stringhe (es. `creazione_post`, `uso_ai`).

### 2.2 Client (`/clienti/{clienteId}`)
Gestione dell'azienda cliente e dei crediti.
- `post_totali`: Budget mensile di post.
- `post_usati`: Contatore dei post creati nel mese.

### 2.3 Post (`/clienti/{clienteId}/post/{postId}`)
Contenuto strategico con workflow a 7 stati:
- `bozza` -> `revisione_interna` -> `da_approvare` -> `revisione` -> `approvato` -> `programmato` -> `pubblicato`.

---

## 3. Logiche di Business Core

### 3.1 Sistema Crediti
Ogni post creato incrementa `post_usati`. Il sistema impedisce la creazione se il limite è raggiunto, a meno di upgrade o permessi admin.

### 3.2 AI Flow: Generazione Post
Utilizza Gemini 2.5 Flash per trasformare prompt in copy ottimizzato per piattaforma (Instagram, LinkedIn, etc.) e tono di voce.

---

## 4. Codice Sorgente Logico (Core Snippets)

### 4.1 Security Rules (V4 - Hardcoded Check)
```javascript
function isHardcodedAdmin() {
  return request.auth.uid in ['DaRQQ7aTpnbw195PmvTE98F2kwD2'];
}

match /{document=**} {
  allow read, write: if isHardcodedAdmin() || true; // Nuclear Test Mode
}
```

### 4.2 Query Notifiche (Query di Sistema)
```typescript
const notificationsQuery = query(
  collection(db, 'notifiche'),
  where('destinatario_uid', '==', user.uid),
  orderBy('creato_il', 'desc'),
  limit(10)
);
```

### 4.3 Inizializzazione Firebase
```typescript
export function initializeFirebase() {
  if (!getApps().length) {
    return initializeApp(firebaseConfig);
  }
  return getApp();
}
```

---
*Documento generato per audit tecnico - Versione 1.9*
