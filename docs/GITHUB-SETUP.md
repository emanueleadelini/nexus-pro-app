# Guida al Collegamento GitHub

Segui questi passaggi per collegare correttamente il codice sorgente di Nexus Pro al repository ufficiale su GitHub.

## 1. Configurazione Iniziale
Apri il terminale nella cartella radice del progetto ed esegui i seguenti comandi:

```bash
# Inizializza il repository git locale
git init

# Aggiungi l'origine remota
git remote add origin https://github.com/emanueleadelini/Nexuspro.git
```

## 2. Preparazione del primo commit
Assicurati di avere un file `.gitignore` corretto per evitare di caricare la cartella `node_modules` o file di configurazione locale.

```bash
# Aggiungi tutti i file al sistema di tracking
git add .

# Crea il commit iniziale
git commit -m "Initial commit: Hub Digitale v10.1 - Identity Aware"
```

## 3. Configurazione Branch e Pubblicazione
Imposta il branch principale su `main` ed esegui il push:

```bash
# Rinomina il branch in main (standard GitHub)
git branch -M main

# Invia il codice al server
git push -u origin main
```

## 4. Manutenzione
Ogni volta che vengono effettuate modifiche tramite l'App Prototyper di Firebase Studio, ricordati di fare il `git pull` locale per sincronizzare le modifiche dell'AI, e poi il `push` per mantenere aggiornato il repository remoto.

---
*Documentazione Tecnica AD Next Lab*
