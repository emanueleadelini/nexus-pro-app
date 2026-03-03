# Guida al Collegamento GitHub

Segui questi passaggi per collegare correttamente il codice sorgente di Nexus Pro al repository ufficiale su GitHub.

## 1. Che cos'è il Terminale?
Il terminale è lo strumento che permette di inviare comandi testuali al sistema. 
**Dove trovarlo in Firebase Studio:**
- Guarda nella parte bassa della schermata.
- Cerca la scheda con la scritta **"Terminal"**.
- Se non la vedi, cerca l'icona con il simbolo `>_` o clicca sul menù delle opzioni (solitamente tre lineette o "View") e seleziona "Terminal".

## 2. Inizializzazione Repository
Una volta aperto il terminale, assicurati di essere nella cartella radice del progetto ed esegui i seguenti comandi:

```bash
# Inizializza il repository git locale
git init

# Aggiungi l'origine remota
git remote add origin https://github.com/emanueleadelini/Nexuspro.git
```

## 3. Verifica Stato (Richiesto da Antigravity)
Per capire se il collegamento è configurato bene, scrivi questi comandi uno alla volta:

```bash
# Mostra lo stato dei file
git status

# Mostra i collegamenti remoti attivi
git remote -v
```

## 4. Preparazione e Primo Commit
Dopo la verifica, procedi con l'invio dei file:

```bash
# Aggiungi tutti i file al sistema di tracking
git add .

# Crea il primo commit con il messaggio richiesto
git commit -m "primo push del progetto"
```

## 5. Configurazione Branch e Push
Imposta il branch principale su `main` ed esegui l'invio al server:

```bash
# Rinomina il branch in main
git branch -M main

# Invia il codice al server remoto
git push -u origin main
```

## 6. Manutenzione
Ogni volta che effettui modifiche tramite l'App Prototyper di Firebase Studio, ricordati di eseguire un `git pull` locale per sincronizzare le modifiche dell'AI, e successivamente un `push` per mantenere aggiornato il repository remoto.

---
*Documentazione Tecnica AD Next Lab*
