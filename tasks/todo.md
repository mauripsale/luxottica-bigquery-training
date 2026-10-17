# TODO Checklist: IPSALE Engine v3.0 (White-Label & Manager Portal)

- [ ] **Fase 1: White-Label Branding Engine**
  - [ ] Estendere `/api/v2/config` in `v2/backend/app/main.py` per restituire l'oggetto `TenantConfig` (`org_name`, `logo_url`, `team_names`, `accent_color`)
  - [ ] Aggiornare `v2/frontend/src/js/modules/auth-service.js` e `modals-and-init.js` per applicare dinamicamente il branding dal `TenantConfig`
  - [ ] Rendere dinamiche le opzioni dei team nel form di onboarding (`student-onboarding-modal.html`)

- [ ] **Fase 2: Ruolo Manager & Pannello Gestione Allowlist**
  - [ ] Estendere `v2/backend/app/services/auth_service.py` per supportare il ruolo `MANAGER` (`MANAGER_EMAILS`)
  - [ ] Creare gli endpoint REST in `v2/backend/app/main.py`:
    - `GET /api/v3/admin/allowlist`
    - `POST /api/v3/admin/allowlist`
    - `POST /api/v3/admin/allowlist/import-csv`
  - [ ] Creare il nuovo modulo JS `v2/frontend/src/js/modules/manager-controls.js`
  - [ ] Creare il nuovo componente HTML `v2/frontend/src/components/dialogs/manager-modal.html`
  - [ ] Aggiungere il bottone ed il badge per accedere alla vista Manager nella navbar

- [ ] **Fase 3: Compilation & Quality Verification**
  - [ ] Aggiornare `v2/frontend/src/index.template.html` per includere `manager-controls.js` e `manager-modal.html`
  - [ ] Eseguire `python3 tools/build_frontend.py` e `python3 tools/verify_frontend_bundle.py`
  - [ ] Verificare gli endpoint via test script Python
  - [ ] Commit e Push su `main`
