# 🕶️ Guida Partecipante BigQuery Luxottica (Edizione Italiana)
## Missione: "Sbloccare la Crescita High-ROAS con Google Ads & Catturare la Domanda Ray-Ban Meta"

**Corso:** BigQuery per l'Analisi Dati: Dominare i Dati Marketing con BigQuery SQL  
**Nome Progetto GCP:** `bigquery-luxottica`  
**ID Progetto GCP:** `qwiklabs-gcp-04-9efaa47f1d21`  
**Dataset Target:** `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics`  
**Destinatari:** Global Analytics, Business Analyst, Digital Commerce & Retail Operations  
**Data & Durata:** 12 Ottobre 2026 | 15:30 - 18:30 (3 Ore / 180 Minuti)

---

## 🕵️‍♀️ 1. Il Briefing della Tua Missione
> **Il Problema:** La spesa pubblicitaria digitale globale è salita del +35% (trainata da campagne sperimentali su canali terzi), ma la crescita del fatturato e-commerce è rimasta ferma al +2%.  
> **Il Tuo Ruolo:** Marketing Data Detective per Luxottica.  
> **Il Tuo Obiettivo:** Indagare in BigQuery Studio, identificare le dispersioni di budget, dimostrare il rendimento eccezionale (ROAS) di Google Ads (Search, Shopping, YouTube), recuperare i lead VIP per Google Ads Customer Match e presentare il Piano di Crescita Q4 al CMO!

---

## 🚀 2. Guida Rapida: Connessione all'Ambiente BigQuery

