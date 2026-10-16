# 🚀 Guida di Migrazione & Redeploy su Nuovo Progetto Google Cloud (Qwiklabs)

Questo documento operativo descrive la procedura completa, testata e pronta all'uso per effettuare il redeploy immediato di **Luxottica Training Hub (v2)** quando l'ambiente temporaneo Qwiklabs/GCP corrente scade o viene chiuso.

---

## 📋 Indice Rapido
1. [Prerequisiti & Nuovo Progetto](#1-prerequisiti--nuovo-progetto)
2. [Fast-Track: Redeploy Automatico in 1-Click](#2-fast-track-redeploy-automatico-in-1-click)
3. [Procedura Dettagliata Passo-Passo (Fallback / Manuale)](#3-procedura-dettagliata-passo-passo)
4. [Verifica Funzionale & Smoke Test](#4-verifica-funzionale--smoke-test)
5. [Troubleshooting & Risoluzione Errori Comuni](#5-troubleshooting--risoluzione-errori-comuni)
6. [Regole di Governance & Ambiente](#6-regole-di-governance--ambiente)

---

## 1. Prerequisiti & Nuovo Progetto

Quando avvii un nuovo laboratorio Qwiklabs o crei un nuovo progetto Google Cloud:
1. Annota il **Project ID** del nuovo ambiente (es. `qwiklabs-gcp-xx-xxxxxxxxxxxx`).
2. Assicurati di avere il ruolo di `Owner` o `Editor` sul progetto.
3. Apri il terminale nella root del repository:
   ```bash
   cd "/Users/maurizio.ipsale/Library/CloudStorage/GoogleDrive-maurizio.ipsale@gmail.com/My Drive/Progetti Agy/MyQwiklabs"
   ```
4. Autenticati sulla Google Cloud CLI e imposta il nuovo progetto:
   ```bash
   # Autenticazione utente
   gcloud auth login
   
   # Configura il target di default
   gcloud config set project <NUOVO_PROJECT_ID>
   
   # Autenticazione per Terraform (Application Default Credentials)
   gcloud auth application-default login
   ```

---

## 2. Fast-Track: Redeploy Automatico in 1-Click

Il repository include uno script di orchestrazione completo che automatizza l'intero ciclo di vita dell'infrastruttura, del database, dei dati di training e del servizio web.

### Comando Esecuzione:
```bash
# Esegui lo script specificando il nuovo Project ID (regione consigliata: us-central1)
./v2/infra/terraform/deploy.sh <NUOVO_PROJECT_ID> us-central1
```

### Cosa esegue automaticamente lo script:
1. **Infrastruttura (Terraform)**:
   - Abilita le API necessarie (`run`, `firestore`, `cloudbuild`, `bigquery`, `artifactregistry`, `iam`).
   - Crea il database **Firestore Native** in modalità `nam5` per la gestione in tempo reale dello stato dell'aula, dei check-in e della leaderboard.
   - Crea il repository **Artifact Registry** (`training-hub`) in formato Docker.
   - Crea il dataset **BigQuery** `luxottica_marketing_analytics`.
   - Crea il **Service Account** runtime (`training-hub-backend-sa`) assegnando solo i privilegi minimi necessari (`roles/datastore.user`, `roles/bigquery.dataViewer`, `roles/bigquery.jobUser`).
   - Assegna al Service Account di Cloud Build i ruoli per compilare e rilasciare su Cloud Run.
2. **Data Seeding BigQuery**:
   - Esegue [`scripts/seed_bigquery.sh`](file:///Users/maurizio.ipsale/Library/CloudStorage/GoogleDrive-maurizio.ipsale@gmail.com/My%20Drive/Progetti%20Agy/MyQwiklabs/scripts/seed_bigquery.sh), popolando oltre **116.000 record realistici** nelle 4 tabelle di training:
     - `crm_customers` (Anagrafica clienti e loyalty)
     - `pos_transactions` (Scontrini omnichannel e retail)
     - `marketing_campaigns` (Campagne adv e conversioni)
     - `media_spend` (Spesa budget marketing per canale)
3. **Container Build & Deploy (Cloud Build + Cloud Run)**:
   - Invia il build a Cloud Build utilizzando [`v2/cloudbuild.yaml`](file:///Users/maurizio.ipsale/Library/CloudStorage/GoogleDrive-maurizio.ipsale@gmail.com/My%20Drive/Progetti%20Agy/MyQwiklabs/v2/cloudbuild.yaml).
   - Crea l'immagine Docker nel repository Artifact Registry del nuovo progetto.
   - Rilascia il servizio **Cloud Run** `luxottica-training-hub` con autoscaling (scale-to-zero) e porta 8080.
4. **Automazione CI/CD GitHub Actions (Opzionale)**:
   - Sincronizza i secrets su GitHub per abilitare il redeploy automatico ad ogni `git push`:
     ```bash
     KEY_TMP=$(mktemp)
     gcloud iam service-accounts keys create "$KEY_TMP" \
       --iam-account="github-actions-deployer@<NUOVO_PROJECT_ID>.iam.gserviceaccount.com"
     gh secret set GCP_SA_KEY < "$KEY_TMP"
     gh secret set GCP_PROJECT_ID --body "<NUOVO_PROJECT_ID>"
     rm -f "$KEY_TMP"
     ```
5. **URL Generati**:
   - Stampa a video l'URL pubblico per la classe e l'URL riservato alla console istruttore.

---

## 3. Procedura Dettagliata Passo-Passo

Se preferisci procedere manualmente o se si verificano anomalie nello script automatico, segui questa sequenza passo per passo:

### Step 3.1: Pulizia dello State Terraform Precedente
> [!IMPORTANT]
> Se il vecchio progetto Qwiklabs è stato cancellato o chiuso da Google, il file di stato Terraform locale (`terraform.tfstate`) farà riferimento a risorse inesistenti nel vecchio progetto. Elimina o archivia i vecchi file di stato:
```bash
rm -f v2/infra/terraform/terraform.tfstate*
```

### Step 3.2: Esecuzione di Terraform
```bash
cd v2/infra/terraform

# Inizializza i provider (Google Cloud)
terraform init -upgrade

# Applica l'infrastruttura sul nuovo progetto
terraform apply -auto-approve \
  -var="project_id=<NUOVO_PROJECT_ID>" \
  -var="region=us-central1"

cd ../../..
```

### Step 3.3: Popolamento Dataset BigQuery
```bash
# Seeding delle 4 tabelle nel nuovo progetto
./scripts/seed_bigquery.sh <NUOVO_PROJECT_ID> luxottica_marketing_analytics US
```

### Step 3.4: Compilazione e Rilascio Cloud Run
```bash
# Invio del build a Cloud Build
gcloud builds submit \
  --project="<NUOVO_PROJECT_ID>" \
  --config="v2/cloudbuild.yaml" \
  .
```

### Step 3.5: Abilitazione Accesso Pubblico per gli Studenti
Se il servizio richiede autenticazione o non risponde pubblicamente, concedi l'accesso `allUsers` al ruolo `run.invoker`:
```bash
gcloud run services add-iam-policy-binding luxottica-training-hub \
  --project="<NUOVO_PROJECT_ID>" \
  --region="us-central1" \
  --member="allUsers" \
  --role="roles/run.invoker"
```

---

## 4. Verifica Funzionale & Smoke Test

Dopo il rilascio, esegui i seguenti controlli di convalida:

1. **Recupera l'URL di Produzione**:
   ```bash
   gcloud run services describe luxottica-training-hub \
     --project="<NUOVO_PROJECT_ID>" \
     --region="us-central1" \
     --format="value(status.url)"
   ```

2. **Preflight Smoke Test BigQuery**:
   ```bash
   python3 scripts/preflight_smoke_test.py <NUOVO_PROJECT_ID>
   ```
   *Verifica che le query di prova restituiscano record validi e che la connessione verso BigQuery funzioni regolarmente.*

3. **Verifica Web & WebSocket**:
   - **Student Hub**: Apri `https://<URL_SERVIZIO>` nel browser. Inserisci nome e team per effettuare il check-in.
   - **Rosetta Stone Modal**: Verifica l'apertura del popup "Rosetta Stone" dal menu in alto a destra e prova il filtro live digitando "JOIN" o "VLOOKUP".
   - **Trainer Console**: Apri `https://<URL_SERVIZIO>?role=trainer`. Controlla che i badge studente appaiano in tempo reale nella lista partecipanti e che il tasto "Sblocca Tutti i Blocchi" consenta la navigazione libera.

---

## 5. Troubleshooting & Risoluzione Errori Comuni

| Errore / Sintomo | Causa Probabile | Soluzione Rapida |
| :--- | :--- | :--- |
| `Error: 403 Forbidden / API not enabled` | Una delle API GCP (Firestore, BigQuery, Artifact Registry) non è ancora pronta. | Esegui: `gcloud services enable run.googleapis.com firestore.googleapis.com cloudbuild.googleapis.com bigquery.googleapis.com artifactregistry.googleapis.com --project=<NUOVO_PROJECT_ID>` |
| `Resource 'projects/<OLD_PROJECT>' does not exist` durante `terraform plan/apply` | È presente il file `terraform.tfstate` del vecchio progetto scaduto. | Rimuovi il file di stato con `rm -f v2/infra/terraform/terraform.tfstate*` ed esegui nuovamente `terraform init`. |
| `Setting IAM policy failed: Cloud Run invoker` durante il build | Policy dell'organizzazione GCP che blocca l'assegnazione automatica di `allUsers`. | Esegui manualmente il binding con: `gcloud run services add-iam-policy-binding luxottica-training-hub --project=<NUOVO_PROJECT_ID> --region=us-central1 --member=allUsers --role=roles/run.invoker` |
| Errore nel build Docker / file troppo pesanti | `node_modules` o cartelle temporanee caricate nel contesto di Cloud Build. | Assicurati che il file [`.gcloudignore`](file:///Users/maurizio.ipsale/Library/CloudStorage/GoogleDrive-maurizio.ipsale@gmail.com/My%20Drive/Progetti%20Agy/MyQwiklabs/.gcloudignore) escluda `node_modules/`, `.git`, e cartelle virtualenv. |
| Firestore `Database (default) already exists` | Il database Firestore predefinito è già stato istanziato nel progetto. | Nel file `firestore.tf`, importa la risorsa o commenta la creazione di `google_firestore_database` se già creata dalla console. |

---

## 6. Regole di Governance & Ambiente

> [!CAUTION]
> **Divieti Assoluti:**
> - **MAI** utilizzare o fare riferimento al dominio dismesso `ipsa.datatonic.team` né a progetti legati al vecchio tenant Datatonic.
> - **MAI** pushare direttamente sul branch `main` del repository GitHub.
>
> **Standard Operativi:**
> - **Repository GitHub:** Tutto il codice fa riferimento all'account ufficiale `mauripsale`:
>   `https://github.com/mauripsale/luxottica-bigquery-training`
> - **Branching Strategy:** Tutti i fix, feature o aggiornamenti di documentazione devono essere gestiti su rami dedicati (es. `feature/v2-cloud-run-migration`) prima di essere sottoposti a PR o revisione.
> - **Modello AI predefinito per Labs:** `gemini-3.5-flash`.
