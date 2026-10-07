# 🕶️ Luxottica BigQuery Training: Student Participant Guide
**Course:** BigQuery for Data Analysis: Mastering Marketing Data with BigQuery SQL  
**GCP Project Name:** `bigquery-luxottica`  
**GCP Project ID:** `qwiklabs-gcp-04-9efaa47f1d21`  
**Target Dataset:** `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics`  
**Client:** Luxottica Global Analytics, Business Analyst, Digital Commerce & Retail Operations  
**Date & Time:** Oct 12th, 2026 | 15:30 - 18:30 (3 Hours / 180 Minutes)

---

## 🚀 1. Quick Start: Connecting to Your BigQuery Environment

### Step 1: Open BigQuery Studio
1. Open your browser and go to: [https://console.cloud.google.com/bigquery?project=qwiklabs-gcp-04-9efaa47f1d21](https://console.cloud.google.com/bigquery?project=qwiklabs-gcp-04-9efaa47f1d21)
2. Log in with your assigned account (`student-02-25b97e18011e@qwiklabs.net` or your Luxottica Corporate Email).

### Step 2: Pin the Training Project
1. In the left navigation pane (**Explorer**), click the **`+ ADD`** button at the top.
2. Select **"Star a project by name"** (or *Pin a project*).
3. Type the project ID: **`qwiklabs-gcp-04-9efaa47f1d21`** (or search **`bigquery-luxottica`**) and click **Star**.
4. You will now see the dataset **`luxottica_marketing_analytics`** in your left sidebar!

---

## 🎨 2. BigQuery Data Insights, Data Canvas & Visual Data Prep

In addition to writing SQL code directly, BigQuery Studio includes modern AI-powered features:

### 2.1 BigQuery Data Insights (`cloud.google.com/bigquery/docs/data-insights`)
Overcomes the "cold start problem" when exploring new datasets:
- **Interactive Relationship Graphs:** Visual map showing connections, dependencies, and join keys between tables (`lux_crm_customers`, `lux_online_orders`, `lux_ad_spend`).
- **AI-Generated Descriptions:** Automated documentation explaining datasets, tables, and columns in natural language.
- **Sample SQL Queries:** 1-click starter queries generated automatically to kickstart statistical analysis.

### 2.2 BigQuery Data Canvas & Insights Node (Visual DAG Workspace)
- **Search Node:** Search datasets using Gemini natural language prompts.
- **Table Node:** Inspect schemas and column distribution histograms.
- **SQL Node:** View Gemini-generated SQL or write custom queries.
- **Visualization Node:** Turn query results directly into bar/line charts with 1 click.
- **💡 Insights Node:** Automatically generate narrative executive summaries, detect statistical anomalies, spot revenue surges, and calculate metric correlations!

### 2.3 Visual Data Preparation (Gemini Low-Code Wrangling)
- **Data View:** Inspect column quality with built-in statistical histograms.
- **Gemini Suggestion Cards:** One-click AI cleaning suggestions (*Trim spaces*, *Lowercase email*).
- **Cell Editing Few-Shot Prompts:** Manually edit 1 cell in the preview grid — Gemini learns your formatting rule and applies it to the entire table automatically!

---

## 📊 3. Marketing SQL Cheat Sheet & Excel Translation

### Excel vs BigQuery SQL Rosetta Stone

| Excel Action | BigQuery SQL Equivalent | Example Code |
| :--- | :--- | :--- |
| **Selecting Columns** | `SELECT column1, column2` | `SELECT brand, revenue_eur` |
| **Filtering Rows** | `WHERE condition` | `WHERE brand = 'Ray-Ban'` |
| **Creating a Pivot Table** | `GROUP BY column` | `GROUP BY brand` |
| **Summing Values** | `SUM(column)` | `SUM(revenue_eur)` |
| **Counting Rows** | `COUNT(column)` or `COUNT(DISTINCT id)` | `COUNT(DISTINCT customer_id)` |
| **VLOOKUP / CERCA.VERT** | `LEFT JOIN table ON key` | `LEFT JOIN lux_crm_customers ON ...` |
| **Remove Duplicates** | `QUALIFY ROW_NUMBER() OVER(...) = 1` | Keep latest record per email |

---

## 🏆 4. Hands-on Challenge Worksheets (3 Hours / 3 Challenges)

### Challenge #1: "The Data Explorer" (16:15 - 16:40)
**File:** `challenges/challenge_1_data_explorer.sql`
- **Part A (Sales Performance):** Brand revenue ranking, channel breakdown, high-value orders (> 300 EUR).
- **Part B (Campaign Efficiency):** Ad platform CTR %, top 5 campaigns by Cost-Per-Conversion (`spend / conversions`).
- **Part C (Discount Leakage & Regional):** Effective discount % per product category, customer segmentation by country & loyalty tier.
- **Part D (Conditional Metrics):** Spend tier segmentation ('Low', 'Medium', 'High') using `CASE WHEN`.

---

### Challenge #2: "Cross-Channel Marketing Intelligence" (17:20 - 17:40)
**File:** `challenges/challenge_2_cross_channel.sql`
- **Q1 (Customer LTV):** Join `lux_crm_customers` + `lux_online_orders` to compute LTV per loyalty tier.
- **Q2 (Omni-channel Stream):** Use `UNION ALL` to combine E-Commerce Direct and Retail Store sales streams.
- **Q3 (Multi-Platform Brand ROAS):** Use CTEs (`WITH` clauses) to blend Ad Spend and Sales Revenue per brand to compute ROAS (`Sales Revenue / Ad Spend`).
- **Q4 (Cross-Sell Opportunity):** Identify customers purchasing brands different from their CRM preferred brand.

---

### Challenge #3: "The Clean Slate" (17:55 - 18:10)
**File:** `challenges/challenge_3_clean_slate.sql`
**Goal:** Transform the dirty marketing leads table `lux_raw_marketing_leads_dirty` into a clean reporting view `v_clean_marketing_leads`.
- **Requirements:** Trim whitespace, convert emails to lowercase, normalize brand names (`ray ban` -> `Ray-Ban`), extract currency strings (`€ 175.00` -> `175.00`), parse mixed dates (`DD/MM/YYYY` / `YYYY-MM-DD`), deduplicate emails using `QUALIFY ROW_NUMBER() OVER(...)`.

---

## 💡 5. Essential BigQuery Marketing Functions

```sql
-- 1. Cleaning Strings
TRIM('  Ray-Ban  ')                --> 'Ray-Ban'
LOWER('MARCO.ROSSI@EMAIL.IT')       --> 'marco.rossi@email.it'
INITCAP('vogue eyewear')           --> 'Vogue Eyewear'

-- 2. Safe Division (prevents division by zero errors)
SAFE_DIVIDE(spend_eur, conversions)

-- 3. Extracting numbers from messy currency strings
SAFE_CAST(REGEXP_REPLACE('€ 175.00', r'[^0-9.]', '') AS NUMERIC)  --> 175.00

-- 4. Date Parsing
PARSE_DATE('%d/%m/%Y', '15/09/2026')   --> DATE '2026-09-15'
PARSE_DATE('%Y-%m-%d', '2026-09-15')   --> DATE '2026-09-15'
```

---

## 📈 6. Next Steps & Continuous Learning
- **Looker Studio:** Connect your BigQuery views directly to Looker Studio for automated executive dashboards.
- **Support & Questions:** Reach out to the Luxottica Global Analytics Enablement team.
