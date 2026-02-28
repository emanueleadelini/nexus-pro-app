# Nexus Pro (AD Next Lab) - Manuale Tecnico Master v5.5

Documentazione aggiornata con le specifiche del Design System Dark, i 3 Pilastri dell'Hub e il Workflow 2.0.

---

## 1. Visione & Posizionamento
Nexus Pro non è un semplice gestionale, ma un **Hub Digitale integrato** per aziende ad alto potenziale.
- **ADNext Digital**: Strategia Marketing + AI Generativa.
- **ADNext Tech**: Automazione processi e sviluppo software custom.
- **ADNext Academy**: Formazione professionale continua.

---

## 2. Architettura SaaS & Multi-tenancy
Nexus Pro utilizza un'architettura **Tenant-per-Document** supportata da Firestore Security Rules.

### Design System "Nexus Dark"
- **Background**: Slate 950 (#020617)
- **Accent**: Indigo 600 / Purple 600
- **Interaction**: Glassmorphism (sfondi translucidi, blur elevato).

### Isolamento Dati
Ogni cliente è un "Tenant" identificato da un `cliente_id`. 
- **Security Rules**: Isolamento fisico garantito a livello di collezione `/clienti/{id}`.
- **Branding Dinamico**: Il logo caricato dall'admin si propaga automaticamente nell'header cliente e nel feed Instagram simulato.

---

## 3. Features Core
### 3.1 Post Workflow 2.0 (Silenzio Assenso)
Workflow ottimizzato per eliminare i colli di bottiglia:
1. **Invio**: L'Agenzia crea il post e lo invia in `da_approvare`.
2. **Countdown 24h**: Il post mostra una scadenza di 24 ore. Se il cliente non agisce, l'agenzia procede secondo la clausola di "Silenzio Assenso".
3. **Approvazione**: Il cliente approva o richiede revisioni dal feed simulato.

### 3.2 Feed Instagram Preview Modular
- Avatar con logo aziendale dinamico.
- Immagine 1:1 con overlay di stato.
- Azioni contestuali basate sui permessi utente.

### 3.3 Gestione Notifiche & Deep Linking
- **Audit Log**: Storico persistente in `/users/{uid}/notifiche`.
- **Deep Linking**: Cliccare su una notifica porta l'utente direttamente all'elemento (es. post specifico nel feed) con scroll automatico ed evidenziazione visiva.

---

## 4. Struttura Database (Firestore)
- `/users/{uid}`: Profili con ruolo e permessi granulari.
- `/users/{uid}/notifiche/{id}`: Notifiche isolate per utente.
- `/clienti/{clienteId}`: Dati tenant, crediti e logo.
- `/clienti/{clienteId}/post/{postId}`: Workflow editoriale e storico stati.
- `/clienti/{clienteId}/materiali/{materialeId}`: Asset creativi e documenti strategici.

---
*Proprietà Intellettuale - AD next lab - 2024*