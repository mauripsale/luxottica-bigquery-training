-- =============================================================================
-- LUXOTTICA MARKETING ANALYTICS - RICH 3-HOUR TRAINING DATASET SETUP
-- Course: Mastering Marketing Data with BigQuery SQL
-- GCP Project ID: qwiklabs-gcp-04-9efaa47f1d21
-- Project Name: bigquery-luxottica
-- Target Dataset: `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics`
-- =============================================================================

CREATE SCHEMA IF NOT EXISTS `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics`
OPTIONS(location="US");

-- -----------------------------------------------------------------------------
-- 1. CRM CUSTOMERS MASTER TABLE (50 Customers across IT, US, FR, UK, DE, JP)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE TABLE `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.lux_crm_customers` AS
WITH customer_seed AS (
  SELECT
    CONCAT('CUST-', LPAD(CAST(id AS STRING), 4, '0')) AS customer_id,
    ['Marco', 'Sophie', 'John', 'Elena', 'Kenji', 'Emma', 'Luca', 'Michael', 'Giulia', 'Chloe'][MOD(id, 10) + 1] AS first_name,
    ['Rossi', 'Dubois', 'Smith', 'Bianchi', 'Takahashi', 'Watson', 'Ferrari', 'Brown', 'Romano', 'Leroy'][MOD(id * 3, 10) + 1] AS last_name,
    ['IT', 'US', 'FR', 'UK', 'DE', 'JP'][MOD(id, 6) + 1] AS country,
    DATE_SUB(DATE '2026-09-01', INTERVAL id * 12 DAY) AS signup_date,
    ['Ray-Ban', 'Oakley', 'Persol', 'Oliver Peoples', 'Vogue Eyewear'][MOD(id, 5) + 1] AS preferred_brand,
    ['Standard', 'Silver', 'Gold', 'VIP'][MOD(id, 4) + 1] AS loyalty_tier
  FROM UNNEST(GENERATE_ARRAY(1, 50)) AS id
)
SELECT
  customer_id,
  first_name,
  last_name,
  LOWER(CONCAT(first_name, '.', last_name, id, '@email.com')) AS email,
  country,
  signup_date,
  preferred_brand,
  loyalty_tier
FROM customer_seed;

-- -----------------------------------------------------------------------------
-- 2. ONLINE & RETAIL ORDERS TABLE (120 Transactions across channels)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE TABLE `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.lux_online_orders` AS
WITH order_seed AS (
  SELECT
    CONCAT('ORD-', LPAD(CAST(id AS STRING), 4, '0')) AS order_id,
    CONCAT('CUST-', LPAD(CAST(MOD(id * 7, 50) + 1 AS STRING), 4, '0')) AS customer_id,
    TIMESTAMP_SUB(TIMESTAMP '2026-09-30 23:59:59 UTC', INTERVAL id * 6 HOUR) AS order_timestamp,
    ['Ray-Ban', 'Oakley', 'Persol', 'Oliver Peoples', 'Vogue Eyewear'][MOD(id, 5) + 1] AS brand,
    ['Sunglasses', 'Optical', 'Custom Remedial', 'Accessories'][MOD(id, 4) + 1] AS product_category,
    ['E-Commerce Direct', 'Retail Store', 'App', 'Affiliate', 'Wholesale'][MOD(id, 5) + 1] AS channel,
    MOD(id, 3) + 1 AS units_sold,
    ROUND(120.00 + (MOD(id * 17, 350)), 2) AS gross_amount_eur,
    CASE WHEN MOD(id, 3) = 0 THEN ROUND(15.00 + (MOD(id, 5) * 5), 2) ELSE 0.00 END AS discount_amount_eur
  FROM UNNEST(GENERATE_ARRAY(1, 120)) AS id
)
SELECT
  order_id,
  customer_id,
  order_timestamp,
  brand,
  product_category,
  channel,
  units_sold,
  (gross_amount_eur - discount_amount_eur) AS revenue_eur,
  discount_amount_eur
FROM order_seed;

