# 🕶️ Guida Studente Passo-Passo per il Corso BigQuery Luxottica (Edizione Italiana)
## Manuale Esecutivo Partecipante & Workbook Guidato dall'Istruttore (3 Ore)

**Corso:** BigQuery per l'Analisi Dati: Dominare i Dati Marketing con BigQuery SQL & BigQuery Studio  
**Motto di Sessione:** "Sbloccare la Crescita High-ROAS con Google Ads & Catturare la Domanda Ray-Ban Meta"  
**Nome Progetto GCP:** `bigquery-luxottica`  
**ID Progetto GCP:** `qwiklabs-gcp-04-9efaa47f1d21`  
**Dataset Target:** `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics`  
**Data & Ora:** 12 Ottobre 2026 | 15:30 - 18:30 (3 Ore / 180 Minuti)

---

## 👥 1. Come Organizziamo l'Aula di 50 Partecipanti

Per garantire un'esperienza fluida e divertente per tutti i 50 partecipanti (in presenza e da remoto):

1. **4 Brand Detective Teams:**
   - 🕶️ **Team Ray-Ban** (Smart Glasses & Categorie Iconiche)
   - 🕶️ **Team Oakley** (Tecnologia Prizm Sport & Performance)
   - 🕶️ **Team Persol** (Artigianalità Italiana & Heritage)
   - 🕶️ **Team Oliver Peoples** (Segmento Lusso)
2. **Sistema di "Tavolo Buddy":**
   - Lavora affiancato al tuo vicino di tavolo. Se ti perdi un passaggio o un tasto, il tuo compagno di banco ti aiuterà al volo!
3. **Punteggi Challenge:**
   - La prima squadra che invia il risultato corretto in chat o lo legge a voce alta guadagna **+100 Punti** per la classifica finale!

---

## 🚀 2. Connessione Rapida all'Ambiente BigQuery Studio (Ore 15:30 - 15:40)