### Passo 1: Apri BigQuery Studio
1. Apri il browser e vai su: [https://console.cloud.google.com/bigquery?project=qwiklabs-gcp-04-9efaa47f1d21](https://console.cloud.google.com/bigquery?project=qwiklabs-gcp-04-9efaa47f1d21)
2. Effettua l'accesso con l'account assegnato (`student-02-25b97e18011e@qwiklabs.net` o la tua email aziendale Luxottica).

### Passo 2: Fissa il Progetto (Pin) ed Esplora la Gerarchia
1. Nel riquadro sinistro (**Explorer**), clicca sul pulsante **`+ ADD`** in alto.
2. Seleziona **"Star a project by name"** (o *Fissa un progetto con nome*).
3. Digita l'ID del progetto: **`qwiklabs-gcp-04-9efaa47f1d21`** (o cerca **`bigquery-luxottica`**) e clicca su **Star**.
4. **Regola della Gerarchia in BigQuery:** In BigQuery le tabelle sono raggruppate dentro i *Dataset*. Clicca sulla freccetta accanto al progetto fissato ed espandi il dataset **`luxottica_marketing_analytics`** per visualizzare le 4 tabelle di lavoro:
   - `lux_crm_customers` (Anagrafica clienti e livelli fedeltà)
   - `lux_online_orders` (100.000 transazioni e-commerce e retail)
   - `lux_ad_spend` (Investimenti pubblicitari giornalieri per canale)
   - `lux_raw_marketing_leads_dirty` (Lead grezzi e non normalizzati)

---

## 🎨 3. BigQuery Data Insights, Data Canvas & Visual Data Prep

### 3.1 BigQuery Data Insights
- **Grafo delle Relazioni Interattivo:** Mappa visuale che mostra i collegamenti tra tabelle (`lux_crm_customers`, `lux_online_orders`, `lux_ad_spend`).
- **Descrizioni Generate dall'AI:** Documentazione automatica che spiega dataset, tabelle e colonne in linguaggio naturale.
- **Query SQL di Partenza:** Query iniziali generate con 1 click per avviare le analisi statistiche.

### 3.2 BigQuery Data Canvas & Nodo Insights
- **Nodo di Ricerca:** Cerca nei dataset con prompt in linguaggio naturale a Gemini.
- **Nodo Tabella:** Ispeziona schemi ed istogrammi di distribuzione delle colonne.
- **Nodo SQL:** Visualizza il codice SQL generato da Gemini o scrivi query personalizzate.
- **Nodo Visualizzazione:** Trasforma i risultati della query in grafici a barre o a linee con 1 click.
- **💡 Nodo Insights:** Genera sintesi esecutive, rileva anomalie statistiche e calcola correlazioni tra metriche!

---

## 🏆 4. I 3 Capitoli di Indagine (Challenge)

### Capitolo 1: "High Margin Discovery & Analisi Sconti"
**File:** `challenges/challenge_1_data_explorer.sql`
- **Obiettivo:** Valutare le vendite per brand, i prodotti ad alto scontrino (AOV) e le fughe di margine causate da sconti eccessivi.
- **Indizio Chiave:** 
  1. I *Ray-Ban Meta Smart Glasses* e *Oliver Peoples* guidano lo scontrino medio più elevato (> 300 €/ordine) su E-Commerce Diretto.
  2. *Vogue Eyewear* e i partner wholesale registrano sconti medi fino a 28,50 €, erodendo la marginalità.
- **Suggerimento sui Filtri:** Quando combini condizioni logiche, ricorda che `AND` ha priorità su `OR`. Usa le parentesi `AND (channel = 'E-Commerce Direct' OR channel = 'App')` oppure la sintassi più leggibile `WHERE channel IN ('E-Commerce Direct', 'App')`.

---

### Capitolo 2: "La Rivelazione del ROAS Google Ads"
**File:** `challenges/challenge_2_cross_channel.sql`
- **Obiettivo:** Calcolare il Customer Lifetime Value (LTV) e il ROAS Multi-Piattaforma per brand.
- **Indizio Chiave:** Scopri perché i canali social terzi (TikTok / Criteo) registrano un ROAS fallimentare di 0.7x mentre **Google Search & Shopping** raggiungono uno straordinario **6.8x - 8.2x ROAS**!
- **⚠️ La Trappola del Fan-Out (Perché il JOIN Diretto Sbaglia):**
  - La spesa pubblicitaria (`lux_ad_spend`) è registrata a livello di campagna/canale, mentre gli ordini (`lux_online_orders`) sono a livello di singolo acquisto cliente.
  - Unire direttamente le due tabelle su `brand` genera un prodotto cartesiano che moltiplica il fatturato di centinaia di volte!
  - **Soluzione:** Usa le **CTE (`WITH ... AS`)** per pre-aggregare separatamente la spesa e il fatturato in due tabelle riepilogative *prima* di effettuare il JOIN su `brand` (esattamente come confrontare due distinte tabelle Pivot in Excel).

---

### Capitolo 3: "Google Ads Customer Match"
**File:** `challenges/challenge_3_clean_slate.sql`
- **Obiettivo:** Trasformare `lux_raw_marketing_leads_dirty` nella vista sicura `v_clean_marketing_leads`.
- **Indizio Chiave:** Recupera oltre 350 lead VIP pronti per l'attivazione in **Google Ads Customer Match** e prepara la dashboard per il CMO!
- **Ricette di Pulizia Dati:**
  - Normalizzazione email: `LOWER(TRIM(email))` rimuove spazi superflui e uniforma le maiuscole/minuscole.
  - Conversione importi monetari: Rimuovi i simboli valuta con `REPLACE(REPLACE(spend_history, '€', ''), ' ', '')` e converti con `SAFE_CAST(... AS NUMERIC)` per evitare errori di esecuzione.

---

## 📊 5. Tabella Rosetta Stone: Da Excel a BigQuery SQL

| Azione in Excel | Equivalente in BigQuery SQL | Esempio di Codice |
| :--- | :--- | :--- |
| **Selezionare Colonne** | `SELECT colonna1, colonna2` | `SELECT brand, revenue_eur` |
| **Filtrare Righe** | `WHERE condizione` | `WHERE brand = 'Ray-Ban'` |
| **Filtro su Opzioni Multiple** | `WHERE colonna IN ('A', 'B')` | `WHERE channel IN ('E-Commerce Direct', 'App')` |
| **Creare Tabella Pivot** | `GROUP BY colonna` | `GROUP BY brand` |
| **Sommare Valori** | `SUM(colonna)` | `SUM(revenue_eur)` |
| **Conteggio Righe** | `COUNT(colonna)` o `COUNT(DISTINCT id)` | `COUNT(DISTINCT customer_id)` |
| **Divisione Sicura / SE.ERRORE(A/B; 0)** | `SAFE_DIVIDE(numeratore, denominatore)` | `SAFE_DIVIDE(SUM(revenue), SUM(spend))` |
| **CERCA.VERT / VLOOKUP** | `LEFT JOIN tabella ON chiave` | `LEFT JOIN lux_crm_customers ON ...` |
| **Tabelle Modulari (Fogli Separati)** | `WITH nome_cte AS (...)` | Subquery pre-aggregate prima del JOIN |
| **Pulizia Testo / ANNULLA.SPAZI** | `TRIM(colonna)` / `LOWER(colonna)` | `LOWER(TRIM(email))` |
| **Conversione Formato / VALORE** | `SAFE_CAST(colonna AS NUMERIC)` | `SAFE_CAST(stringa_pulita AS NUMERIC)` |
| **Rimozione Duplicati** | `QUALIFY ROW_NUMBER() OVER(...) = 1` | Mantiene solo il record più recente |
