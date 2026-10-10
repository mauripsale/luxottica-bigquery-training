# 🕶️ Guida Docente Master per il Corso BigQuery Luxottica (Edizione Italiana)
## Manuale Integrale di Facilitazione e Copione/Gobbo Docente (180 Minuti)

**Titolo Corso:** BigQuery per l'Analisi Dati: Dominare i Dati Marketing con BigQuery SQL & BigQuery Studio  
**Filo Conduttore (Storytelling):** "Sbloccare la Crescita High-ROAS con Google Ads & Catturare la Domanda Ray-Ban Meta"  
**Nome Progetto GCP:** `bigquery-luxottica`  
**ID Progetto GCP:** `qwiklabs-gcp-04-9efaa47f1d21`  
**Owner Progetto:** `student-02-25b97e18011e@qwiklabs.net` (student b50b8eff)  
**Dataset Target:** `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics`  
**Pubblico Target:** Global Analytics, Business Analyst, Digital Commerce & Retail Operations  
**Data & Ora:** 12 Ottobre 2026 | 15:30 - 18:30 (3 Ore / 180 Minuti)  
**Formato:** Ibrido (In Presenza & Collegamento Remoto)

---

## 📋 1. Checklist Pre-Flight del Docente (Prima delle 15:30)

### 1.1 Verifiche Ambiente GCP e IAM
1. **Progetto GCP Target:** `qwiklabs-gcp-04-9efaa47f1d21` (`bigquery-luxottica`).
2. **Pre-caricamento Dataset:** Esegui lo script SQL `dataset/00_setup_schema_and_data.sql` **PRIMA** dell'inizio della sessione.
3. **Verifica Tabelle Create (116.000+ Righe Totali):**
   - `lux_crm_customers` (10.000 Righe)
   - `lux_online_orders` (100.000 Righe)
   - `lux_ad_spend` (5.000 Righe)
   - `lux_raw_marketing_leads_dirty` (1.000 Righe)
4. **Ruoli IAM Assegnati ai Partecipanti:**
   - `BigQuery Job User` (`roles/bigquery.jobUser`) sul progetto `qwiklabs-gcp-04-9efaa47f1d21`.
   - `BigQuery Data Viewer` (`roles/bigquery.dataViewer`) sul dataset `luxottica_marketing_analytics`.

