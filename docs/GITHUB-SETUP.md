# Guida al Collegamento GitHub (v10.2)

Questa guida spiega come sincronizzare il codice di Nexus Pro con il repository ufficiale utilizzando il terminale.

## 1. Localizzare il Terminale
Il terminale è lo strumento necessario per inviare il codice. 
**In Firebase Studio:**
- Cerca la linguetta **"Terminal"** nella parte inferiore dello schermo.
- Se non la vedi, clicca sull'icona `>_` o seleziona dal menu in alto `View > Terminal`.

## 2. Comandi di Inizializzazione e Push
Copia e incolla questi comandi nel terminale premendo INVIO dopo ognuno. Questi comandi configureranno il repository e invieranno tutto il codice al server di GitHub.

```bash
# Inizializza il repository locale
git init

# Collega il repository remoto
git remote add origin https://github.com/emanueleadelini/Nexuspro.git

# Prepara tutti i file per l'invio
git add .

# Crea un punto di salvataggio con un messaggio
git commit -m "primo push completo"

# Imposta il ramo principale su main
git branch -M main

# Invia i file al server (sovrascrivendo eventuali conflitti remoti)
git push -u origin main --force
```

## 3. Manutenzione
Ogni volta che vengono apportate modifiche significative, ricorda di ripetere l'operazione di `add`, `commit` e `push` per mantenere il backup su GitHub aggiornato:
```bash
git add .
git commit -m "descrizione della modifica"
git push origin main
```

---
*Documentazione Tecnica AD Next Lab - 2024*
