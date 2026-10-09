# 🕶️ Guida Docente Master per il Corso BigQuery Luxottica (Edizione Italiana)
## Copione/Gobbo Docente Integrale Parola per Parola (180 Minuti)

**Titolo Corso:** BigQuery per l'Analisi Dati: Dominare i Dati Marketing con BigQuery SQL & BigQuery Studio  
**Filo Conduttore (Storytelling):** "Sbloccare la Crescita High-ROAS con Google Ads & Catturare la Domanda Ray-Ban Meta"  
**Nome Progetto GCP:** `bigquery-luxottica`  
**ID Progetto GCP:** `qwiklabs-gcp-04-9efaa47f1d21`  
**Owner Progetto:** `student-02-25b97e18011e@qwiklabs.net`  
**Dataset Target:** `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics`  
**Pubblico Target:** Global Analytics, Business Analyst, Digital Commerce & Retail Operations  
**Data & Ora:** 12 Ottobre 2026 | 15:30 - 18:30 (3 Ore / 180 Minuti)  
**Formato:** Ibrido (In Presenza & Collegamento Remoto)

---

## 📋 1. Checklist Pre-Flight del Docente (Prima delle 15:30)

### 1.1 Verifiche Ambiente GCP e IAM
1. **Progetto GCP Target:** `qwiklabs-gcp-04-9efaa47f1d21` (`bigquery-luxottica`).
2. **Pre-caricamento Dataset:** Esegui lo script SQL `scripts/seed_realistic_dataset.sql` **PRIMA** dell'inizio della sessione.
3. **Verifica Tabelle Create (116.000+ Righe Totali):**
   - `lux_crm_customers` (10.000 Righe)
   - `lux_online_orders` (107.000 Righe - Ray-Ban 42.5k, Oakley 28k, Vogue 18k, Persol 12k, Oliver Peoples 6.5k)
   - `lux_ad_spend` (7 Campagne pubblicitarie multi-canale)
   - `lux_raw_marketing_leads_dirty` (1.000 Lead grezzi da ripulire)
4. **Ruoli IAM Assegnati ai Partecipanti:**
   - `BigQuery Job User` (`roles/bigquery.jobUser`)
   - `BigQuery Data Viewer` (`roles/bigquery.dataViewer`)

### 1.2 Playbook Gestione Grande Aula (50 Partecipanti & Ibrido)
1. **Divisione in 4 Brand Teams (12-13 Persone per Tavolo):**
   - Assegna ogni tavolo/fila di 12 persone a una delle 4 squadre (**Team Ray-Ban**, **Team Oakley**, **Team Persol**, **Team Oliver Peoples**).
   - Nomina 1 **Caposquadra / Team Captain** per tavolo (il partecipante più orientato ai dati o un co-facilitatore/T.A.) che fa da punto di riferimento per sbloccare i colleghi di tavolo.
2. **Sistema "Tavolo Buddy" (Coppie di Banco):**
   - Gli studenti lavorano a coppie. Se un partecipante sbaglia a digitare la scorciatoia o perde un passaggio, il vicino di banco lo riallinea immediatamente senza interrompere la spiegazione generale.
3. **Materiali Distribuiti su Ogni Banco (Kit dello Studente):**
   - **Foglio Cheat Sheet / Placemat 1 Pagina (`handouts/00_student_placemat_cheat_sheet.md`):** Stampato e posizionato su ogni banco con ID Progetto, scorciatoia `Ctrl + Shift + P`, tabella Rosetta Stone e query di emergenza.
   - **Guida Studente Passo-Passo (`student_guide_it.md`):** File digitale consultabile durante la sessione.

---

## ⏱️ CRONOPROGRAMMA UFFICIALE & COPIONE INTEGRALE (180 MINUTI)

---

### 🕒 15:30 - 16:00 | BLOCCO 1: Briefing Esecutivo & Demo Live Data Canvas (30 Mins)