-- -----------------------------------------------------------------------------
-- 3. MULTI-CHANNEL AD SPEND TABLE (60 Daily Campaign Records across Platforms)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE TABLE `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.lux_ad_spend` AS
WITH campaign_seed AS (
  SELECT
    CONCAT('CMP-', LPAD(CAST(id AS STRING), 3, '0')) AS campaign_id,
    ['RB_Wayfarer_Summer2026', 'OK_Prizm_Sport_US', 'PS_Handmade_Heritage_IT', 'OP_Luxury_Fall2026', 'VG_Fashion_Style_FR'][MOD(id, 5) + 1] AS campaign_name,
    ['Google Ads', 'Meta', 'TikTok', 'Pinterest', 'YouTube'][MOD(id, 5) + 1] AS platform,
    DATE_SUB(DATE '2026-09-30', INTERVAL MOD(id, 30) DAY) AS date,
    ['Ray-Ban', 'Oakley', 'Persol', 'Oliver Peoples', 'Vogue Eyewear'][MOD(id, 5) + 1] AS brand,
    15000 + (MOD(id * 1234, 50000)) AS impressions,
    500 + (MOD(id * 432, 2500)) AS clicks,
    ROUND(800.00 + (MOD(id * 97, 2200)), 2) AS spend_eur,
    20 + (MOD(id * 23, 130)) AS conversions
  FROM UNNEST(GENERATE_ARRAY(1, 60)) AS id
)
SELECT * FROM campaign_seed;

-- -----------------------------------------------------------------------------
-- 4. RAW DIRTY MARKETING LEADS TABLE (30 Messy Lead Records for Wrangling)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE TABLE `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.lux_raw_marketing_leads_dirty` AS
SELECT * FROM UNNEST([
  STRUCT(' LEAD_001 ' AS raw_lead_id, '  MARCO.ROSSI@EMAIL.COM ' AS raw_email, 'Ray-Ban ' AS raw_brand, '2026-09-01' AS signup_raw_date, ' € 175.00 ' AS raw_estimated_spend, 'IT' AS raw_country, 1 AS lead_priority),
  STRUCT('LEAD_002', 'sophie.dubois@email.fr', 'PERSOL', '02/09/2026', '280.00', 'FR', 2),
  STRUCT('LEAD_003', 'JOHN.SMITH@EMAIL.COM', 'ray ban', '2026/09/03', '€320.00', 'US', 1),
  STRUCT('LEAD_001', 'marco.rossi@email.com', 'Ray-Ban', '2026-09-01', '175', 'IT', 2), -- Duplicate
  STRUCT('LEAD_004', 'invalid-email-format', 'Oakley', '2026-09-04', 'NULL', 'US', 3), -- Invalid email
  STRUCT('LEAD_005', 'elena.b@email.it  ', '  Persol ', 'Sep 05, 2026', ' € 450,50 ', 'IT', 1),
  STRUCT('LEAD_006', 'kenji.t@email.jp', 'OLIVER PEOPLES', '2026-09-06', '410.00 EUR', 'JP', 1),
  STRUCT('LEAD_007', '  chloe.l@email.fr', 'vogue eyewear', '2026-09-07', '-50.00', 'FR', 2), -- Negative spend
  STRUCT('LEAD_008', 'LUCA.FERRARI@EMAIL.IT', 'Ray-Ban', '08-09-2026', '195.00', 'IT', 1),
  STRUCT('LEAD_009', 'emma.w@email.co.uk ', 'VOGUE', '2026-09-09', ' € 135.00 ', 'UK', 1),
  STRUCT('LEAD_010', 'mbrown@email.com', 'oakley', '2026/09/10', '250.00', 'US', 2),
  STRUCT('LEAD_011', ' g.romano@email.it ', 'Ray Ban', 'Sep 11, 2026', '€ 195,00', 'IT', 1),
  STRUCT('LEAD_012', 'chloe.l@email.fr', 'Vogue Eyewear', '2026-09-12', '210.00', 'FR', 1), -- Duplicate Chloe
  STRUCT('LEAD_013', 'bad_lead_no_at_symbol', 'Persol', '2026-09-13', '100.00', 'DE', 4),
  STRUCT('LEAD_014', 'hans.m@email.de', 'PERSOL', '14/09/2026', '€ 310.00', 'DE', 1),
  STRUCT('LEAD_015', '  taro.s@email.jp  ', 'Oliver Peoples ', '2026-09-15', '500.00 EUR', 'JP', 1)
]);
