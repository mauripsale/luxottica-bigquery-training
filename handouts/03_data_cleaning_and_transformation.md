# Module 03: Data Cleaning & Transformation (Data Wrangling)
**Luxottica Marketing Data Training**  
**GCP Project ID:** `qwiklabs-gcp-04-9efaa47f1d21` (`bigquery-luxottica`)  
**Date:** Oct 12th, 2026 | **Time:** 17:45 - 18:15 (Block 4)

---

## 1. Principles of Dataset Integrity in Marketing Analytics

Dirty data distorts executive reporting, ruins attribution models, and wastes ad budgets. Core wrangling challenges include:
- **String Inconsistencies:** Leading/trailing spaces, mixed capitalization (`Ray-Ban`, `ray-ban`, `RAY BAN`).
- **Data Type Mismatches:** Currency strings (`€ 175.00`) or non-numeric values passed as strings.
- **Inconsistent Date Formats:** ISO (`2026-09-01`), European (`01/09/2026`), or Verbal (`Sep 01, 2026`).
- **Duplicate Records:** Multiple lead form submissions for the same user.
- **Anomalies & Outliers:** Negative spend values, malformed emails.

---

## 2. Key SQL Functions for Data Cleaning in BigQuery

### 2.1 String Standardization
- `TRIM(string)`: Removes leading and trailing spaces.
- `LOWER(string)` / `UPPER(string)`: Standardizes casing.
- `INITCAP(string)`: Capitalizes the first letter of each word.
- `REGEXP_REPLACE(string, regexp, replacement)`: Cleans currency symbols, commas, or special characters.

```sql
-- Standardizing brand names and cleaning currency strings
SELECT
  TRIM(raw_lead_id) AS lead_id,
  LOWER(TRIM(raw_email)) AS clean_email,
  INITCAP(TRIM(REGEXP_REPLACE(raw_brand, r'[^a-zA-Z0-9\s-]', ''))) AS clean_brand,
  CAST(REGEXP_REPLACE(raw_estimated_spend, r'[^\d.]', '') AS NUMERIC) AS clean_spend_eur
FROM `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.lux_raw_marketing_leads_dirty`;
```

### 2.2 Defensive Type Casting with `SAFE_CAST`
`CAST('abc' AS INT64)` will crash a query if the value is non-numeric.
`SAFE_CAST('abc' AS INT64)` returns `NULL` safely without crashing the query job.

```sql
SELECT
  SAFE_CAST(REGEXP_REPLACE(raw_estimated_spend, r'[^\d.]', '') AS NUMERIC) AS safe_spend_eur
FROM `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.lux_raw_marketing_leads_dirty`;
```

### 2.3 Date & Timestamp Parsing
BigQuery supports powerful parsing functions for heterogeneous date formats:
- `PARSE_DATE('%Y-%m-%d', date_str)`
- `PARSE_DATE('%d/%m/%Y', date_str)`
- `PARSE_DATE('%b %d, %Y', date_str)`

```sql
SELECT
  CASE
    WHEN raw_date LIKE '%/%' THEN PARSE_DATE('%d/%m/%Y', raw_date)
    WHEN raw_date LIKE '%-%' THEN PARSE_DATE('%Y-%m-%d', raw_date)
    ELSE PARSE_DATE('%b %d, %Y', raw_date)
  END AS clean_signup_date
FROM `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.lux_raw_marketing_leads_dirty`;
```

### 2.4 Deduplication using `QUALIFY` and `ROW_NUMBER()`
BigQuery's `QUALIFY` clause filters window functions directly without needing nested subqueries!

```sql
SELECT
  lead_id,
  clean_email,
  clean_brand,
  clean_signup_date,
  clean_spend_eur
FROM (
  SELECT
    TRIM(raw_lead_id) AS lead_id,
    LOWER(TRIM(raw_email)) AS clean_email,
    INITCAP(TRIM(raw_brand)) AS clean_brand,
    signup_raw_date,
    raw_estimated_spend,
    lead_priority
  FROM `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.lux_raw_marketing_leads_dirty`
)
QUALIFY ROW_NUMBER() OVER(
  PARTITION BY clean_email 
  ORDER BY lead_priority ASC
) = 1;
```