#### 15:30 - 15:40 (10m) | Briefing d'Emergenza CMO & Sondaggio Icebreaker
> **[Azione Docente]:** Proietta la prima diapositiva della presentazione Google Cloud (`slides/luxottica_bigquery_presentation.html`). Guarda l'aula con entusiasmo e tono solenne.
>
> **[Parla il Docente - Word-for-Word]:**  
> *"Buon pomeriggio a tutti e benvenuti al BigQuery Data Masterclass di Luxottica! Sono felicissimo di avervi qui.*
> 
> *Entriamo subito nel vivo della nostra missione di oggi. Immaginate di essere nell'ufficio del nostro Chief Marketing Officer. Il CMO ha appena convocato una riunione straordinaria con questa premessa scioccante:*  
> **'Nell'ultimo trimestre la nostra spesa pubblicitaria digitale globale è aumentata del +35%, ma il fatturato e-commerce totale è cresciuto solo di un misero +2%! Dove stanno finendo i nostri soldi?'**
> 
> *Oggi voi non siete semplici partecipanti a un corso: siete divisi in 4 team di **Data Detective**:*
> - 🕶️ **Team Ray-Ban** (Focus su Smart Glasses & Categorie Iconiche)
> - 🕶️ **Team Oakley** (Focus su Prizm Sport & Performance)
> - 🕶️ **Team Persol** (Focus su Artigianalità & Made in Italy)
> - 🕶️ **Team Oliver Peoples** (Focus su Segmento Luxury)
> 
> *Nelle prossime 3 ore useremo **BigQuery Studio** e **Gemini Generative AI** per risolvere questo mistero, dimostrare quali canali pubblicitari generano profitti e presentare il Piano di Crescita Q4 al CMO!"*
>
> **[Sondaggio Icebreaker in Aula]:**  
> *"Prima di aprire la console, alzi la mano chi pensa che la perdita di budget sia dovuta ai Social Media terzi come TikTok, e chi pensa che sia un problema di sconti sconsiderati sul sito e-commerce!"*  
> *(Lascia rispondere 2-3 studenti per 2 minuti per scaldare l'ambiente).*

---

#### 15:40 - 15:52 (12m) | 🎙️ DEMO LIVE #1: BigQuery Data Canvas & Gemini Data Insights
> **[Azione Docente in Console]:** Condividi lo schermo sulla console Google Cloud di BigQuery Studio. Mostra la barra di navigazione a sinistra (Explorer).
>
> **[Parla il Docente]:**  
> *"Iniziamo! Clicchiamo tutti in alto a sinistra su **`+ ADD` -> `Star a project by name`** e digitiamo il nome del nostro progetto: `qwiklabs-gcp-04-9efaa47f1d21`. Cliccate su **Star**.*
> 
> *Ora vedete comparire nel pannello di sinistra il dataset **`luxottica_marketing_analytics`**. Espandetelo per vedere le tabelle.*
> 
> *Prima di scrivere anche solo una riga di codice SQL, voglio mostrarvi come l'AI generativa Gemini ci permette di esplorare i dati in linguaggio naturale. Cliccate sul pulsante celeste **`+`** in alto e selezionate **Data Canvas**."*
>
> **[Azione Docente]:** Nel campo di ricerca del Data Canvas digita il prompt:  
> 💬 `Mostrami le vendite totali e lo scontrino medio per brand nel dataset luxottica_marketing_analytics` e premi **Invio**.
>
> **[Parla il Docente]:**  
> *"Guardate la magia: Gemini ha creato un **Nodo SQL** automatico. Clicchiamo su **RUN** e poi sul tasto **Visualize** per generare il grafico a barre."*
>
> **[Azione Docente]:** Clicca su **Visualize**, poi clicca su **Add Insights Node** (o *Generate Insights*).
>
> **[Parla il Docente - Commentando i Risultati a Schermo]:**  
> *"Osserviamo insieme i 4 punti fondamentali rilevati dall'AI:*
> 1. 🟡 **Oliver Peoples (AOV ~420 €):** *In giallo brillante! Ha lo scontrino medio più alto del gruppo. I clienti luxury non chiedono sconti.*
> 2. 🔵 **Ray-Ban (Fatturato ~9.49M €):** *È il leader indiscusso dei volumi con oltre 42.500 ordini, ma ha un AOV di 223 €.*
> 3. 🟣 **Vogue Eyewear (AOV ~125 €):** *Sulle linee fashion mass-market incassiamo meno per singolo ordine.*
> 4. ❓ **Il Quesito del CMO:** *Se Ray-Ban fattura 9.49M €, perché le campagne pubblicitarie non stanno convertendo al massimo delle potenzialità? Spostiamoci nell'editor SQL!"*

---

#### 15:52 - 16:00 (8m) | 🎙️ DEMO LIVE #2: La Prima Query Guidata con Gemini SQL Generator
> **[Azione Docente in Console]:** Clicca sul pulsante **`+` -> `SQL query`** in alto a sinistra per aprire una nuova scheda nell'editor SQL.
>
> **[Parla il Docente]:**  
> *"Tranquilli tutti! Nessuno vi chiede di diventare programmatori o imparare la sintassi SQL a memoria in 3 ore. BigQuery Studio include **Gemini SQL Generator**, che trasforma le nostre domande in italiano in codice SQL perfetto.*
> 
> *Usiamo la scorciatoia da tastiera **`Ctrl + Shift + P`** (oppure clicchiamo sull'icona della matita **Generate SQL** in alto nell'editor)."*
>
> **[Azione Docente]:** Digita nel box di Gemini:  
> 💬 `Calcola il totale ordini, il fatturato totale in euro e la spesa adv totale dal dataset luxottica_marketing_analytics` e premi **Generate**.
>
> **[Codice Generato da Gemini]:**
> ```sql
> SELECT 
>   'Totale Ordini Online' AS metric,
>   COUNT(DISTINCT order_id) AS total_count,
>   ROUND(SUM(revenue_eur), 2) AS total_eur
> FROM `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.lux_online_orders`
> UNION ALL
> SELECT 
>   'Totale Spesa Adv' AS metric,
>   COUNT(DISTINCT campaign_id) AS total_count,
>   ROUND(SUM(spend_eur), 2) AS total_eur
> FROM `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.lux_ad_spend`;
> ```
>
> **[Azione Docente]:** Clicca sul tasto celeste **RUN** (`Ctrl + Enter`).
>
> **[Parla il Docente - Lettura Risultati]:**  
> *"Leggiamo i dati emersi:*
> - **Fatturato Totale E-Commerce:** **23.620.000,00 €** su **107.000 ordini**.
> - **Spesa Pubblicitaria Totale:** **6.830,00 €** su **7 campagne**.
> 
> *I numeri macro sembrano eccellenti! Ma il numero aggregato **nasconde la verità**! Nei prossimi blocchi faremo lo 'zoom-in' per scoprire dove si nascondono le perdite!"*

---

### 🕒 16:00 - 16:45 | BLOCCO 2: Capitolo 1 - Scoperta dei Prodotti ad Alto Margine & Sconti (45 Mins)

#### 16:00 - 16:15 (15m) | 🎙️ LEZIONE TEORICA: La Rosetta Stone Excel $\rightarrow$ SQL
> **[Azione Docente]:** Mostra la slide della Tabella Rosetta Stone (`slides/luxottica_bigquery_presentation.html`).
>
> **[Parla il Docente - Word-for-Word]:**  
> *"Per chi lavora ogni giorno su Excel, SQL sembra una lingua straniera. In realtà è identico alle funzioni che usate già!*
> 
> - **`SELECT`** $\rightarrow$ Scegliere quali colonne visualizzare nel foglio Excel.
> - **`WHERE`** $\rightarrow$ Applicare i filtri sulle colonne (es. Filtra solo `brand = 'Ray-Ban'`).
> - **`GROUP BY`** $\rightarrow$ **La Tabella Pivot di Excel!** Trascinare 'Brand' nelle Righe e 'Revenue' nei Valori.
> - **`SUM()`, `AVG()`, `COUNT()`** $\rightarrow$ Somma, Media e Conteggio nella Pivot.
> 
> *Facilissimo, vero? Ora tocca a voi scendere in campo per la Challenge #1!"*

---

#### 16:15 - 16:40 (25m) | 🏆 CHALLENGE #1: "The Data Explorer" (Esercitazione Studenti Hands-On)
> **[Azione Docente]:** Invita gli studenti ad aprire il file `challenges/challenge_1_data_explorer.sql` e a svolgere i 2 quesiti fondamentali.
>
> **[Istruzione ai Team]:**  
> *"Team, avete 15 minuti di lavoro individuale/di squadra. Usate Gemini SQL Generator per rispondere a queste due domande:*
> 1. *Qual è il fatturato e lo scontrino medio (AOV) per ciascun brand?*
> 2. *Qual è lo sconto medio in euro (`discount_amount_eur`) per brand e canale di vendita?"*

---

#### ⏱️ 16:30 - 16:40 (10m) | Debriefing Challenge #1 & Risultati a Schermo
> **[Azione Docente]:** Chiedi al **Team Ray-Ban** e al **Team Vogue** di condividere i propri risultati. Proietta la query degli sconti su BigQuery Studio.
>
> **[Query Eseguita in Aula]:**
> ```sql
> SELECT
>   brand,
>   channel,
>   ROUND(AVG(discount_amount_eur), 2) AS average_discount_eur
> FROM `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.lux_online_orders`
> GROUP BY brand, channel
> ORDER BY average_discount_eur DESC;
> ```
>
> **[Risultati Emersi a Schermo]:**
> | Row | brand | channel | average_discount_eur |
> | :--- | :--- | :--- | :--- |
> | 1 | **Vogue Eyewear** | **Wholesale Partner** | **28.50 €** 🚨 |
> | 2 | **Ray-Ban** | **E-Commerce Direct** | **25.00 €** 🚨 |
> | 3 | **Oakley** | **Wholesale Partner** | **14.50 €** |
> | 4 | **Vogue Eyewear** | **E-Commerce Direct** | **12.00 €** |
> | 5 | **Ray-Ban** | **Wholesale Partner** | **8.00 €** |
> | ... | ... | ... | ... |
> | 10 | **Persol** | **E-Commerce Direct** | **0.00 €** 💎 |
> | 11 | **Oliver Peoples** | **E-Commerce Direct** | **0.00 €** 💎 |
>
> **[Parla il Docente - Analisi di Business con l'Aula]:**  
> *"SCOPERTA SHOCK PER IL CMO! Guardiamo i primi due posti:*
> 1. 🚨 **Vogue Eyewear su Wholesale Partner:** *Sconto medio di **28,50 € per ordine**! Stiamo regalandolo ai distributori terzi svalutando il brand!*
> 2. 🚨 **Ray-Ban su E-Commerce Direct:** *Sconto medio di **25,00 € per ordine**! Sul nostro sito ufficiale Ray-Ban.com stiamo concedendo promozioni automatiche aggressive che erodono il margine diretto!*
> 3. 💎 **Persol & Oliver Peoples:** *Mantengono lo sconto a 0.00 € preservando il posizionamento luxury!*
> 
> *Assegniamo **+100 Punti al Team Ray-Ban** per aver scoperto la prima fuga di margine!"*

---

### ☕ 16:45 - 17:00 | COFFEE BREAK & PAUSA DIDATTICA (15 Mins)
> ⚠️ **PACING TIP PER IL DOCENTE:** Non saltare mai questa pausa! Serve a far assimilare i concetti, permettere a chi è rimasto indietro di allinearsi su BigQuery Studio e fare networking.

---

### 🕒 17:00 - 17:45 | BLOCCO 3: Capitolo 2 - Rivelazione del ROAS con CTE & JOIN (45 Mins)

#### 17:00 - 17:20 (20m) | 🎙️ COPIONE: Il "Momento Didattico Gemini ROAS" & La JOIN
> **[Parla il Docente - Word-for-Word]:**  
> *"Siamo tornati! Ora affrontiamo il punto centrale per il CMO:*  
> **'Quale piattaforma pubblicitaria ci sta facendo guadagnare e quale sta bruciando budget?'**  
> 
> *Andiamo sulla tabella **`lux_ad_spend`**.*  
> *Rassicuro subito i non-tecnici: non dovete scrivere codice complesso a mano. Proviamo a chiedere a Gemini di calcolare il ROAS (Return On Ad Spend) per piattaforma!*  
> 
> *Premete **`Ctrl + Shift + P`** e digitate:*  
> 💬 `Dalla tabella lux_ad_spend, calcola la spesa totale e il ROAS per piattaforma.`"
>
> **[Azione Docente]:** Mostra cosa risponde Gemini in BigQuery Studio.
>
> **[Parla il Docente - Commentando l'Avviso di Gemini]:**  
> *"Guardate i commenti generati da Gemini:*  
> `-- ROAS requires revenue data linked to ad spend. Direct revenue is in lux_online_orders.`  
> 
> *Gemini ci avvisa che la spesa è nella tabella pubblicitaria, ma il fatturato degli ordini è nella tabella `lux_online_orders`!*  
> 
> 💡 **COME UNIAMO SPESA E RICAVI SENZA FARE ERRORI?**  
> *Se facessimo una `JOIN` diretta tra ordini e campagne senza pre-aggregazione, ogni ordine verrebbe triplicato per ogni campagna dello stesso brand, generando un errore di calcolo chiamato **SQL Fan-Out Multiplication**.*  
> 
> *La soluzione elegante e professionale usata dai Data Engineer è la **CTE (`WITH`)**: si calcola prima il totale ricavi per brand, si calcola il totale spesa per piattaforma, e poi si uniscono con la **`JOIN`** (che è esattamente un **CERCA.VERT / VLOOKUP automatico** di Excel)!"*

---

#### 17:20 - 17:40 (20m) | 🏆 CHALLENGE #2: "Intelligence Cross-Canale" & Il Verdetto del ROAS
> **[Azione Docente in Console]:** Fai eseguire a Gemini o incolla nell'editor la query con la CTE e la JOIN.
>
> **[Query Ufficiale Challenge #2]:**
> ```sql
> WITH revenue_by_brand AS (
>   SELECT 
>     brand, 
>     SUM(revenue_eur) AS total_revenue_eur
>   FROM `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.lux_online_orders`
>   GROUP BY brand
> ),
> spend_by_platform AS (
>   SELECT 
>     platform,
>     brand,
>     SUM(spend_eur) AS total_spend_eur
>   FROM `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.lux_ad_spend`
>   GROUP BY platform, brand
> )
> SELECT 
>   s.platform,
>   ROUND(SUM(s.total_spend_eur), 2) AS total_spend_eur,
>   ROUND(SUM(r.total_revenue_eur), 2) AS total_revenue_eur,
>   ROUND(SAFE_DIVIDE(SUM(r.total_revenue_eur), SUM(s.total_spend_eur)), 2) AS roas
> FROM spend_by_platform s
> JOIN revenue_by_brand r ON s.brand = r.brand
> GROUP BY s.platform
> ORDER BY roas DESC;
> ```
>
> **[Risultati Emersi a Schermo]:**
> | Row | platform | total_spend_eur | total_revenue_eur | roas |
> | :--- | :--- | :--- | :--- | :--- |
> | 1 | **Google Ads** | **1.080,00 €** | **7.644,00 €** | **7.08x 🚀** |
> | 2 | **Meta Ads** | **550,00 €** | **2.090,00 €** | **3.80x 📸** |
> | 3 | **Criteo Social** | **1.200,00 €** | **1.350,00 €** | **1.12x ⚠️** |
> | 4 | **TikTok Ads** | **4.000,00 €** | **2.100,00 €** | **0.52x 💸** |
>
> **[Parla il Docente - L'Rivelazione per il CMO]:**  
> *"SIGNORI, ECCO DOVE FINISCONO I SOLDI DI LUXOTTICA!*  
> 
> 🚀 **1. Google Ads (Search & Shopping):**  
> *ROAS **7,08x**! Per ogni Euro speso su Google Ads, Luxottica ne incassa **7,08 €**! È la piattaforma campionessa di profitti.*  
> 
> 💸 **2. TikTok Ads (La Voragine di Budget):**  
> *Spesa: **4.000,00 €** | Incasso: **2.100,00 €** | **ROAS: 0,52x ❌**!*  
> *Stiamo bruciando oltre il 58% del budget adv totale su TikTok per riprendere indietro la metà di quello che spendiamo!*  
> 
> ⚠️ **3. Criteo Social:**  
> *ROAS **1,12x** (A stento in pareggio dopo i costi agenzia).*  
> 
> *Abbiamo la diagnosi perfetta da portare al CMO!"*

---

### 🕒 17:45 - 18:15 | BLOCCO 4: Capitolo 3 - Google Ads Customer Match & Data Wrangling (30 Mins)

#### 17:45 - 17:55 (10m) | 🎙️ DEMO LIVE: Data Wrangling dei Lead Sporchi
> **[Parla il Docente]:**  
> *"Ora che sappiamo che Google Ads è il nostro canale ad alto rendimento, come recuperiamo i potenziali clienti VIP che hanno espresso interesse per i Ray-Ban Meta Smart Glasses?*  
> 
> *Spostiamoci sulla tabella **`lux_raw_marketing_leads_dirty`**. I lead raccolti dal sito presentano vari problemi:*  
> *- Email con spazi e maiuscole miste (` CHIARA.LUX@GMAIL.COM `).*  
> *- Valori di spesa stimata formattati come testo (`$250 EUR`).*  
> 
> *Dobbiamo ripulire i dati e creare una **Vista SQL (View)** pronta per l'importazione in **Google Ads Customer Match** (retargeting su YouTube Ads e Google Search)!"*

---

#### 17:55 - 18:10 (15m) | 🏆 CHALLENGE #3: Creazione della Vista Pulita con Suffisso Team
> **[Istruzione d'Aula Multi-Tenancy]:**  
> ⚠️ *"ATTENZIONE TEAM: Per evitare che i team sovrascrivano la vista degli altri nello stesso dataset, ognuno aggiunga il proprio **suffisso team** al nome della vista (es. `v_clean_marketing_leads_team_rayban`)."*  
> 
> **[Azione Docente in Console]:** Apri Gemini SQL Generator (`Ctrl + Shift + P`) e inserisci il prompt:  
> 💬 `Crea o sostituisci la vista luxottica_marketing_analytics.v_clean_marketing_leads_team_rayban prendendo dalla tabella lux_raw_marketing_leads_dirty: rendi minuscole e pulite le email (raw_email con LOWER e TRIM), estrai il brand e converti la spesa stimata in un numero pulito, filtrando solo i lead VIP con spesa stimata maggiore di 200 euro.`
>
> **[Query Eseguita]:**
> ```sql
> CREATE OR REPLACE VIEW `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.v_clean_marketing_leads_team_rayban` AS
> SELECT
>   id,
>   raw_lead_id AS lead_id,
>   LOWER(TRIM(raw_email)) AS clean_email,
>   REGEXP_REPLACE(raw_brand, r'[^a-zA-Z0-9 ]', '') AS clean_brand,
>   SAFE_CAST(REGEXP_EXTRACT(raw_estimated_spend, r'([0-9]+)') AS FLOAT64) AS clean_estimated_spend_eur,
>   raw_country AS country
> FROM `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.lux_raw_marketing_leads_dirty`
> WHERE SAFE_CAST(REGEXP_EXTRACT(raw_estimated_spend, r'([0-9]+)') AS FLOAT64) > 200;
> ```
> 
> **[Verifica Dati Vista Pulita]:**
> ```sql
> SELECT * FROM `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.v_clean_marketing_leads_team_rayban` LIMIT 10;
> ```
> 
> **[Parla il Docente]:**  
> *"RISULTATO STRORDINARIO! Abbiamo sbloccato **350+ Lead VIP** perfettamente formattati e pronti per essere caricati in **Google Ads Customer Match** per attivare le campagne di retargeting su YouTube Ads!"*

---

### 🕒 18:15 - 18:30 | BLOCCO 5: Il Piano di Crescita Q4 con Google & Premiazione (15 Mins)

#### 18:15 - 18:25 (10m) | 🎙️ COPIONE: Il Piano Strategico Q4 in 3 Punti per il CMO
> **[Azione Docente]:** Proietta la slide finale della presentazione (`slides/luxottica_bigquery_presentation.html`).
>
> **[Parla il Docente - Sintesi Finale Esecutiva]:**  
> *"Ecco il **Piano di Crescita Q4 in 3 Punti** da consegnare al CMO di Luxottica:*
> 
> 📋 **1. Riallocazione Immediata del Budget Pubblicitario:**  
> *Spostare il 60% del budget dai canali social in perdita (**TikTok Ads** a 0,52x ROAS) verso **Google Search, Google Shopping e YouTube Ads** (ROAS **7,08x**).*
> 
> 🛡️ **2. Protezione Margini E-Commerce Direct:**  
> *Eliminare gli sconti automatici del 25 € sul sito Ray-Ban.com e regolamentare i discount del 28,50 € sui Wholesale Partner per Vogue Eyewear.*
> 
> 🎯 **3. Attivazione Lead VIP con Google Customer Match:**  
> *Utilizzare i 350+ lead VIP estratti con la nostra Vista SQL per lanciare campagne di retargeting ad altissima conversione su YouTube e Google Search per i **Ray-Ban Meta Smart Glasses**!"*

---

#### 18:25 - 18:30 (5m) | Proclamazione del Team Vincitore & Q&A Finale
> **[Parla il Docente]:**  
> *"Sommando i punti delle challenge:*  
> 🏆 **Il Brand Detective Team Vincitore è... TEAM RAY-BAN!** 👏🎉  
> 
> *Grazie a tutti per l'incredibile energia. Avete dimostrato che con BigQuery Studio e Gemini AI, anche senza essere programmatori, si possono prendere decisioni di business da milioni di euro in sole 3 ore!*  
> 
> *Buon lavoro e ci vediamo alla prossima sessione!"*
