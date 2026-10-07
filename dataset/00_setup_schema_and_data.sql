-- =============================================================================
-- LUXOTTICA MARKETING ANALYTICS - MASSIVE ENTERPRISE MOCK DATASET (116,000+ ROWS)
-- Course: Mastering Marketing Data with BigQuery SQL
-- GCP Project ID: qwiklabs-gcp-04-9efaa47f1d21
-- Project Name: bigquery-luxottica
-- Target Dataset: `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics`
-- =============================================================================

CREATE SCHEMA IF NOT EXISTS `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics`
OPTIONS(location="US");

-- -----------------------------------------------------------------------------
-- 1. CRM CUSTOMERS MASTER TABLE (10,000 Global Customers)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE TABLE `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.lux_crm_customers` AS
WITH customer_generator AS (
  SELECT
    id,
    CONCAT('CUST-', LPAD(CAST(id AS STRING), 6, '0')) AS customer_id,
    ['Marco', 'Sophie', 'John', 'Elena', 'Kenji', 'Emma', 'Luca', 'Michael', 'Giulia', 'Chloe', 'Alessandro', 'Isabella', 'David', 'Camille', 'Hiroshi', 'Matteo', 'Sarah', 'Antoine', 'Yuki', 'Federico'][ORDINAL(MOD(id, 20) + 1)] AS first_name,
    ['Rossi', 'Dubois', 'Smith', 'Bianchi', 'Takahashi', 'Watson', 'Ferrari', 'Brown', 'Romano', 'Leroy', 'Ricci', 'Garcia', 'Mueller', 'Schneider', 'Sato', 'Moretti', 'Taylor', 'Bernard', 'Tanaka', 'Esposito'][ORDINAL(MOD(id * 7, 20) + 1)] AS last_name,
    ['IT', 'US', 'FR', 'UK', 'DE', 'JP', 'ES', 'BR', 'CA', 'AU'][ORDINAL(MOD(ABS(FARM_FINGERPRINT(CAST(id AS STRING))), 10) + 1)] AS country,
    DATE_SUB(DATE '2026-09-30', INTERVAL MOD(ABS(FARM_FINGERPRINT(CAST(id * 3 AS STRING))), 1000) DAY) AS signup_date,
    ['Ray-Ban', 'Oakley', 'Persol', 'Oliver Peoples', 'Vogue Eyewear', 'Costa', 'Sunglass Hut', 'Alain Mikli', 'Arnette', 'Target Optical'][ORDINAL(MOD(id, 10) + 1)] AS preferred_brand,
    CASE 
      WHEN MOD(id, 20) = 0 THEN 'VIP'
      WHEN MOD(id, 5) = 0 THEN 'Gold'
      WHEN MOD(id, 2) = 0 THEN 'Silver'
      ELSE 'Standard'
    END AS loyalty_tier
  FROM UNNEST(GENERATE_ARRAY(1, 10000)) AS id
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
FROM customer_generator;

-- -----------------------------------------------------------------------------
-- 2. ONLINE & RETAIL ORDERS TABLE (100,000 Transactions)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE TABLE `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.lux_online_orders` AS
WITH order_generator AS (
  SELECT
    id,
    CONCAT('ORD-', LPAD(CAST(id AS STRING), 8, '0')) AS order_id,
    CONCAT('CUST-', LPAD(CAST(MOD(ABS(FARM_FINGERPRINT(CAST(id * 13 AS STRING))), 10000) + 1 AS STRING), 6, '0')) AS customer_id,
    TIMESTAMP_SUB(TIMESTAMP '2026-09-30 23:59:59 UTC', INTERVAL MOD(ABS(FARM_FINGERPRINT(CAST(id AS STRING))), 900) * 15 MINUTE) AS order_timestamp,
    ['Ray-Ban', 'Oakley', 'Persol', 'Oliver Peoples', 'Vogue Eyewear', 'Costa', 'Sunglass Hut', 'Alain Mikli', 'Arnette', 'Target Optical'][ORDINAL(MOD(id, 10) + 1)] AS brand,
    ['Sunglasses', 'Optical Frames', 'Prescription Lenses', 'Smart Glasses (Ray-Ban Meta)', 'Accessories'][ORDINAL(MOD(id, 5) + 1)] AS product_category,
    ['E-Commerce Direct', 'Retail Store', 'Mobile App', 'Affiliate Network', 'Wholesale Partner'][ORDINAL(MOD(id, 5) + 1)] AS channel,
    (MOD(id, 4) + 1) AS units_sold,
    ROUND(90.00 + (MOD(ABS(FARM_FINGERPRINT(CAST(id * 19 AS STRING))), 45000) / 10.0), 2) AS gross_amount_eur,
    CASE 
      WHEN MOD(id, 4) = 0 THEN ROUND((90.00 + (MOD(ABS(FARM_FINGERPRINT(CAST(id * 19 AS STRING))), 45000) / 10.0)) * 0.15, 2)
      WHEN MOD(id, 7) = 0 THEN ROUND((90.00 + (MOD(ABS(FARM_FINGERPRINT(CAST(id * 19 AS STRING))), 45000) / 10.0)) * 0.25, 2)
      ELSE 0.00
    END AS discount_amount_eur
  FROM UNNEST(GENERATE_ARRAY(1, 100000)) AS id
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
FROM order_generator;

-- -----------------------------------------------------------------------------
-- 3. MULTI-CHANNEL AD SPEND TABLE (5,000 Daily Campaign Logs)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE TABLE `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.lux_ad_spend` AS
WITH campaign_generator AS (
  SELECT
    id,
    CONCAT('CMP-', LPAD(CAST(id AS STRING), 5, '0')) AS campaign_id,
    CONCAT(
      ['RB_Wayfarer', 'OK_Prizm_Sport', 'PS_Handmade_Heritage', 'OP_Luxury_Eyewear', 'VG_Fashion_Style', 'Costa_Water_Polarized', 'SGH_Summer_Promo'][ORDINAL(MOD(id, 7) + 1)],
      '_',
      ['US', 'EU_IT', 'EU_FR', 'EU_DE', 'UK', 'APAC_JP', 'GLOBAL'][ORDINAL(MOD(id * 3, 7) + 1)],
      '_2026'
    ) AS campaign_name,
    ['Google Search', 'Google Shopping', 'Meta Instagram', 'Meta Facebook', 'TikTok', 'Pinterest', 'YouTube', 'Amazon Ads', 'Snapchat', 'Criteo'][ORDINAL(MOD(id, 10) + 1)] AS platform,
    DATE_SUB(DATE '2026-09-30', INTERVAL MOD(id, 365) DAY) AS date,
    ['Ray-Ban', 'Oakley', 'Persol', 'Oliver Peoples', 'Vogue Eyewear', 'Costa', 'Sunglass Hut', 'Alain Mikli', 'Arnette', 'Target Optical'][ORDINAL(MOD(id, 10) + 1)] AS brand,
    10000 + MOD(ABS(FARM_FINGERPRINT(CAST(id * 23 AS STRING))), 90000) AS impressions,
    300 + MOD(ABS(FARM_FINGERPRINT(CAST(id * 29 AS STRING))), 4700) AS clicks,
    ROUND(400.00 + (MOD(ABS(FARM_FINGERPRINT(CAST(id * 31 AS STRING))), 360000) / 100.0), 2) AS spend_eur,
    10 + MOD(ABS(FARM_FINGERPRINT(CAST(id * 37 AS STRING))), 240) AS conversions
  FROM UNNEST(GENERATE_ARRAY(1, 5000)) AS id
)
SELECT * FROM campaign_generator;

-- -----------------------------------------------------------------------------
-- 4. RAW DIRTY MARKETING LEADS TABLE (1,000 Messy Lead Records)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE TABLE `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.lux_raw_marketing_leads_dirty` AS
WITH dirty_generator AS (
  SELECT
    id,
    -- Messy IDs with padding
    CASE WHEN MOD(id, 3) = 0 THEN CONCAT(' LEAD_', LPAD(CAST(id AS STRING), 5, '0'), ' ') ELSE CONCAT('LEAD_', LPAD(CAST(id AS STRING), 5, '0')) END AS raw_lead_id,
    
    -- Messy emails (uppercase, trailing spaces, invalid missing @)
    CASE 
      WHEN MOD(id, 25) = 0 THEN CONCAT('invalid_email_format_', id)
      WHEN MOD(id, 2) = 0 THEN UPPER(CONCAT('  user_', id, '@LUXMAIL.COM '))
      ELSE LOWER(CONCAT('user_', id, '@luxmail.com  '))
    END AS raw_email,
    
    -- Unstandardized Brand Names
    ['ray ban', 'Ray-Ban ', 'PERSOL', 'Persol', 'oakley', 'OAKLEY', 'oliver peoples', 'Vogue Eyewear', 'vogue', ' Sunglass Hut '][ORDINAL(MOD(id, 10) + 1)] AS raw_brand,
    
    -- Heterogeneous Date formats
    CASE 
      WHEN MOD(id, 3) = 0 THEN FORMAT_DATE('%d/%m/%Y', DATE_SUB(DATE '2026-09-30', INTERVAL MOD(id, 60) DAY))
      WHEN MOD(id, 3) = 1 THEN FORMAT_DATE('%Y-%m-%d', DATE_SUB(DATE '2026-09-30', INTERVAL MOD(id, 60) DAY))
      ELSE FORMAT_DATE('%b %d, %Y', DATE_SUB(DATE '2026-09-30', INTERVAL MOD(id, 60) DAY))
    END AS signup_raw_date,
    
    -- Messy Currency strings
    CASE 
      WHEN MOD(id, 4) = 0 THEN CONCAT(' € ', CAST(100 + MOD(id * 17, 400) AS STRING), '.00 ')
      WHEN MOD(id, 4) = 1 THEN CONCAT(CAST(100 + MOD(id * 17, 400) AS STRING), '.50 EUR')
      WHEN MOD(id, 4) = 2 THEN CONCAT('- ', CAST(50 + MOD(id, 100) AS STRING), '.00') -- Negative invalid spend
      ELSE CAST(100 + MOD(id * 17, 400) AS STRING)
    END AS raw_estimated_spend,
    
    ['IT', 'US', 'FR', 'UK', 'DE', 'JP'][ORDINAL(MOD(id, 6) + 1)] AS raw_country,
    MOD(id, 4) + 1 AS lead_priority
  FROM UNNEST(GENERATE_ARRAY(1, 1000)) AS id
)
SELECT * FROM dirty_generator;