### 1.2 Materiali e Condivisione
1. **Cartella Materiali Partecipanti (Drive / Intranet):**
   - [student_guide.md](file:///Users/maurizio.ipsale/Code/my-agy-projects/projectA/student_guide.md) (Guida Studente & Tabella Rosetta Stone Excel-SQL)
   - [00_data_storytelling_narrative.md](file:///Users/maurizio.ipsale/Code/my-agy-projects/projectA/handouts/00_data_storytelling_narrative.md) (Copione Analitico dei 7 Passi)
   - File SQL delle Challenge: `challenges/challenge_1_data_explorer.sql`, `challenges/challenge_2_cross_channel.sql`, `challenges/challenge_3_clean_slate.sql`.
2. **Istruzione di Pin del Progetto:** Mostra a schermo come cliccare su **"+ ADD" -> "Star a project by name"** e digitare `qwiklabs-gcp-04-9efaa47f1d21`.

---

## 🎬 2. La Narrativa Analitica "Google Hero" (I 7 Passi)

> **Il Briefing per il CMO (Ore 15:30):**  
> *"La spesa pubblicitaria digitale globale di Luxottica è aumentata del +35% (a causa di forti investimenti sperimentali su reticoli social terzi e display frammentate), ma la crescita del fatturato e-commerce è rimasta ferma al +2%. Il CMO esige un Piano di Crescita Q4! Le vostre squadre di Data Detective hanno 3 ore in BigQuery Studio per identificare la dispersione di budget sui canali terzi, dimostrare le prestazioni straordinarie di Google Ads (Search, Shopping, YouTube) e presentare il Piano di Crescita!"*

```mermaid
flowchart TD
    P1["<b>Passo 1: Il Problema del CMO</b><br/>Spesa Adv +35% (su canali social terzi), Fatturato +2%. Dove finiscono i soldi?"] --> P2["<b>Passo 2: Esplorazione Fatturato</b><br/>Quali brand vendono e quali hanno scontrino alto (Ray-Ban Meta Smart Glasses & Oliver Peoples > €300)?"]
    P2 --> P3["<b>Passo 3: Analisi Promozioni</b><br/>Dove si verificano le fughe di margine sui canali e-commerce?"]
    P3 --> P4["<b>Passo 4: Calcolo ROAS Cross-Canale</b><br/>Social Terzi TikTok/Criteo (0.7x ROAS 📉) vs <b>Google Search & Shopping (6.8x ROAS 🚀)</b>"]
    P4 --> P5["<b>Passo 5: Analisi CRM & Search Intent</b><br/>Gli utenti cercano Ray-Ban Meta Smart Glasses su Google, ma il budget adv era bloccato altrove!"]
    P5 --> P6["<b>Passo 6: Data Wrangling Lead</b><br/>Pulizia lead sporchi: sbloccati 350+ lead VIP per <b>Google Ads Customer Match</b>"]
    P6 --> P7["<b>Passo 7: Piano di Crescita Q4 con Google</b><br/>Riallocazione budget verso Google Ads & Dashboard Looker Studio per il CMO"]
```

---

## 🏆 3. Gamification e Competizione a Squadre

- **4 Brand Detective Teams:**
  - 🕶️ **Team Ray-Ban** (Smart Glasses & Categorie Iconiche)
  - 🕶️ **Team Oakley** (Tecnologia Prizm Sport)
  - 🕶️ **Team Persol** (Artigianalità Italiana)
  - 🕶️ **Team Oliver Peoples** (Segmento Lusso)
- **Sistema di Punteggio:**
  - Prima squadra a inviare la query SQL corretta: **+100 Punti**
  - Migliore interpretazione di business dell'insight: **+50 Punti**
  - Dashboard Looker Studio più efficace: **+100 Punti**

---

## ⏱️ 4. Cronoprogramma e COPIONE/GOBBO DOCENTE (180 Minuti)

### 🎓 Console di Controllo Docente & Sblocco Progressivo degli Hint
Per governare il ritmo della classe ed evitare spoiler nella **Student Hub UI**, il docente dispone della **Trainer Command Console** a comparsa sulla sinistra (attivabile cliccando 5 volte sul logo Luxottica in alto a sinistra e inserendo il Master PIN `1926`):
- **Blocco/Sblocco Globale Studenti:** Mantiene tutti i partecipanti allineati sullo stesso blocco di lavoro.
- **Gestione Hint e PIN Riservati (ESCLUSIVI per il Docente):**
  - **Blocco 1 Passo 1.1:** PIN `1122` (Suggerimento prompt Data Canvas)
  - **Blocco 1 Passo 1.2:** PIN `1234` (Suggerimento query 3 totali SQL Studio)
  - **Blocco 2 Passo 2.1:** PIN `2144` (Prompt ordini AOV > 300 €)
  - **Blocco 2 Passo 2.2:** PIN `2255` (Prompt sconti medi per canale)
  - **Blocco 3:** PIN `3388` (Query Soluzione Completa CTE per ROAS Cross-Canale)
  - **Blocco 4:** PIN `4499` (Prompt creazione vista normalizzazione Lead VIP)
  - *(In alternativa, clicca **`[✨ Sblocca Tutti]`** dalla sidebar per rendere visibili gli hint all'aula senza condividere i PIN).*

---

### 🕒 15:30 - 16:00 | Blocco 1: Executive Briefing & DEMO LIVE DATA CANVAS (30 Mins)

- **15:30 - 15:40 (10m) | Briefing d'Emergenza & Icebreaker**
  - Presenta il dilemma del CMO: Spesa Adv +35%, Fatturato +2%.
  - Sondaggio Icebreaker: *"Su quale canale sospetti che si stia sprecando il budget pubblicitario?"*
  - **Navigazione Explorer BigQuery:** Ricorda agli studenti di espandere il progetto `qwiklabs-gcp-04-9efaa47f1d21` e poi il dataset `luxottica_marketing_analytics` per trovare le 4 tabelle.

- **15:40 - 15:52 (12m) | 🎙️ COPIONE DEMO LIVE: BigQuery Data Canvas, Data Insights & Gemini**

> **[Azione Docente]:** Condividi lo schermo sulla console di BigQuery Studio nel progetto `qwiklabs-gcp-04-9efaa47f1d21`.
>
> **[Parla il Docente]:**  
> *"Benvenuti in BigQuery Studio! Prima di scrivere anche solo una riga di codice SQL, voglio mostrarvi come l'Intelligenza Artificiale Gemini ci permette di esplorare i dati di Luxottica usando il linguaggio naturale. Apriamo il **BigQuery Data Canvas** cliccando sul tasto `+` in alto."*
>
> **[Azione Docente]:** Apri il Data Canvas e digita il prompt nella barra al centro:  
> `Mostrami le vendite totali e lo scontrino medio per brand nel dataset luxottica_marketing_analytics` e premi Invio.
>
> **[Parla il Docente]:**  
> *"Guardate cosa succede: Gemini crea un **Nodo SQL** in automatico, scrive la query di raggruppamento per brand ed esegue il calcolo. Ora clicchiamo sul pulsante **Visualize** per generare il grafico a barre."*
>
> **[Azione Docente]:** Clicca su **Visualize**. Nelle opzioni del grafico ordina per *total_sales DESC*. Poi clicca su **Generate Insights** (o *Add Insights Node*).
>
> **[Parla il Docente - Commentando il Grafico e gli Insights generati]:**  
> *"Osserviamo insieme il grafico e i 4 punti chiave generati dall'AI di BigQuery:*
> 1. **Mappa Colore Scontrino Medio (AOV):** *Guardate la barra in alto in giallo acceso (**Oliver Peoples**) e quella in basso in viola scuro (**Vogue Eyewear**). Il colore mappa lo scontrino medio: il giallo indica un AOV di quasi 400 €/ordine, il viola soltanto 129 €/ordine.*
> 2. **Top Revenue Leader (Oliver Peoples - 3.96M €):** *I prodotti di lusso ad alto valore trascinano i margini di Luxottica.*
> 3. **Lagging Brands (Vogue Eyewear - 1.29M €):** *Sulle linee fashion a basso scontrino stiamo concedendo troppi sconti.*
> 4. **Il Mistero di Ray-Ban (1.8M €):** *Ray-Ban registra 1.8M € di vendite, ma è sotto le sue potenzialità online. Perché il brand leader non sta dominando?*"

- **15:52 - 16:00 (8m) | Prima Query Guidata (Verifica Spesa vs Fatturato Generale)**
  - Se una squadra fatica sui passi 1.1 o 1.2, puoi sbloccare da sidebar oppure fornire il rispettivo PIN `1122` / `1234`.

---

### 🕒 16:00 - 16:45 | Blocco 2: Capitolo 1 - "Scoperta dei Prodotti ad Alto Margine" (45 Mins)

- **16:00 - 16:15 (15m) | 🎙️ COPIONE: Fondamenti SQL (`SELECT`, `WHERE`, `GROUP BY`)**
  - **Metafora Rosetta Stone:** `GROUP BY` = Tabella Pivot di Excel!
  - `SELECT` = "Scegliere le colonne del report" | `WHERE` = "Filtri di colonna" | `SUM()` = "Campi valore".
  - **Alert Didattico Precedenza Filtri:** Spiega che `AND` ha la precedenza su `OR`. Suggerisci l'uso di `IN ('E-Commerce Direct', 'App')` per evitare selezioni spurie.
  - **Divisione Protetta:** Mostra `SAFE_DIVIDE(num, den)` come corrispettivo di `SE.ERRORE(A/B; 0)` per gestire sconti o spese pari a zero.
- **16:15 - 16:40 (25m) | 🏆 Challenge #1: "The Data Explorer" (8 Indizi)**
  - Le squadre eseguono `challenges/challenge_1_data_explorer.sql`.
  - **Colpo di Scena #1 Dati:** *Ray-Ban Meta Smart Glasses* e *Oliver Peoples* registrano uno scontrino medio altissimo (> 300 €), rappresentando la massima opportunità di crescita per Luxottica!
  - *Supporto Hint:* PIN Step 2.1 = `2144`, PIN Step 2.2 = `2255`.
- **16:40 - 16:45 (5m) | Debrief Capitolo 1 e Aggiornamento Classifica**

---

### ☕ 16:45 - 17:00 | Coffee Break (15 Mins)

---

### 🕒 17:00 - 17:45 | Blocco 3: Capitolo 2 - "La Rivelazione del ROAS Google Ads" (45 Mins)

- **17:00 - 17:20 (20m) | 🎙️ COPIONE: SQL Avanzato (UNIONS, JOINS & CTE `WITH`)**
  - Spiega il `JOIN` come un **VLOOKUP (CERCA.VERT)** istantaneo su milioni di righe.
  - **🚨 Alert Cruciale per il Docente: La Trappola del Fan-Out!**
    - Chiarisci perché unire direttamente `lux_ad_spend` e `lux_online_orders` su `brand` moltiplica il fatturato di centinaia di volte (diversa granularità: righe d'ordine vs investimenti giornalieri).
    - Spiega le CTE (`WITH ... AS`) come la creazione di due distinti fogli Pivot di riepilogo in Excel prima di fare il CERCA.VERT tra di loro.
- **17:20 - 17:40 (20m) | 🏆 Challenge #2: "Intelligence Cross-Canale" (4 Indizi)**
  - Le squadre eseguono `challenges/challenge_2_cross_channel.sql`.
  - **Colpo di Scena #2 Dati:** I social terzi (TikTok / Criteo) hanno un ROAS fallimentare di **0.7x**, mentre **Google Search e Google Shopping** generano un **ROAS stellare compreso tra 6.8x e 8.2x**!
  - *Supporto Hint:* PIN Soluzione Blocco 3 = `3388` (oppure sblocco diretto da sidebar).
- **17:40 - 17:45 (5m) | Debrief Capitolo 2 e Aggiornamento Classifica**

---

### 🕒 17:45 - 18:15 | Blocco 4: Capitolo 3 - "Google Ads Customer Match" (30 Mins)

- **17:45 - 17:55 (10m) | DEMO: BigQuery Studio Visual Data Prep**
  - Mostra le schede di suggerimento Gemini e l'editing cellulare few-shot per la pulizia dati senza codice.
  - **Consiglio Data Cleaning:** Ricorda di pulire le stringhe valutarie con `REPLACE(REPLACE(spend_history, '€', ''), ' ', '')` e racchiuderle in `SAFE_CAST(... AS NUMERIC)` per evitare errori di conversione.
- **17:55 - 18:10 (15m) | 🏆 Challenge #3: "The Clean Slate" (Vista Automatica e Looker Studio)**
  - Le squadre eseguono `challenges/challenge_3_clean_slate.sql` e creano la Vista `v_clean_marketing_leads`.
  - **Colpo di Scena #3 Dati:** La pulizia sblocca **350+ lead VIP** pronti per **Google Ads Customer Match**!
  - **Demo Looker Studio 1-Click:** Connetti la Vista a Looker Studio per mostrare il **Dashboard di Crescita Q4** al CMO!
  - *Supporto Hint:* PIN Blocco 4 = `4499`.
- **18:10 - 18:15 (5m) | Debrief Capitolo 3**

---

### 🕒 18:15 - 18:30 | Blocco 5: Il Piano di Crescita Q4 con Google e Premiazione (15 Mins)

- **18:15 - 18:25 (10m) | 🎙️ COPIONE: Sintesi Strategica & Sicurezza Dati**
  - Riassunto del Piano di Crescita: Spostare il 60% del budget dai canali terzi verso **Google Search, Google Shopping, YouTube Ads e Performance Max**.
  - Sicurezza Dati: Row/Column-level security e mascheramento dei PII (email/telefoni).
- **18:25 - 18:30 (5m) | Premiazione del Brand Detective Team Vincitore!**
