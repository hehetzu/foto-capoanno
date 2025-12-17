# Capodanno Foto

Un semplice sito web per caricare e visualizzare foto di Capodanno.

## Come usare localmente

1. Avvia il server: `npm start`
2. Apri il browser e vai su `http://localhost:3000`
3. Carica le tue foto usando il form
4. Visualizza la galleria delle foto caricate

## Deploy online

Il sito è configurato per essere deployato su Vercel.

1. Vai su [Vercel.com](https://vercel.com) e accedi (o registrati).
2. Clicca su "New Project".
3. Importa il repository GitHub `foto-capoanno`.
4. Vercel rileverà automaticamente la configurazione e deployerà il sito.
5. Una volta deployato, otterrai un URL pubblico (es. `https://foto-capoanno.vercel.app`).

## Funzionalità

- Caricamento di foto (solo immagini, max 10MB)
- Galleria per visualizzare tutte le foto caricate
- Interfaccia semplice e user-friendly

## Tecnologie utilizzate

- Node.js
- Express
- Multer (per l'upload dei file)
- HTML/CSS/JavaScript

## Note

Le foto caricate vengono salvate nella cartella `public/uploads/`.
Su Vercel, i file caricati potrebbero non persistere tra i deploy; considera un servizio di storage esterno per produzione.