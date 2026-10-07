-- =============================================================================
-- HANDS-ON CHALLENGE #1 SOLUTIONS: "THE DATA EXPLORER"
-- Luxottica Marketing Analytics Workshop
-- =============================================================================

-- -----------------------------------------------------------------------------
-- SOLUTION 1: Revenue by Brand
-- -----------------------------------------------------------------------------
SELECT
  brand,
  COUNT(order_id) AS total_orders,
  ROUND(SUM(revenue_eur), 2) AS total_revenue_eur
FROM
  `luxottica_marketing_analytics.lux_online_orders`
GROUP BY
  brand
ORDER BY
  total_revenue_eur DESC;

-- -----------------------------------------------------------------------------
-- SOLUTION 2: Discount Impact Analysis
-- -----------------------------------------------------------------------------
SELECT
  channel,
  COUNT(order_id) AS total_orders,
  ROUND(SUM(revenue_eur), 2) AS sum_revenue_eur,
  ROUND(SUM(discount_amount_eur), 2) AS sum_discounts_eur,
  ROUND(
    SAFE_DIVIDE(SUM(discount_amount_eur), (SUM(revenue_eur) + SUM(discount_amount_eur))) * 100, 
    2
  ) AS discount_percentage
FROM
  `luxottica_marketing_analytics.lux_online_orders`
GROUP BY
  channel
ORDER BY
  sum_discounts_eur DESC;

-- -----------------------------------------------------------------------------
-- SOLUTION 3: High-Performing Ad Campaigns
-- -----------------------------------------------------------------------------
SELECT
  campaign_name,
  platform,
  brand,
  spend_eur,
  conversions,
  ROUND(SAFE_DIVIDE(spend_eur, conversions), 2) AS cost_per_conversion
FROM
  `luxottica_marketing_analytics.lux_ad_spend`
WHERE
  conversions > 100
  AND spend_eur < 3000.00
ORDER BY
  cost_per_conversion ASC;

-- -----------------------------------------------------------------------------
-- SOLUTION 4: Loyalty Tier Revenue (Bonus)
-- -----------------------------------------------------------------------------
SELECT
  c.loyalty_tier,
  COUNT(DISTINCT c.customer_id) AS total_customers,
  COUNT(o.order_id) AS total_orders,
  ROUND(SUM(o.revenue_eur), 2) AS total_revenue_eur
FROM
  `luxottica_marketing_analytics.lux_crm_customers` c
JOIN
  `luxottica_marketing_analytics.lux_online_orders` o
ON
  c.customer_id = o.customer_id
GROUP BY
  c.loyalty_tier
ORDER BY
  total_revenue_eur DESC;
