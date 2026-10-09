# 🕶️ Luxottica BigQuery Training: 1-Page Desk Cheat Sheet & Placemat
## Quick Reference Card for Hands-On Lab (180 Minutes)

---

### 🔑 1. CONNECTION & ENVIRONMENT INFO
* **Google Cloud Console:** [console.cloud.google.com/bigquery](https://console.cloud.google.com/bigquery)
* **Target Project ID:** `qwiklabs-gcp-04-9efaa47f1d21` (Search: `bigquery-luxottica`)
* **Target Dataset:** `luxottica_marketing_analytics`
* **Pin Project:** Click **`+ ADD`** in left sidebar $\rightarrow$ **Star a project by name** $\rightarrow$ `qwiklabs-gcp-04-9efaa47f1d21`

---

### ⌨️ 2. ESSENTIAL KEYBOARD SHORTCUTS
* **`Ctrl + Shift + P`** (or `Cmd + Shift + P`): Open **Gemini SQL Generator** ✨
* **`Ctrl + Enter`** (or `Cmd + Enter`): **RUN Query** 🚀
* **`Ctrl + /`** (or `Cmd + /`): Toggle SQL Comment `--`

---

### 📊 3. EXCEL TO BIGQUERY SQL ROSETTA STONE
| Excel Pivot / Formula | BigQuery SQL Equivalent | Example Code |
| :--- | :--- | :--- |
| **Select Columns** | `SELECT col1, col2` | `SELECT brand, revenue_eur` |
| **Filter Rows** | `WHERE condition` | `WHERE brand = 'Ray-Ban'` |
| **Pivot Table Rows** | `GROUP BY column` | `GROUP BY brand` |
| **Pivot Values (Sum/Avg)** | `SUM()`, `AVG()`, `COUNT()` | `SUM(revenue_eur)` |
| **VLOOKUP / CERCA.VERT** | `JOIN table ON key` | `JOIN lux_online_orders ON ...` |

---

### 🏆 4. CORE CHALLENGE PROMPTS & QUERIES

#### 📍 Challenge #1: Discount Erosion (16:15 - 16:40)
* **Gemini Prompt:** `Calcola lo sconto medio in euro (discount_amount_eur) per brand e canale dalla tabella lux_online_orders, ordinando per sconto medio decrescente.`
* **Key Finding:** Vogue Wholesale Discount = **28.50 €** | Ray-Ban Direct Discount = **25.00 €**

#### 📍 Challenge #2: Multi-Platform ROAS (17:20 - 17:40)
* **CTE + JOIN Query:**
```sql
WITH revenue_by_brand AS (
  SELECT brand, SUM(revenue_eur) AS total_revenue_eur
  FROM `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.lux_online_orders`
  GROUP BY brand
),
spend_by_platform AS (
  SELECT platform, brand, SUM(spend_eur) AS total_spend_eur
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
GROUP BY s.platform ORDER BY roas DESC;
```
* **Key Finding:** Google Ads ROAS = **7.08x 🚀** | TikTok Ads ROAS = **0.52x 💸**

#### 📍 Challenge #3: Clean View Creation (17:55 - 18:10)
* ⚠️ **Team Suffix Rule:** Always append your team name! (`v_clean_marketing_leads_<suffix>`)
* **Gemini Prompt:** `Crea la vista luxottica_marketing_analytics.v_clean_marketing_leads_team_rayban prendendo da lux_raw_marketing_leads_dirty: pulisci email con LOWER e TRIM, estrai brand e converti spesa in numero, filtrando lead VIP con spesa > 200 euro.`
* **Key Finding:** **350+ VIP Leads** unlocked for **Google Ads Customer Match**!
