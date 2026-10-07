# Trainer Master Facilitation & Preparation Manual
**Course:** BigQuery for Data Analysis: Mastering Marketing Data with BigQuery SQL  
**Client:** Luxottica  
**Date & Time:** Oct 12th, 2026 | 15:30 - 18:30 (3 Hours / 180 Minutes)  
**Target Audience:** Global Analytics, Business Analyst, Digital Commerce & Retail Operations  
**Format:** Hybrid (In-Person & Remote)

---

## 1. Gestione Accessi al Progetto BigQuery (Point 1)

Per garantire un'esperienza senza frizioni (evitando che 30 persone debbano configurare la fatturazione o il progetto GCP da zero), la strategia migliore è il **Modello Progetto Condiviso gestito da Luxottica**:

### 1.1 Soluzione Consigliata: Progetto Centralizzato GCP
1. **Creazione Progetto GCP Dedicato:** Creare un progetto GCP denominato `lux-bq-training-2026` (o usare un progetto sandbox aziendale esistente).
2. **Creazione Google Group:** Creare un gruppo Google aziendale (es. `bq-training-participants@luxottica.com`) contenente tutti gli indirizzi email dei partecipanti.
3. **Assegnazione Ruoli IAM al Gruppo:**
   - `BigQuery Job User` (`roles/bigquery.jobUser`): Permette ai partecipanti di eseguire query all'interno del progetto.
   - `BigQuery Data Viewer` (`roles/bigquery.dataViewer`): Permette la lettura del dataset del corso `luxottica_marketing_analytics`.
   - `BigQuery Data Editor` (`roles/bigquery.dataEditor`): **Solo sul dataset temporaneo/personale** se devono creare viste (Challenge #2).
4. **Pre-caricamento Dataset:** **FONDAMENTALE**: Esegui lo script `dataset/00_setup_schema_and_data.sql` **prima della sessione**. Quando i partecipanti apriranno la console, vedranno già le tabelle pronte nel pannello Explorer senza dover creare nulla!

---

## 2. Condivisione File e Materiali con i Partecipanti (Point 2)

Per distribuire il materiale in modo semplice e accessibile sia da remoto che in presenza:

1. **Cartella Condivisa Google Drive (o Intranet Luxottica):**
   - **`01_Dataset_Pre-loaded_Instructions.pdf`**: Guida di 1 pagina per accedere alla console.
   - **`02_SQL_Cheat_Sheet_Marketing.pdf`**: Scheda tascabile sintetica con le sintassi chiave (`SELECT`, `GROUP BY`, `JOIN`, `TRIM`, `SAFE_CAST`).
   - **`03_Esercizi_Challenge_1_e_2.sql`**: I file SQL con le domande delle challenge.
2. **Pin del Progetto in BigQuery Console:**
   - Durante i primi 5 minuti del Blocco 1, mostra a schermo come cliccare su **"+ ADD" -> "Star a project by name"** e digitare `lux-bq-training-2026`. Il dataset apparirà subito nella loro barra laterale.

---

## 3. Strategia di Engagement e Gamification (Point 3)

Rendere un corso SQL di 3 ore appassionante e interattivo per profili business richiedi dinamiche attive:

### 3.1 Sondaggi Live & Icebreaker (Mentimeter / Slido)
- **Minuto 15:30:** *"Qual è la formula Excel che ti dà più incubi la notte?"* (es. VLOOKUP infiniti, file che si bloccano oltre 100k righe). Collega le risposte ai superpoteri di BigQuery!

### 3.2 Sfida a Squadre per Brand Luxottica (Gamification)
- Dividi i partecipanti (in presenza e nelle stanze breakout di Zoom/Teams) in **4 Team aziendali**:
  - 🕶️ **Team Ray-Ban**
  - 🕶️ **Team Oakley**
  - 🕶️ **Team Persol**
  - 🕶️ **Team Oliver Peoples**
- Durante la **Challenge #1** e la **Challenge #2**, la prima squadra che scrive la query corretta e condivide il risultato in chat vince il "Luxottica Analytics Badge"!

### 3.3 Dalla Query alla Visualizzazione Live (Looker Studio)
- Fai vedere l'impatto immediato del loro lavoro! Quando completano la Challenge #2 (creando la vista pulita `v_clean_marketing_leads`), apri **Looker Studio** con 1-click da BigQuery e mostra come la loro query pulita trasforma un grafico disordinato in una dashboard executive di livello internazionale!

---

## 4. Calibrazione Didattica per Pubblico Non Super-Tecnico (Point 4)

Il pubblico (Business Analyst, Retail Ops, Digital Commerce) cerca valore di business e praticità, non teoria di informatica pura.

### 4.1 Metafore e Analogie Business vs Excel
Spiega il SQL usando il linguaggio che già usano ogni giorno su Excel:

| Concetto SQL | Metafora Excel / Business |
| :--- | :--- |
| `SELECT` | "Scegliere le colonne da visualizzare nel report" |
| `WHERE` | "I filtri in cima alle intestazioni di colonna" |
| `GROUP BY` | "Creare una Tabella Pivot (Pivot Table)" |
| `SUM()`, `COUNT()` | "I valori sintetizzati nei campi della Tabella Pivot" |
| `JOIN` | "Un `CERCA.VERT` (VLOOKUP) ad altissima velocità" |
| `QUALIFY / ROW_NUMBER()` | "Rimuovere i duplicati tenendo la riga più recente" |

### 4.2 Semplificazione dei Campi Annidati (`STRUCT` / `ARRAY`)
I campi annidati (Record/Array) in BigQuery sono potenti ma possono spaventare i principianti:
- **Regola d'oro:** Utilizzali solo per mostrare la differenza rispetto alle tabelle tradizionali, senza costringere i partecipanti a scrivere sintassi complesse con `UNNEST` per più di 5 minuti.
- **Esempio Didattico Semplice:**
  ```sql
  -- Mostriamo come un ordine può contenere un elenco semplice di tag prodotti
  SELECT 
    order_id, 
    brand, 
    ['polarized', 'bestseller', 'summer-2026'] AS product_tags
  FROM `luxottica_marketing_analytics.lux_online_orders`
  LIMIT 3;
  ```
- **Messaggio Chiave:** "I campi annidati permettono a BigQuery di salvare liste dentro una singola riga senza duplicare la tabella. Per la vostra operatività quotidiana, lavorerete al 90% con tabelle standard e JOIN tradizionali."

---

## 5. Cronoprogramma e Checkpoint del Trainer

- **15:30 - 15:45:** Icebreaker + Ingresso nel Progetto Condiviso.
- **15:45 - 16:00:** Navigazione Console & Visualizzazione Dataset Pre-caricato.
- **16:00 - 16:25:** SQL Live Code-Along (Costruzione guidata riga per riga).
- **16:25 - 16:45:** **Challenge #1 (A squadre - "The Data Explorer")**.
- **16:45 - 17:00:** ☕ Coffee Break & Supporto individuale.
- **17:00 - 17:45:** Multi-source & Cross-channel ROAS (CRM + Ad Spend).
- **17:45 - 18:15:** **Challenge #2 ("The Clean Slate") & Dashboard Looker Studio**.
- **18:15 - 18:30:** Executive Summary, Sicurezza/PII Masking e Premiazione Team.
