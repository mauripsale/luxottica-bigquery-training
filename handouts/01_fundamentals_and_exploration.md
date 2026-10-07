# Module 01 & 02: BigQuery Fundamentals & Data Exploration
**Luxottica Marketing Data Training**
**Date:** Oct 12th, 2026 | **Time:** 15:30 - 16:45

---

## 1. Enterprise Data Warehouse vs. Spreadsheets

| Dimension | Spreadsheets (Excel / Google Sheets) | Enterprise Data Warehouse (Google BigQuery) |
| :--- | :--- | :--- |
| **Data Volume Limit** | ~1 Million rows per tab | Billions / Petabytes of rows |
| **Processing Speed** | Slows down / freezes with >100k rows | Sub-second response on millions of rows |
| **Data Integrity** | Prone to manual overwrites & broken formulas | Immutable raw storage, strict schemas, audit logs |
| **Concurrency** | File locking, version conflicts | Thousands of concurrent analytical queries |
| **Cost Model** | Software licensing | Serverless, pay-per-query / slot reservation |

---

## 2. Navigating the BigQuery Console

1. **GCP Console URL:** `https://console.cloud.google.com/bigquery`
2. **Project Hierarchy:** `Organization > Project ID > Dataset ID > Table / View`
3. **Key Console Areas:**
   - **Explorer Pane (Left):** Search datasets, tables, view schemas & metadata.
   - **Query Editor (Center):** Write standard SQL queries, format code, view real-time syntax validation.
   - **Results Pane (Bottom):** View query output, job history, execution details (slot time, bytes processed), save results to CSV/GCS/Looker Studio.

---

## 3. SQL Query Fundamentals (Module 02)

### 3.1 Basic Syntax Structure
```sql
SELECT
    column_1,
    column_2,
    AGGREGATE_FUNCTION(column_3) AS metric_alias
FROM
    `project_id.dataset_id.table_name`
WHERE
    filter_condition
GROUP BY
    column_1,
    column_2
HAVING
    aggregate_condition
ORDER BY
    metric_alias DESC
LIMIT 100;
```

### 3.2 Core Analytical Queries for Luxottica

#### Query 1: Exploring Brand Revenue & Order Volume
```sql
SELECT
  brand,
  COUNT(order_id) AS total_orders,
  SUM(units_sold) AS total_units,
  ROUND(SUM(revenue_eur), 2) AS total_revenue_eur,
  ROUND(AVG(revenue_eur), 2) AS avg_order_value_eur
FROM
  `luxottica_marketing_analytics.lux_online_orders`
GROUP BY
  brand
ORDER BY
  total_revenue_eur DESC;
```

#### Query 2: Filtering Top Performing Sales Channels
```sql
SELECT
  channel,
  product_category,
  COUNT(order_id) AS total_orders,
  SUM(revenue_eur) AS total_revenue
FROM
  `luxottica_marketing_analytics.lux_online_orders`
WHERE
  revenue_eur >= 150.00
GROUP BY
  channel,
  product_category
ORDER BY
  total_revenue DESC;
```

#### Query 3: Customer Segmentation by Country & Loyalty Tier
```sql
SELECT
  country,
  loyalty_tier,
  COUNT(customer_id) AS customer_count
FROM
  `luxottica_marketing_analytics.lux_crm_customers`
GROUP BY
  country,
  loyalty_tier
ORDER BY
  country ASC,
  customer_count DESC;
```
