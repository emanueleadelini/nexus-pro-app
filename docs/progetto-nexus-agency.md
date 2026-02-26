# AD Next Lab - Documentazione Tecnica Master (V5.0)

Questo documento costituisce il manuale tecnico definitivo della piattaforma **AD Next Lab**. È stato redatto per l'analisi ingegneristica e descrive l'architettura, le logiche di business e il codice core integrale.

## 1. Architettura di Sistema
- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS, ShadCN UI.
- **Backend**: Firebase 11 (Firestore, Auth).
- **AI Engine**: Genkit 1.x con Google Gemini 2.5 Flash.
- **Pattern**: Multi-tenant basato su `cliente_id` con RBAC (Role-Based Access Control) a 4 livelli.

---

## 2. Modello Dati (Firestore)

### 2.1 Collezioni Core
- `users`: Profili utenti con ruoli (`super_admin`, `operatore`, `referente`, `collaboratore`).
- `clienti`: Aziende gestite con sistema crediti post.
- `clienti/{id}/post`: Piano Editoriale (PED) con workflow a 7 stati.
- `clienti/{id}/materiali`: Archivio asset (Foto, Video, Grafiche) con limite 50MB.
- `notifiche`: Eventi real-time per approvazioni e feedback.

---

## 3. Logiche di Business Critiche

### 3.1 Workflow a 7 Stati (PED)
Il sistema implementa una macchina a stati finiti per il ciclo di vita dei contenuti:
1. `bozza` (Agenzia)
2. `revisione_interna` (Agenzia)
3. `da_approvare` (Agenzia -> Cliente)
4. `revisione` (Cliente -> Agenzia)
5. `approvato` (Cliente)
6. `programmato` (Automazione/Agenzia)
7. `pubblicato` (Fine ciclo)

### 3.2 Sistema Crediti
- Ogni post creato scala 1 credito dal campo `post_totali` del cliente.
- L'eliminazione di un post in stato `bozza` riaccredita automaticamente il punto.
- Notifica automatica al Super Admin per richieste di upgrade.

### 3.3 Gestione Asset e Limiti
- **Upload Locale**: Limite hardware di 50MB per file caricati direttamente su storage.
- **Link Esterni**: Supporto per URL Drive/WeTransfer per asset pesanti (>50MB).

---

## 4. Codice Sorgente Core (Analisi Ingegneristica)

### 4.1 Security Rules (Safe RBAC)
```javascript
// firestore.rules (Estratto Helper)
function getUserRole() {
  return request.auth.token.ruolo != null
    ? request.auth.token.ruolo
    : (exists(/databases/$(database)/documents/users/$(request.auth.uid)) 
        ? get(/databases/$(database)/documents/users/$(request.auth.uid)).data.ruolo 
        : 'guest');
}

match /notifiche/{notificaId} {
  allow list: if isAuthenticated() && (
    isAgency() || resource.data.destinatario_uid == request.auth.uid
  );
}
```

### 4.2 Hook Real-time (useCollection)
```tsx
// src/firebase/firestore/use-collection.tsx
export function useCollection<T = any>(memoizedTargetRefOrQuery) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!memoizedTargetRefOrQuery) return;
    setIsLoading(true);
    const unsubscribe = onSnapshot(memoizedTargetRefOrQuery, (snapshot) => {
      setData(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      setIsLoading(false);
    }, (error) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        operation: 'list',
        path: memoizedTargetRefOrQuery.path
      }));
    });
    return () => unsubscribe();
  }, [memoizedTargetRefOrQuery]);

  return { data, isLoading };
}
```

### 4.3 Generazione AI (Genkit Flow)
```ts
// src/ai/flows/generate-post-ai-flow.ts
const generatePostPrompt = ai.definePrompt({
  name: 'generatePostPrompt',
  input: { schema: GeneratePostInputSchema },
  output: { schema: GeneratePostOutputSchema },
  prompt: `Sei un social media manager esperto per AD next lab. 
           Genera un post per {{{nomeAzienda}}} in tono {{{tono.label}}}.`,
});
```

### 4.4 Sistema di Notifiche Real-time
Le notifiche vengono generate lato client durante le transizioni di stato critiche o i caricamenti di materiali e vengono ascoltate tramite il componente `NotificheBell`.

---

## 5. Script di Setup (Custom Claims)
Per una sicurezza ottimale, i ruoli dovrebbero essere impostati come Custom Claims nel token JWT.
```typescript
// Script suggerito per Node.js Admin SDK
admin.auth().setCustomUserClaims(uid, { ruolo: 'super_admin' });
```

---
*Documento aggiornato allo Sprint 2 - Proprietà Riservata di AD Next Lab.*