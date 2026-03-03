# Nexus Pro - Security Rules Logic (v10.1)

## 1. Filosofia di Sicurezza: Identity-Aware v10.0
Le regole di Firestore sono progettate per garantire l'isolamento dei dati (Multi-tenancy) senza compromettere le performance. Il sistema evita l'uso eccessivo della funzione `get()` nelle operazioni di `list` per prevenire latenze e crash durante il caricamento.

## 2. Funzioni Core
- `isSignedIn()`: Verifica l'autenticazione tramite Firebase Auth.
- `getUserRole()`: Recupera il ruolo dal documento utente.
- `getUserClienteId()`: Recupera il tenant ID associato all'utente.
- `isAgency()`: Permette l'accesso se l'utente è un admin o operatore.
- `isClientOf(clienteId)`: Permette l'accesso se il `cliente_id` dell'utente corrisponde al tenant richiesto.

## 3. Logica di Accesso (Esempio)
```javascript
match /clienti/{clienteId}/post/{postId} {
  // Accesso limitato al tenant o all'agenzia
  allow get, list: if isAgency() || isClientOf(clienteId);
  
  // Scrittura riservata all'agenzia
  allow create: if isAgency();
  
  // Aggiornamento condizionato dallo stato per il cliente
  allow update: if isAgency() || (isClientOf(clienteId) && resource.data.stato == 'da_approvare');
}
```

## 4. Protezione Client-Side
Oltre alle regole server, gli hook `useCollection` e `useDoc` implementano guardie "brute-force" che bloccano query verso percorsi non validi (es. path contenenti `unknown`) prima che la richiesta lasci il client.
