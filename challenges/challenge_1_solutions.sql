-- =============================================================================
-- HANDS-ON CHALLENGE #1 SOLUTIONS: "THE DATA EXPLORER"
-- Luxottica Marketing Analytics Workshop
-- GCP Project ID: qwiklabs-gcp-04-9efaa47f1d21
-- Target Dataset: `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics`
-- =============================================================================

-- Q1: Total Revenue and Units Sold per Brand
SELECT
  brand,
  COUNT(order_id) AS total_orders,
  SUM(units_sold) AS total_units_sold,
  ROUND(SUM(revenue_eur), 2) AS total_revenue_eur,
  ROUND(SAFE_DIVIDE(SUM(revenue_eur), COUNT(order_id)), 2) AS avg_order_value_eur
FROM
  `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.lux_online_orders`
GROUP BY
  brand
ORDER BY
  total_revenue_eur DESC;

-- Q2: Sales Channel Breakdown
SELECT
  channel,
  COUNT(order_id) AS total_orders,
  SUM(units_sold) AS total_units,
  ROUND(SUM(revenue_eur), 2) AS total_revenue_eur
FROM
  `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.lux_online_orders`
GROUP BY
  channel
ORDER BY
  total_revenue_eur DESC;

-- Q3: High-Value E-Commerce Transactions
SELECT
  order_id,
  customer_id,
  brand,
  channel,
  product_category,
  revenue_eur
FROM
  `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.lux_online_orders`
WHERE
  revenue_eur > 300.00
  AND channel IN ('E-Commerce Direct', 'App')
ORDER BY
  revenue_eur DESC;

-- Q4: Platform Performance
SELECT
  platform,
  ROUND(SUM(spend_eur), 2) AS total_spend_eur,
  SUM(impressions) AS total_impressions,
  SUM(clicks) AS total_clicks,
  SUM(conversions) AS total_conversions,
  ROUND(SAFE_DIVIDE(SUM(clicks), SUM(impressions)) * 100, 2) AS ctr_percentage
FROM
  `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.lux_ad_spend`
GROUP BY
  platform
ORDER BY
  total_spend_eur DESC;

-- Q5: Top 5 Campaign Efficiency (Cost-Per-Conversion)
SELECT
  campaign_name,
  platform,
  brand,
  ROUND(SUM(spend_eur), 2) AS total_spend_eur,
  SUM(conversions) AS total_conversions,
  ROUND(SAFE_DIVIDE(SUM(spend_eur), SUM(conversions)), 2) AS cost_per_conversion
FROM
  `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.lux_ad_spend`
GROUP BY
  campaign_name, platform, brand
HAVING
  total_conversions > 0
ORDER BY
  cost_per_conversion ASC
LIMIT 5;

-- Q6: Discount Impact Analysis per Product Category
SELECT
  product_category,
  ROUND(SUM(revenue_eur), 2) AS total_revenue_eur,
  ROUND(SUM(discount_amount_eur), 2) AS total_discounts_eur,
  ROUND(
    SAFE_DIVIDE(SUM(discount_amount_eur), (SUM(revenue_eur) + SUM(discount_amount_eur))) * 100, 
    2
  ) AS effective_discount_pct
FROM
  `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.lux_online_orders`
GROUP BY
  product_category
ORDER BY
  total_discounts_eur DESC;

-- Q7: Regional Customer Segmentation
SELECT
  country,
  loyalty_tier,
  COUNT(customer_id) AS total_customers
FROM
  `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.lux_crm_customers`
GROUP BY
  country, loyalty_tier
ORDER BY
  country ASC, total_customers DESC;

-- Q8: Revenue Bucket Segmentation using CASE WHEN
SELECT
  CASE
    WHEN revenue_eur < 150.00 THEN 'Low (< 150 EUR)'
    WHEN revenue_eur BETWEEN 150.00 AND 300.00 THEN 'Medium (150-300 EUR)'
    ELSE 'High (> 300 EUR)'
  END AS spend_tier,
  COUNT(order_id) AS total_orders,
  ROUND(SUM(revenue_eur), 2) AS total_revenue_eur
FROM
  `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.lux_online_orders`
GROUP BY
  spend_tier
ORDER BY
  total_revenue_eur DESC;
