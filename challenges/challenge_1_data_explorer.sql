-- =============================================================================
-- HANDS-ON CHALLENGE #1: "THE DATA EXPLORER" (EXTENDED WORKBOOK)
-- Target Duration: 35 Minutes (Block 2: 16:10 - 16:45)
-- GCP Project ID: qwiklabs-gcp-04-9efaa47f1d21
-- Target Dataset: `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics`
-- =============================================================================

/*
BUSINESS CONTEXT:
The Luxottica Digital Commerce & Global Marketing Leadership team wants a 
thorough performance audit across brands, channels, product categories, and campaigns.

INSTRUCTIONS:
Solve the 8 business questions below by writing Standard SQL queries in BigQuery Studio.
*/

-- -----------------------------------------------------------------------------
-- PART A: E-COMMERCE & RETAIL SALES PERFORMANCE
-- -----------------------------------------------------------------------------

-- Q1: Total Revenue and Units Sold per Brand
-- Rank all Luxottica brands by total net revenue (`revenue_eur`), total units sold, 
-- and average order value (AOV = total revenue / total orders).
-- Sort by total revenue DESC.




-- Q2: Sales Channel Breakdown
-- Which sales channel (`channel`) drives the highest revenue? 
-- Show channel, total_orders, total_units, and total_revenue_eur.




-- Q3: High-Value E-Commerce Transactions
-- List all individual orders in `lux_online_orders` where `revenue_eur` is 
-- strictly greater than 300.00 EUR and the channel is 'E-Commerce Direct' or 'App'.
-- Show order_id, customer_id, brand, channel, product_category, and revenue_eur.





-- -----------------------------------------------------------------------------
-- PART B: MARKETING CAMPAIGN & AD EFFICIENCY
-- -----------------------------------------------------------------------------

-- Q4: Platform Performance (Google Ads vs Meta vs TikTok vs Pinterest vs YouTube)
-- Aggregate `lux_ad_spend` by `platform`. Calculate total_spend, total_impressions, 
-- total_clicks, total_conversions, and overall Click-Through Rate (CTR % = (clicks / impressions) * 100).




-- Q5: Top 5 Campaign Efficiency (Cost-Per-Conversion)
-- Identify the top 5 most cost-efficient ad campaigns (where conversions > 0).
-- Return campaign_name, platform, brand, total_spend, total_conversions, 
-- and cost_per_conversion (spend / conversions). Sort by cost_per_conversion ASC.





-- -----------------------------------------------------------------------------
-- PART C: DISCOUNT LEAKAGE & PROFITABILITY
-- -----------------------------------------------------------------------------

-- Q6: Discount Impact Analysis per Product Category
-- Calculate total revenue, total discounts given (`discount_amount_eur`), 
-- and the Effective Discount Percentage = (discounts / (revenue + discounts)) * 100 
-- for each `product_category`.




-- Q7: Regional Customer Segmentation
-- Count the total number of registered customers in `lux_crm_customers` 
-- grouped by `country` and `loyalty_tier`. Sort by country ASC and customer count DESC.





-- -----------------------------------------------------------------------------
-- PART D: ADVANCED CONDITIONAL METRICS (BONUS)
-- -----------------------------------------------------------------------------

-- Q8: Revenue Bucket Segmentation using CASE WHEN
-- Categorize orders into 3 spend tiers: 
--   - 'Low' (< 150 EUR)
--   - 'Medium' (150 - 300 EUR)
--   - 'High' (> 300 EUR)
-- Count how many orders and total revenue fall into each spend tier.


