# AD Next Lab - Documentazione Tecnica Master (V3.0)

Questo documento contiene l'analisi ingegneristica completa e il codice sorgente logico della piattaforma AD Next Lab.

## 1. Architettura di Sistema
Il sistema è una Single Page Application (SPA) multi-tenant basata su **Next.js 15 (App Router)** e **Firebase 11**.

### Stack Tecnologico
- **Frontend**: React 19, Tailwind CSS, ShadCN UI.
- **Backend**: Firebase Firestore, Auth.
- **AI**: Genkit 1.x + Google Gemini 2.5 Flash.

## 2. Modello Dati e Sicurezza

### 2.1 RBAC (Role-Based Access Control)
Il sistema utilizza un modello a 4 livelli:
1. **super_admin**: Accesso totale.
2. **operatore**: Gestione post e asset trasversale.
3. **referente**: Approvazione post e upload per conto del cliente.
4. **collaboratore**: Solo visualizzazione e commenti.

### 2.2 Security Rules (Logic)
Le regole garantiscono l'isolamento multi-tenant. Un utente di tipo `referente` può accedere solo ai documenti dove `cliente_id` nel suo profilo coincide con l'ID della collezione `clienti`.

## 3. Workflow a 7 Stati (Logica Post)
Il ciclo di vita di un post segue questa sequenza:
`bozza` -> `revisione_interna` -> `da_approvare` -> `revisione` -> `approvato` -> `programmato` -> `pubblicato`.

- **Transizioni Cliente**: Può solo spostare da `da_approvare` a `approvato` o `revisione`.
- **Transizioni Agenzia**: Gestisce tutti i passaggi interni e la programmazione.

## 4. Codice Sorgente - Core Logic

### 4.1 Hook di Sicurezza Real-time (`useCollection`)
Gestisce la sottoscrizione ai dati Firestore con gestione centralizzata degli errori di permesso per il debug.

```typescript
// Semplificazione del codice in src/firebase/firestore/use-collection.tsx
export function useCollection(query) {
  // onSnapshot con errorEmitter.emit('permission-error', contextualError)
}
```

### 4.2 Gestione Notifiche
Il sistema di notifiche è real-time e filtra obbligatoriamente per `destinatario_uid`.

### 4.3 Generazione AI (Genkit)
Utilizza prompt strutturati che iniettano il contesto aziendale (Brand Brief) per generare testi coerenti.

## 5. Limiti e Specifiche Asset
- **Upload Diretto**: Max 50MB per file (immagini/video brevi).
- **Link Esterni**: Supporto per WeTransfer/Drive integrato nel workflow per file pesanti.

---
*Documento generato per analisi ingegneristica interna.*