### Passo 1: Apri la Console Google Cloud
1. Apri il browser Chrome e vai su:  
   👉 [console.cloud.google.com/bigquery?project=qwiklabs-gcp-04-9efaa47f1d21](https://console.cloud.google.com/bigquery?project=qwiklabs-gcp-04-9efaa47f1d21)
2. Effettua il login con le credenziali fornite (`student-02-...@qwiklabs.net` o Email Aziendale Luxottica).

### Passo 2: Fissa il Progetto nel Pannello di Sinistra (Explorer)
1. Nel pannello di sinistra (**Explorer**), clicca in alto su **`+ ADD`**.
2. Seleziona **"Star a project by name"** (o *Pin a project*).
3. Digita esattamente l'ID Progetto: **`qwiklabs-gcp-04-9efaa47f1d21`** e clicca su **Star**.
4. Vedrai comparire il dataset **`luxottica_marketing_analytics`** nel tuo menu a sinistra!

---

## 📊 3. Tabella Rosetta Stone: Da Excel a BigQuery SQL

| Azione in Excel | Equivalente in BigQuery SQL | Esempio Pratico |
| :--- | :--- | :--- |
| **Scegliere le Colonne** | `SELECT colonna1, colonna2` | `SELECT brand, revenue_eur` |
| **Filtrare le Righe** | `WHERE condizione` | `WHERE brand = 'Ray-Ban'` |
| **Tabella Pivot** | `GROUP BY colonna` | `GROUP BY brand` |
| **Somma / Media / Conteggio** | `SUM()`, `AVG()`, `COUNT()` | `SUM(revenue_eur)` |
| **CERCA.VERT / VLOOKUP** | `JOIN tabella ON chiave` | `JOIN lux_online_orders ON ...` |

---

## ⏱️ GUIDA PASSO-PASSO GUIDATA DALL'ISTRUTTORE (15:30 - 18:30)

---

### 🕒 BLOCCO 1: Briefing & Esplorazione con Gemini (15:30 - 16:00)

#### 📍 Esercizio 1.1: Esplorazione Visiva nel Data Canvas (15:40)
1. Clicca sul pulsante celeste **`+`** in alto su BigQuery Studio e seleziona **Data Canvas**.
2. Nella barra di ricerca scrivi questo prompt in italiano:  
   💬 `Mostrami le vendite totali e lo scontrino medio per brand nel dataset luxottica_marketing_analytics`
3. Clicca **RUN**, poi clicca su **Visualize** per generare il grafico a barre.
4. Clicca su **Add Insights Node** per leggere l'analisi dell'AI su Oliver Peoples (AOV 420 €) e Ray-Ban (Fatturato 9.49M €).

#### 📍 Esercizio 1.2: La Prima Query Guidata con Gemini SQL Generator (15:52)
1. Clicca su **`+` -> `SQL query`** in alto a sinistra per aprire una nuova scheda dell'editor SQL.
2. Premi **`Ctrl + Shift + P`** per aprire Gemini SQL Generator (o clicca su **Generate SQL**).
3. Incolla questo prompt:  
   💬 `Calcola il totale ordini, il fatturato totale in euro e la spesa adv totale dal dataset luxottica_marketing_analytics`
4. Clicca su **Generate** e poi sul tasto celeste **RUN** (`Ctrl + Enter`).
5. **Risultato Atteso:** Fatturato Totale = **23,62 Milioni €** | Spesa Adv = **6.830 €**.

---

### 🕒 BLOCCO 2: Capitolo 1 - Margini & Sconti (16:00 - 16:45)

#### 🏆 CHALLENGE #1: Scoperta Sconti E-Commerce (16:15 - 16:40)
1. Apri il file `challenges/challenge_1_data_explorer.sql` oppure apri una scheda `SQL query`.
2. Premi **`Ctrl + Shift + P`** e chiedi a Gemini:  
   💬 `Calcola lo sconto medio in euro (discount_amount_eur) per brand e canale di vendita dalla tabella lux_online_orders, ordinando per sconto medio decrescente.`
3. Clicca **RUN**.

**Risultati Emersi (Condividi con il tuo team!):**
- 🚨 **Vogue Eyewear su Wholesale Partner:** **28,50 €** sconto medio per ordine!
- 🚨 **Ray-Ban su E-Commerce Direct:** **25,00 €** sconto medio per ordine!
- 💎 **Persol & Oliver Peoples:** **0,00 €** sconto (massima tenuta di prezzo).

---

### ☕ 16:45 - 17:00 | COFFEE BREAK & PAUSA NETWORKING (15 Mins)

---

### 🕒 BLOCCO 3: Capitolo 2 - ROAS Google Ads con CTE & JOIN (17:00 - 17:45)

#### 🏆 CHALLENGE #2: Rivelazione del ROAS Cross-Canale (17:20 - 17:40)
1. Apri una nuova scheda `SQL query` e premi **`Ctrl + Shift + P`**.
2. **Il Trucco dell'Analista:** Per unire la spesa di `lux_ad_spend` e il fatturato di `lux_online_orders` senza errori di conteggio, usiamo una CTE e una `JOIN` (il VLOOKUP di SQL!).
3. Incolla questo codice SQL nel tuo editor:

```sql
WITH revenue_by_brand AS (
  SELECT 
    brand, 
    SUM(revenue_eur) AS total_revenue_eur
  FROM `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.lux_online_orders`
  GROUP BY brand
),
spend_by_platform AS (
  SELECT 
    platform,
    brand,
    SUM(spend_eur) AS total_spend_eur
  FROM `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.lux_ad_spend`
  GROUP BY platform, brand
)
SELECT 
  s.platform,
  ROUND(SUM(s.total_spend_eur), 2) AS total_spend_eur,
  ROUND(SUM(r.total_revenue_eur), 2) AS total_revenue_eur,
  ROUND(SAFE_DIVIDE(SUM(r.total_revenue_eur), SUM(s.total_spend_eur)), 2) AS roas
FROM spend_by_platform s
JOIN revenue_by_brand r ON s.brand = r.brand
GROUP BY s.platform
ORDER BY roas DESC;
```

4. Clicca **RUN**.

**Verdetto del ROAS:**
- 🚀 **Google Ads (Search & Shopping):** ROAS **7,08x** (Campione di Incassi!)
- 📸 **Meta Ads (Instagram):** ROAS **3,80x**
- ⚠️ **Criteo Social:** ROAS **1,12x**
- 💸 **TikTok Ads:** ROAS **0,52x ❌** (Voragine di budget: stiamo perdendo il 58% della spesa!).

---

### 🕒 BLOCCO 4: Capitolo 3 - Lead VIP & Google Customer Match (17:45 - 18:15)

#### 🏆 CHALLENGE #3: Creazione della Vista Pulita (17:55 - 18:10)
1. Apri una nuova scheda `SQL query` e premi **`Ctrl + Shift + P`**.
2. ⚠️ **REGOLA SUFFISSO TEAM:** Aggiungi il nome del tuo team al nome della vista (es. `v_clean_marketing_leads_team_rayban`).
3. Incolla ed esegui questo codice per ripulire le email sporche e filtrare i lead VIP (> 200 €):

```sql
CREATE OR REPLACE VIEW `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.v_clean_marketing_leads_team_rayban` AS
SELECT
  id,
  raw_lead_id AS lead_id,
  LOWER(TRIM(raw_email)) AS clean_email,
  REGEXP_REPLACE(raw_brand, r'[^a-zA-Z0-9 ]', '') AS clean_brand,
  SAFE_CAST(REGEXP_EXTRACT(raw_estimated_spend, r'([0-9]+)') AS FLOAT64) AS clean_estimated_spend_eur,
  raw_country AS country
FROM `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.lux_raw_marketing_leads_dirty`
WHERE SAFE_CAST(REGEXP_EXTRACT(raw_estimated_spend, r'([0-9]+)') AS FLOAT64) > 200;
```

4. Visualizza il contenuto della vista pulita:
```sql
SELECT * FROM `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.v_clean_marketing_leads_team_rayban` LIMIT 10;
```
5. **Risultato:** Sbloccati **350+ Lead VIP** pronti per **Google Ads Customer Match**!

---

### 🕒 BLOCCO 5: Piano Strategico Q4 & Premiazione (18:15 - 18:30)

#### 📋 Il Piano Strategico Q4 da consegnare al CMO:
1. **Riallocare il Budget:** Spostare il 60% del budget da **TikTok Ads** (0,52x ROAS) verso **Google Search, Shopping e YouTube Ads** (7,08x ROAS).
2. **Proteggere i Margini:** Rimuovere gli sconti automatici di 25 € su Ray-Ban.com.
3. **Attivare i Lead VIP:** Usare la vista pulita in **Google Ads Customer Match** per il lancio dei nuovi Ray-Ban Meta Smart Glasses!
