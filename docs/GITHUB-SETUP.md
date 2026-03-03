# Guida al Collegamento GitHub (v10.3)

Questa guida spiega come sincronizzare il codice di Nexus Pro con il repository ufficiale utilizzando il terminale.

## 1. Localizzare il Terminale Corretto
Per garantire che i comandi funzionino, usa il terminale integrato in **Firebase Studio**:
- Cerca la linguetta **"Terminal"** nella parte inferiore dello schermo.
- Se non la vedi, clicca su **`View > Terminal`** nel menu in alto.
- *Nota: Se usi il terminale di Windows (CMD), devi prima entrare nella cartella del progetto con `cd`.*

## 2. Comandi di Inizializzazione e Push
Copia e incolla questi comandi nel terminale premendo INVIO dopo ognuno:

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
Ogni volta che vengono apportate modifiche significative, ricorda di ripetere l'operazione per mantenere il backup aggiornato:
```bash
git add .
git commit -m "descrizione della modifica"
git push origin main
```

---
*Documentazione Tecnica AD Next Lab - 2024*
