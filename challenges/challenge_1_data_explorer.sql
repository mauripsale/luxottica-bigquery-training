-- =============================================================================
-- HANDS-ON CHALLENGE #1: "THE DATA EXPLORER"
-- Target Duration: 20 Minutes (within Block 2: 16:00 - 16:45)
-- Target Audience: Luxottica Global Analytics & Business Analysts
-- =============================================================================

/*
BUSINESS CONTEXT:
The Luxottica Digital Commerce & Marketing team wants a quick performance audit 
of recent sales and ad campaign metrics to identify top revenue drivers.

INSTRUCTIONS:
Write standard SQL queries in BigQuery to answer the 4 business questions below.
Target Table 1: `luxottica_marketing_analytics.lux_online_orders`
Target Table 2: `luxottica_marketing_analytics.lux_ad_spend`
Target Table 3: `luxottica_marketing_analytics.lux_crm_customers`
*/

-- -----------------------------------------------------------------------------
-- QUESTION 1: Revenue by Brand
-- Which brand generated the highest total revenue in `lux_online_orders`?
-- Return: brand, total_orders, total_revenue_eur, sorted by total_revenue_eur DESC.
-- -----------------------------------------------------------------------------
-- WRITE YOUR SQL QUERY BELOW:





-- -----------------------------------------------------------------------------
-- QUESTION 2: Discount Impact Analysis
-- Calculate total revenue lost due to discounts per sales channel.
-- Return: channel, total_orders, sum_revenue_eur, sum_discounts_eur, discount_percentage
-- Hint: discount_percentage = (sum_discounts_eur / (sum_revenue_eur + sum_discounts_eur)) * 100
-- -----------------------------------------------------------------------------
-- WRITE YOUR SQL QUERY BELOW:





-- -----------------------------------------------------------------------------
-- QUESTION 3: High-Performing Ad Campaigns
-- Find all ad campaigns in `lux_ad_spend` where conversions exceed 100 
-- and spend is less than 3,000 EUR.
-- Return: campaign_name, platform, brand, spend_eur, conversions, cost_per_conversion (spend_eur / conversions).
-- -----------------------------------------------------------------------------
-- WRITE YOUR SQL QUERY BELOW:





-- -----------------------------------------------------------------------------
-- QUESTION 4: Loyalty Tier Revenue (Bonus)
-- Combine customer loyalty tier with orders to find total revenue per loyalty tier.
-- Hint: Needs a simple JOIN between `lux_crm_customers` and `lux_online_orders` on customer_id.
-- Return: loyalty_tier, total_customers, total_orders, total_revenue_eur.
-- -----------------------------------------------------------------------------
-- WRITE YOUR SQL QUERY BELOW:


