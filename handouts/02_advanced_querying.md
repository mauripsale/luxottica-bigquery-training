# Module 02: Advanced Querying & Multi-Source Data Integration
**Luxottica Marketing Data Training**  
**GCP Project ID:** `qwiklabs-gcp-04-9efaa47f1d21` (`bigquery-luxottica`)  
**Date:** Oct 12th, 2026 | **Time:** 17:00 - 17:45 (Block 3)

---

## 1. Combining Data Across Platforms

When analyzing omni-channel campaigns at Luxottica (e.g., Ray-Ban or Oakley campaigns across Google Ads, Meta, and TikTok), data exists in separate tables or source feeds. SQL provides two primary mechanisms to combine data:

1. **Vertical Stacking (`UNION ALL` / `UNION DISTINCT`):** Appending rows with identical or similar schema from multiple sources.
2. **Horizontal Relationship (`JOIN`s):** Enriching rows side-by-side using shared key attributes (e.g., `customer_id`, `campaign_id`, or `brand`).

---

## 2. UNIONS: Stacking Multi-Source Feeds

### `UNION ALL` vs `UNION DISTINCT`
- `UNION ALL`: Combines all rows from both datasets without removing duplicate rows (faster and memory efficient).
- `UNION DISTINCT`: Combines rows and removes identical duplicate rows across all selected columns.

```sql
-- Example: Combining E-Commerce orders with Retail Store order feeds
SELECT 
  order_id, customer_id, brand, revenue_eur, 'E-Commerce' AS source_type
FROM `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.lux_online_orders`
WHERE channel = 'E-Commerce Direct'

UNION ALL

SELECT 
  order_id, customer_id, brand, revenue_eur, 'Retail Store' AS source_type
FROM `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.lux_online_orders`
WHERE channel = 'Retail Store';
```

---

## 3. JOINS: Connecting CRM, Orders, and Digital Ad Spend

### Types of SQL Joins
- **`INNER JOIN`**: Returns only matching keys present in both left and right tables.
- **`LEFT JOIN`**: Returns all records from the left table, and matching records from the right table (unmatched right values become `NULL`).
- **`FULL OUTER JOIN`**: Returns all records when there is a match in either left or right table.

---

## 4. Cross-Channel Analytics: Blending CRM, Orders & Marketing Spend

### Example 1: Full Customer Order History (CRM + Orders)
```sql
SELECT
  c.customer_id,
  CONCAT(c.first_name, ' ', c.last_name) AS full_name,
  c.country,
  c.loyalty_tier,
  c.preferred_brand,
  o.order_id,
  o.order_timestamp,
  o.product_category,
  COALESCE(o.revenue_eur, 0.0) AS order_revenue_eur
FROM
  `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.lux_crm_customers` c
LEFT JOIN
  `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.lux_online_orders` o
ON
  c.customer_id = o.customer_id
ORDER BY
  c.customer_id ASC, o.order_timestamp DESC;
```

### Example 2: ROAS (Return on Ad Spend) per Brand
Combining Marketing Ad Spend with Direct E-Commerce Revenue to measure campaign efficiency.

```sql
WITH BrandAdSpend AS (
  SELECT
    brand,
    SUM(spend_eur) AS total_ad_spend,
    SUM(impressions) AS total_impressions,
    SUM(clicks) AS total_clicks
  FROM `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.lux_ad_spend`
  GROUP BY brand
),

BrandRevenue AS (
  SELECT
    brand,
    SUM(revenue_eur) AS total_sales_revenue
  FROM `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.lux_online_orders`
  GROUP BY brand
)

SELECT
  s.brand,
  s.total_ad_spend,
  r.total_sales_revenue,
  ROUND(SAFE_DIVIDE(r.total_sales_revenue, s.total_ad_spend), 2) AS roas_ratio
FROM BrandAdSpend s
LEFT JOIN BrandRevenue r
  ON s.brand = r.brand
ORDER BY roas_ratio DESC;
```
