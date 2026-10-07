-- =============================================================================
-- HANDS-ON CHALLENGE #2 SOLUTIONS: "CROSS-CHANNEL MARKETING INTELLIGENCE"
-- Luxottica Marketing Analytics Workshop
-- GCP Project ID: qwiklabs-gcp-04-9efaa47f1d21
-- Target Dataset: `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics`
-- =============================================================================

-- Q1: Customer Lifetime Value (LTV) by Loyalty Tier
SELECT
  c.loyalty_tier,
  COUNT(DISTINCT c.customer_id) AS total_customers,
  COUNT(o.order_id) AS total_orders,
  ROUND(SUM(o.revenue_eur), 2) AS total_sales_revenue_eur,
  ROUND(SAFE_DIVIDE(SUM(o.revenue_eur), COUNT(DISTINCT c.customer_id)), 2) AS avg_spend_per_customer_eur
FROM
  `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.lux_crm_customers` c
LEFT JOIN
  `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.lux_online_orders` o
ON
  c.customer_id = o.customer_id
GROUP BY
  c.loyalty_tier
ORDER BY
  total_sales_revenue_eur DESC;

-- Q2: Full Omni-Channel Transaction Log (UNION ALL)
SELECT 
  order_id, customer_id, brand, revenue_eur, 'E-Commerce Direct' AS channel_type
FROM `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.lux_online_orders`
WHERE channel = 'E-Commerce Direct'

UNION ALL

SELECT 
  order_id, customer_id, brand, revenue_eur, 'Retail Store' AS channel_type
FROM `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.lux_online_orders`
WHERE channel = 'Retail Store';

-- Q3: Multi-Platform Brand ROAS (Return on Ad Spend)
WITH BrandAdSpend AS (
  SELECT
    brand,
    SUM(spend_eur) AS total_ad_spend_eur,
    SUM(clicks) AS total_clicks,
    SUM(conversions) AS total_conversions
  FROM
    `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.lux_ad_spend`
  GROUP BY brand
),

BrandRevenue AS (
  SELECT
    brand,
    SUM(revenue_eur) AS total_sales_revenue_eur
  FROM
    `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.lux_online_orders`
  GROUP BY brand
)

SELECT
  s.brand,
  ROUND(s.total_ad_spend_eur, 2) AS total_ad_spend_eur,
  ROUND(COALESCE(r.total_sales_revenue_eur, 0.0), 2) AS total_sales_revenue_eur,
  ROUND(SAFE_DIVIDE(r.total_sales_revenue_eur, s.total_ad_spend_eur), 2) AS roas_ratio
FROM BrandAdSpend s
LEFT JOIN BrandRevenue r
  ON s.brand = r.brand
ORDER BY roas_ratio DESC;

-- Q4: Customer Brand Preference Alignment (Cross-Sell Opportunity)
SELECT
  c.customer_id,
  CONCAT(c.first_name, ' ', c.last_name) AS full_name,
  c.country,
  c.preferred_brand AS crm_preferred_brand,
  o.brand AS purchased_brand,
  o.revenue_eur
FROM
  `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.lux_crm_customers` c
JOIN
  `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.lux_online_orders` o
ON
  c.customer_id = o.customer_id
WHERE
  c.preferred_brand != o.brand
ORDER BY
  o.revenue_eur DESC;
