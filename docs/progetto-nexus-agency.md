# AD Next Lab - Documentazione Tecnica Master (V3.0)

Questo documento contiene l'analisi ingegneristica completa, la struttura del database e il codice sorgente logico della piattaforma **AD Next Lab**.

## 1. Architettura di Sistema
Il sistema è una Single Page Application (SPA) multi-tenant basata su **Next.js 15 (App Router)** e **Firebase 11**.

### Stack Tecnologico
- **Frontend**: React 19, Tailwind CSS, ShadCN UI.
- **Backend**: Firebase Firestore, Auth.
- **AI**: Genkit 1.x + Google Gemini 2.5 Flash.

---

## 2. Modello Dati e Sicurezza (Firestore)

### 2.1 Ruoli (RBAC)
1. **super_admin**: Accesso totale, gestione piani e clienti.
2. **operatore**: Gestione post e asset, supporto strategico.
3. **referente**: Approvazione post e upload asset per l'azienda cliente.
4. **collaboratore**: Visualizzazione e commenti.

### 2.2 Schema Collezioni (backend.json)
```json
{
  "entities": {
    "UserProfile": {
      "ruolo": ["super_admin", "operatore", "referente", "collaboratore"],
      "cliente_id": "string (opzionale)"
    },
    "Client": {
      "post_totali": "number",
      "post_usati": "number",
      "richiesta_upgrade": "boolean"
    },
    "Post": {
      "stato": ["bozza", "revisione_interna", "da_approvare", "revisione", "approvato", "programmato", "pubblicato"],
      "versione_corrente": "number",
      "versioni": "array<VersionePost>"
    }
  }
}
```

---

## 3. Codice Sorgente - Core Logic

### 3.1 Firebase Hooks (Real-time Sync)
**File**: `src/firebase/firestore/use-collection.tsx`
Gestisce la sottoscrizione ai dati con gestione centralizzata degli errori di permesso.

```tsx
export function useCollection<T = any>(memoizedTargetRefOrQuery) {
  const [data, setData] = useState(null);
  useEffect(() => {
    const unsubscribe = onSnapshot(memoizedTargetRefOrQuery, (snapshot) => {
      const results = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setData(results);
    }, (error) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({ operation: 'list', path: '...' }));
    });
    return () => unsubscribe();
  }, [memoizedTargetRefOrQuery]);
  return { data };
}
```

### 3.2 Workflow a 7 Stati (Logica Transizioni)
Il sistema impedisce transizioni illegali.
- **Agenzia**: Gestisce `bozza` -> `revisione_interna` -> `da_approvare`.
- **Cliente (Referente)**: Gestisce `da_approvare` -> `approvato` OR `revisione`.
- **Automazione**: `approvato` -> `programmato` -> `pubblicato`.

### 3.3 Generazione AI (Genkit Flow)
**File**: `src/ai/flows/generate-post-ai-flow.ts`
Utilizza un prompt strutturato per mantenere il Brand Tone of Voice del cliente.

```ts
const generatePostPrompt = ai.definePrompt({
  name: 'generatePostPrompt',
  prompt: `Sei un social media manager per AD next lab. Genera un post per {{{nomeAzienda}}}...`
});
```

---

## 4. Logiche di Business Critiche
- **Sistema Crediti**: Ogni post creato scala un credito dal `post_totali` del cliente. L'eliminazione di una bozza riaccredita il punto.
- **Gestione Asset**: Limite di 50MB per upload diretto. Per file pesanti, il sistema supporta l'inserimento di link esterni (Drive/WeTransfer) integrati nel workflow di approvazione.
- **Notifiche Real-time**: Filtrate per `destinatario_uid` per garantire la privacy dei dati tra diversi tenant.

---
*Documento generato per analisi ingegneristica interna. Proprietà di AD Next Lab.*