# Spec: Frontend Modularization & Zero-Build Pipeline (`SPEC-frontend-modularization.md`)

## 1. Objective
Scomporre il monolite `v2/frontend/index.html` (9.557 righe, 552 KB) in componenti sorgente modulari ad alta leggibilità e manutenibilità (HTML partials e moduli JS da 100–300 righe ciascuno), preservando rigorosamente:
1. **Zero-Build Node.js/npm**: Nessun impatto sui tempi di Cloud Build (< 25s) né sul container Python `python:3.11-slim`.
2. **Single-File Delivery**: Erogazione a Cloud Run e agli studenti di un singolo artefatto atomico per evitare saturation waterfall su connessioni aziendali/Wi-Fi (1 RTT HTTP, ~100 KB gzipped).
3. **100% Retrocompatibilità Handlers**: Nessun errore runtime `ReferenceError` sui 180+ attributi `onclick`/`oninput` esistenti.
4. **Adversarial Gate Continuo**: Ogni task di implementazione viene sfidato dal Red Team con verifiche di non-regressione.

---

## 2. Tech Stack
- **Runtime Web:** HTML5, CSS moderno (CSS Anchor Positioning, View Transitions API), Tailwind CSS (JIT browser CDN), Web Audio API, Canvas.
- **Backend Servente:** FastAPI (Python 3.11), Uvicorn, Google Cloud Run.
- **Pipeline Assembler:** Python nativo (`tools/build_frontend.py` o standard library `re`, `pathlib`, zero pip/npm dipendenze).
- **Test & Validation:** Python + Chrome DevTools Protocol (CDP) / Playwright Headless per visual regression e audit funzionale.

---

## 3. Assumptions Surfaced
1. **Nessun runtime Node.js su Cloud Build o in locale:** L'ambiente di sviluppo e di rilascio usa esclusivamente Python 3.11+.
2. **Tailwind JIT runtime:** Manteniamo il compilatore runtime di Tailwind nel browser (`tailwindcss.min.js`), evitando Tailwind CLI statico per preservare tutte le classi interpolate a runtime (es. `bg-${ch.activeColor}-50/80`).
3. **Browser target:** Browser desktop moderni evergreen (Google Chrome, Microsoft Edge, Safari 17+, Firefox) utilizzati nei workshop aziendali.
4. **Branching:** Tutti i commit avvengono sul branch dedicato `feature/v2-cloud-run-migration` o `feature/frontend-modularization` (MAI direttamente su `main`).

---

## 4. Commands
- **Assemblaggio Frontend:**
  ```bash
  python3 tools/build_frontend.py
  ```
- **Verifica Validazione Idempotenza & Diff:**
  ```bash
  python3 tools/verify_frontend_bundle.py
  ```
- **Esecuzione Test Headless CDP:**
  ```bash
  python3 scripts/audit_browser_clean.py
  ```
- **Avvio Server Locale FastAPI:**
  ```bash
  cd v2 && uvicorn backend.app.main:app --host 0.0.0.0 --port 8080 --reload
  ```
- **Build & Deploy Cloud Run:**
  ```bash
  gcloud builds submit --config=v2/cloudbuild.yaml --project=$GCP_PROJECT_ID .
  ```

---

## 5. Project Structure
```text
v2/frontend/
├── index.html                           # Artefatto di produzione generato (monolite ottimizzato)
├── src/                                 # Sorgenti modulari ad alta leggibilità
│   ├── layout/
│   │   ├── head.html                    # Meta, script Tailwind JIT, early zero-FOUC resolver
│   │   ├── nav-header.html              # Barra superiore studente, badge, hamburger menu
│   │   └── footer.html                  # Chiusura body e bundle script injection
│   ├── components/
│   │   ├── dialogs/                     # I 12 dialoghi modali nativi HTML5
│   │   │   ├── rosetta-modal.html       # Dizionario Excel -> BigQuery SQL
│   │   │   ├── leaderboard-modal.html   # Podio classifica e coriandoli
│   │   │   ├── trainer-pin.html         # Login e sblocco PIN docente
│   │   │   ├── role-selection.html      # Scelta ruolo iniziale
│   │   │   ├── student-onboarding.html  # Registrazione nome/team
│   │   │   ├── student-manager.html     # Roster gestione aula
│   │   │   └── ...                      # Altri 6 dialoghi
│   │   ├── blocks/                      # Sezioni didattiche della Masterclass
│   │   │   ├── block-cover.html         # Hero banner e welcome
│   │   │   ├── block-1.html             # Data Canvas Exploration
│   │   │   ├── block-2.html             # Gemini SQL & Prompts
│   │   │   ├── block-break.html         # Torneo Coffee Break
│   │   │   ├── block-3.html             # Attribution & ROAS
│   │   │   ├── block-4.html             # VIP Forensic Challenge
│   │   │   └── block-5.html             # CMO Strategy Synthesis
│   │   └── trainer/
│   │       └── command-center.html      # Cabina di regia docente
│   ├── js/
│   │   ├── core/
│   │   │   ├── hub-namespace.js         # Inizializzazione window.Hub
│   │   │   ├── theme.js                 # Theme resolver e clipPath transition
│   │   │   ├── state.js                 # Macchina di stato studente e aula
│   │   │   └── window-bridge.js         # Esportazione controllata dei 180 handler su window
│   │   ├── modules/
│   │   │   ├── i18n-translations.js     # Dizionario traduzioni IT / EN
│   │   │   ├── timeline.js              # Navigazione tab e blocco sezioni
│   │   │   ├── rosetta.js               # Fuzzy search e filtri live Excel-SQL
│   │   │   ├── leaderboard.js           # Calcolo punteggi e ranking team
│   │   │   ├── challenges.js            # Validatori di query per Blocchi 1-4
│   │   │   └── trainer-regia.js         # Broadcast socket e comandi regia
│   │   └── games/
│   │       ├── query-beats.js           # 808 Web Audio Synth
│   │       ├── optics-sim.js            # Ray-Ban Meta Canvas Optics
│   │       └── turing-roast.js          # Heuristics Prompt Roaster
│   └── css/
│       └── custom-styles.css            # Stili per dialog backdrop e anchor position
└── tools/
    ├── build_frontend.py                # Assemblatore deterministico Python
    └── verify_frontend_bundle.py        # Validatore di non-regressione
```

