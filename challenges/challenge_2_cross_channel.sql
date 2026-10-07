-- =============================================================================
-- HANDS-ON CHALLENGE #2: "CROSS-CHANNEL MARKETING INTELLIGENCE"
-- Target Duration: 25 Minutes (Block 3: 17:20 - 17:45)
-- GCP Project ID: qwiklabs-gcp-04-9efaa47f1d21
-- Target Dataset: `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics`
-- =============================================================================

/*
BUSINESS CONTEXT:
In Block 3, we learn how to break data silos by joining internal CRM records 
with E-Commerce orders and multi-platform Ad Spend.

INSTRUCTIONS:
Solve the 4 multi-table business analytics questions below using UNIONS, JOINS, and CTEs (`WITH` clauses).
*/

-- -----------------------------------------------------------------------------
-- Q1: Customer Lifetime Value (LTV) by Loyalty Tier
-- Join `lux_crm_customers` with `lux_online_orders` on `customer_id`.
-- Calculate total customers, total orders placed, total sales revenue, 
-- and average spending per customer for each `loyalty_tier`.




-- Q2: Full Omni-Channel Transaction Log (UNION ALL)
-- Combine E-Commerce Direct sales with Retail Store sales into a single unified stream.
-- Include order_id, customer_id, brand, revenue_eur, and a constant string column `channel_type`.




-- Q3: Multi-Platform Brand ROAS (Return on Ad Spend)
-- Calculate ROAS per brand across all digital platforms (Google Ads, Meta, TikTok, etc.).
-- Formula: ROAS = Total E-Commerce Revenue / Total Ad Spend
-- Hint: Use two CTEs (one for Ad Spend, one for Revenue) and LEFT JOIN them on `brand`.




-- Q4: Customer Brand Preference Alignment (Cross-Sell Opportunity)
-- Find orders where the purchased order `brand` does NOT match the customer's `preferred_brand` in CRM.
-- Return customer_id, full_name (CONCAT first and last name), country, preferred_brand, and purchased_brand.


