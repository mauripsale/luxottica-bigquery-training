# Task List: Frontend Modularization & Zero-Build Pipeline
**Branch:** `feature/frontend-modularization`  
**Spec:** `SPEC-frontend-modularization.md` | **Plan:** `tasks/plan.md`

---

## 📋 Tasks

- [x] Task 1: `builder-pipeline` — Creazione dell'Assemblatore Deterministico Python
  - Acceptance: Lo script `tools/build_frontend.py` legge una struttura a cartelle `v2/frontend/src/` e produce `v2/frontend/index.html`. Supporta inclusione ordinata di partials HTML, script e stili con esecuzione < 100ms e zero dipendenze esterne.
  - Verify: `python3 tools/build_frontend.py --help` e test di generazione dummy.
  - Files: `tools/build_frontend.py`, `tools/verify_frontend_bundle.py`

- [x] Task 2: `core-bridge` — Namespace `window.Hub` e Setup del Bridge Handlers
  - Acceptance: `src/js/core/hub-namespace.js` e `src/js/core/window-bridge.js` definiti. Tutte le funzioni usate nei 180+ attributi `onclick`/`oninput` sono registrate e mappate sia su `window.Hub` che direttamente su `window`.
  - Verify: Test statico di copertura delle firme delle funzioni contro il set di chiamate inline censito in `index.html`.
  - Files: `v2/frontend/src/js/core/hub-namespace.js`, `v2/frontend/src/js/core/window-bridge.js`, `v2/frontend/src/js/core/theme.js`

- [x] Task 3: `partials-dialogs` — Scomposizione dei 12 Modali Nativi `<dialog>`
  - Acceptance: Tutti i 12 modali estratti in `v2/frontend/src/components/dialogs/` con i relativi script logici estratti in `v2/frontend/src/js/modules/` (`rosetta.js`, `leaderboard.js`, `auth.js`, ecc.). La ricerca Rosetta Stone, il podio animato e il login rimangono 100% funzionanti.
  - Verify: `python3 tools/build_frontend.py` rigenera `index.html`; apertura di `#rosetta-modal` e `#leaderboard-modal` testata con browser CDP.
  - Files: `v2/frontend/src/components/dialogs/*.html`, `v2/frontend/src/js/modules/*.js`

- [x] Task 4: `partials-blocks` — Scomposizione Sezioni Didattiche & Minigiochi Coffee Break
  - Acceptance: Estratti `block-cover.html`, `block-1.html`..`block-5.html` in `v2/frontend/src/components/blocks/`. Estratti i 3 motori del Coffee Break (`query-beats.js`, `optics-sim.js`, `turing-roast.js`) e il dizionario `i18n-translations.js`.
  - Verify: Esecuzione di `python3 tools/build_frontend.py` e verifica di switch dei tab e audio synth senza errori in console.
  - Files: `v2/frontend/src/components/blocks/*.html`, `v2/frontend/src/js/games/*.js`, `v2/frontend/src/js/modules/i18n-translations.js`

- [x] Task 5: `verification-suite` — Consiglio Avversariale a 360° & Collaudo Finale
  - Acceptance: Esecuzione del dibattito avversariale a 360° con subagenti concorrenti reali (UI/UX, QA Bug Hunter, Performance, Security, Lead Architect) sul bundle generato. Zero errori di console, zero FOUC, validazione visuale superata.
  - Verify: `python3 tools/verify_frontend_bundle.py`, report del consiglio a 360° approvato con esito unanime positivo (UI/UX: 9.5/10, Performance: 100%, Security: PASS, QA: PASS).
  - Files: `tools/verify_frontend_bundle.py`, `v2/frontend/index.html`