---

## 6. Code Style & Bridge Pattern
Ogni modulo JavaScript risiede nel proprio file e incapsula la propria logica, ma registra esplicitamente le entrypoint pubbliche su `window.Hub` e sul `window` globale tramite il Facade Bridge per evitare `ReferenceError`:

```javascript
// Esempio: v2/frontend/src/js/modules/rosetta.js
(function(Hub) {
  'use strict';

  function filterRosettaModal() {
    const searchEl = document.getElementById('rosetta-modal-search');
    if (!searchEl) return;
    const query = searchEl.value.toLowerCase();
    document.querySelectorAll('.rosetta-modal-row').forEach(row => {
      row.style.display = row.innerText.toLowerCase().includes(query) ? '' : 'none';
    });
  }

  function openRosettaModal() {
    const searchEl = document.getElementById('rosetta-modal-search');
    if (searchEl) { searchEl.value = ''; filterRosettaModal(); }
    if (typeof showModalDialog === 'function') showModalDialog('rosetta-modal');
  }

  // Registrazione nel namespace Hub
  Hub.rosetta = { filterRosettaModal, openRosettaModal };

  // Esportazione bridge su window per gli handler onclick/oninput inline esistenti
  window.filterRosettaModal = filterRosettaModal;
  window.openRosettaModal = openRosettaModal;

})(window.Hub = window.Hub || {});
```

---

## 7. Testing & Adversarial Strategy
Per ogni modulo estratto, l'implementazione deve superare 3 controlli:
1. **Controllo Red Team Statico:** Verifica che tutte le funzioni chiamate da attributi `onclick`/`oninput` nel blocco estratto siano censite ed esportate nel bridge.
2. **Controllo Idempotenza Bundle:** Lo script `python3 tools/build_frontend.py` deve rigenerare `index.html` in < 100ms senza perdere tag, attributi o stili.
3. **Controllo Headless Live CDP:**
   - Onboarding studente completabile senza warning in console.
   - Apertura di tutti i 12 modali `<dialog>`.
   - Filtro live della tabella Rosetta Stone con query "JOIN" o "VLOOKUP".
   - Cambio scheda tra Blocchi 1 e 2 senza collisioni visive.

---

## 8. Boundaries
- **Always do:**
  - Eseguire `python3 tools/build_frontend.py` e il test CDP prima di qualsiasi commit.
  - Mantenere la compatibilità totale con Python 3.11 e Cloud Run.
  - Registrare esplicitamente ogni nuova funzione sia in `window.Hub` che su `window`.
  - Lavorare su branch dedicato (`feature/v2-cloud-run-migration` o `feature/frontend-modularization`).
- **Ask first:**
  - Modificare la struttura del dataset BigQuery o lo schema di Firestore.
  - Introdurre qualsiasi libreria JS esterna o file CDN non autorizzato.
- **Never do:**
  - Introdurre Node.js, `npm`, `package.json`, Vite o Webpack nella build di produzione.
  - Pushare direttamente su `main`.
  - Eliminare o rimuovere i 180 handler inline esistenti in una sola passata senza test.
  - Usare o fare riferimento a domini legacy dismessi (`ipsa.datatonic.team`).

---

## 9. Success Criteria
- [ ] Il file sorgente principale non è più un monolite indecifrabile da 9.557 righe, ma una composizione pulita di componenti in `v2/frontend/src/`.
- [ ] Il comando `python3 tools/build_frontend.py` genera in < 100ms il file atomico `v2/frontend/index.html`.
- [ ] Zero errori `Uncaught ReferenceError` nella console degli strumenti di sviluppo per qualsiasi azione utente.
- [ ] Cloud Build compila e distribuisce su Cloud Run in meno di 30 secondi mantenendo scale-to-zero e 512 MB di memoria.
- [ ] Tutti i test di regressione visiva CDP (Light/Dark mode, Rosetta dialog, Coffee break Web Audio) superati con successo.

---

## 10. Open Questions per l'Utente
1. **Branch di Lavoro:** Preferisci continuare direttamente sul branch corrente `feature/v2-cloud-run-migration` (dove abbiamo già il deploy live verificato) oppure creare un nuovo sotto-branch (es. `feature/frontend-modularization`)?
2. **Commit dei file generati:** Sei d'accordo che sia i sorgenti in `v2/frontend/src/` sia l'artefatto compilato `v2/frontend/index.html` vengano tracciati in Git, così che Cloud Run e il server FastAPI possano servire direttamente `index.html` senza dover ricompilare durante il deploy?
