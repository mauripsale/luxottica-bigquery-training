# 🕶️ Luxottica BigQuery Training: Student Participant Guide
## Mission: "The Mystery of the Leaky Ad Budget & The Smart Glasses Breakthrough"

**Course:** BigQuery for Data Analysis: Mastering Marketing Data with BigQuery SQL  
**GCP Project Name:** `bigquery-luxottica`  
**GCP Project ID:** `qwiklabs-gcp-04-9efaa47f1d21`  
**Target Dataset:** `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics`  
**Client:** Luxottica Global Analytics, Business Analyst, Digital Commerce & Retail Operations  
**Date & Time:** Oct 12th, 2026 | 15:30 - 18:30 (3 Hours / 180 Minutes)

---

## 🕵️‍♀️ 1. Your Mission Briefing
> **The Problem:** Global digital ad spend across Meta, TikTok, and Google increased by +35%, but overall online revenue growth stayed flat at +2%.  
> **Your Role:** Marketing Data Detective at Luxottica.  
> **Your Goal:** Solve the mystery in BigQuery Studio, identify budget leaks, discover secret growth drivers, recover lost VIP lead revenue, and present the Q4 Recovery Plan to the CMO!

---

## 🚀 2. Quick Start: Connecting to Your BigQuery Environment

### Step 1: Open BigQuery Studio
1. Open your browser and go to: [https://console.cloud.google.com/bigquery?project=qwiklabs-gcp-04-9efaa47f1d21](https://console.cloud.google.com/bigquery?project=qwiklabs-gcp-04-9efaa47f1d21)
2. Log in with your assigned account (`student-02-25b97e18011e@qwiklabs.net` or your Luxottica Corporate Email).

### Step 2: Pin the Training Project
1. In the left navigation pane (**Explorer**), click the **`+ ADD`** button at the top.
2. Select **"Star a project by name"** (or *Pin a project*).
3. Type the project ID: **`qwiklabs-gcp-04-9efaa47f1d21`** (or search **`bigquery-luxottica`**) and click **Star**.
4. You will now see the dataset **`luxottica_marketing_analytics`** in your left sidebar!

---

## 🎨 3. BigQuery Data Insights, Data Canvas & Visual Data Prep

### 3.1 BigQuery Data Insights (`cloud.google.com/bigquery/docs/data-insights`)
- **Interactive Relationship Graphs:** Visual map showing connections between tables (`lux_crm_customers`, `lux_online_orders`, `lux_ad_spend`).
- **AI-Generated Descriptions:** Automated documentation explaining datasets, tables, and columns in natural language.
- **Sample SQL Queries:** 1-click starter queries generated automatically to kickstart statistical analysis.

### 3.2 BigQuery Data Canvas & Insights Node
- **Search Node:** Search datasets using Gemini natural language prompts.
- **Table Node:** Inspect schemas and column distribution histograms.
- **SQL Node:** View Gemini-generated SQL or write custom queries.
- **Visualization Node:** Turn query results directly into bar/line charts with 1 click.
- **💡 Insights Node:** Automatically generate narrative executive summaries, detect statistical anomalies, spot revenue surges, and calculate metric correlations!

---

## 🏆 4. The 3 Investigation Chapters (Challenges)

### Chapter 1: "The Leaky Bucket" (16:15 - 16:40)
**File:** `challenges/challenge_1_data_explorer.sql`
- **Goal:** Uncover sales performance, brand revenue ranking, and discount leakage.
- **Key Clue:** Compare Ray-Ban Meta Smart Glasses & Oliver Peoples AOV (> €300) vs Vogue Eyewear discount leakage.

---

### Chapter 2: "The Cross-Channel Plot Twist" (17:20 - 17:40)
**File:** `challenges/challenge_2_cross_channel.sql`
- **Goal:** Calculate Customer LTV and Multi-Platform Brand ROAS.
- **Key Clue:** Discover why TikTok Vogue Eyewear has a 0.8x ROAS (losing money!) while Google Search Oliver Peoples has a 6.2x ROAS!

---

### Chapter 3: "The Goldmine in the Trash" (17:55 - 18:10)
**File:** `challenges/challenge_3_clean_slate.sql`
- **Goal:** Clean `lux_raw_marketing_leads_dirty` into `v_clean_marketing_leads`.
- **Key Clue:** Unlock 350+ valid VIP leads worth over €120,000 in Q4 revenue, and build the Looker Studio Executive Dashboard!

---

## 📊 5. Excel vs BigQuery SQL Rosetta Stone

| Excel Action | BigQuery SQL Equivalent | Example Code |
| :--- | :--- | :--- |
| **Selecting Columns** | `SELECT column1, column2` | `SELECT brand, revenue_eur` |
| **Filtering Rows** | `WHERE condition` | `WHERE brand = 'Ray-Ban'` |
| **Creating a Pivot Table** | `GROUP BY column` | `GROUP BY brand` |
| **Summing Values** | `SUM(column)` | `SUM(revenue_eur)` |
| **Counting Rows** | `COUNT(column)` or `COUNT(DISTINCT id)` | `COUNT(DISTINCT customer_id)` |
| **VLOOKUP / CERCA.VERT** | `LEFT JOIN table ON key` | `LEFT JOIN lux_crm_customers ON ...` |
| **Remove Duplicates** | `QUALIFY ROW_NUMBER() OVER(...) = 1` | Keep latest record per email |
