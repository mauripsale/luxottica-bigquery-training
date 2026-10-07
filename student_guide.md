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

## 📊 2. Marketing SQL Cheat Sheet & Excel Translation

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

### Standard SQL Query Template
```sql
SELECT
  brand,
  product_category,
  COUNT(order_id) AS total_orders,
  ROUND(SUM(revenue_eur), 2) AS total_revenue_eur,
  ROUND(AVG(revenue_eur), 2) AS avg_order_value_eur
FROM
  `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.lux_online_orders`
WHERE
  revenue_eur > 50.00
GROUP BY
  brand,
  product_category
ORDER BY
  total_revenue_eur DESC
LIMIT 10;
```

---

## 🏆 3. Hands-on Challenge Worksheets

### Challenge #1: "The Data Explorer" (16:25 - 16:45)
**Goal:** Query `lux_online_orders` and `lux_ad_spend` to answer key business questions.

- **Question 1 (Brand Revenue Ranking):**  
  Which Luxottica brand generated the highest total revenue in `lux_online_orders`?
  
- **Question 2 (Discount Leakage Analysis):**  
  Calculate the total revenue lost due to discounts per sales channel (`channel`).
  
- **Question 3 (High-Efficiency Campaigns):**  
  Find all ad campaigns in `lux_ad_spend` with >100 conversions and spend < €3,000. Calculate cost per conversion (`spend_eur / conversions`).

- **Question 4 (Bonus - Loyalty Tier Revenue):**  
  Join `lux_crm_customers` with `lux_online_orders` to find total revenue per loyalty tier (`VIP`, `Gold`, `Silver`, `Standard`).

---

### Challenge #2: "The Clean Slate" (18:00 - 18:15)
**Goal:** Transform the raw, dirty marketing leads table `lux_raw_marketing_leads_dirty` into a clean reporting view named `v_clean_marketing_leads`.

#### Cleaning Checklist:
1. **Trim Whitespace:** Clean leading/trailing spaces from lead IDs and emails.
2. **Lower Case Email:** Convert emails to lowercase (`LOWER(TRIM(raw_email))`).
3. **Brand Normalization:** Standardize brand names (`ray ban` / `RAY BAN` -> `Ray-Ban`, `PERSOL` -> `Persol`).
4. **Safe Currency Extraction:** Convert string prices like `' € 175.00 '` to NUMERIC using `REGEXP_REPLACE` and `SAFE_CAST`.
5. **Flexible Date Parsing:** Parse dates in European (`DD/MM/YYYY`) or ISO (`YYYY-MM-DD`) format using `PARSE_DATE()`.
6. **Deduplication:** Keep only 1 lead entry per email address based on highest priority (`lead_priority`).

---

## 💡 4. Essential BigQuery Marketing Functions

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

## 📈 5. Next Steps & Continuous Learning
- **Looker Studio:** Connect your BigQuery views directly to Looker Studio for automated executive dashboards.
- **Support & Questions:** Reach out to the Luxottica Global Analytics Enablement team.
