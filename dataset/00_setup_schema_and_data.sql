-- =============================================================================
-- LUXOTTICA MARKETING ANALYTICS - GOOGLE HERO DATA STORYTELLING DATASET (116,000+ ROWS)
-- Course: Mastering Marketing Data with BigQuery SQL (Google Ecosystem Edition)
-- Storyline: "Unlocking High-ROAS Google Ads Growth & Capturing Ray-Ban Meta Search Demand"
-- GCP Project ID: qwiklabs-gcp-04-9efaa47f1d21
-- Target Dataset: `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics`
-- =============================================================================

CREATE SCHEMA IF NOT EXISTS `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics`
OPTIONS(location="US");

-- -----------------------------------------------------------------------------
-- 1. CRM CUSTOMERS MASTER TABLE (10,000 Global Customers)
-- Embedded Story Insight: VIP & Gold tier customers love Oliver Peoples & Ray-Ban Meta
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
      WHEN MOD(id, 15) = 0 THEN 'VIP'
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
-- Embedded Story Insight: Smart Glasses & Luxury frames have high AOV (>300 EUR)
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
    (MOD(id, 3) + 1) AS units_sold,
    
    -- Story AOV rules: Oliver Peoples & Smart Glasses = High Price (320-480 EUR)
    CASE 
      WHEN MOD(id, 10) = 3 THEN ROUND(320.00 + (MOD(id * 17, 160)), 2) -- Oliver Peoples
      WHEN MOD(id, 5) = 3 THEN ROUND(299.00 + (MOD(id * 19, 120)), 2) -- Smart Glasses Ray-Ban Meta
      WHEN MOD(id, 10) = 4 THEN ROUND(85.00 + (MOD(id * 11, 55)), 2)   -- Vogue
      ELSE ROUND(140.00 + (MOD(ABS(FARM_FINGERPRINT(CAST(id * 19 AS STRING))), 15000) / 100.0), 2)
    END AS gross_amount_eur,
    
    CASE 
      WHEN MOD(id, 10) = 0 THEN ROUND(20.00 + MOD(id, 15), 2)
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
-- Embedded Story Insight: Google Search & Shopping = Massive High ROAS (>6.8x)
-- Competitor third-party social (TikTok/Criteo) = Wasteful low ROAS (<0.8x)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE TABLE `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.lux_ad_spend` AS
WITH campaign_generator AS (
  SELECT
    id,
    CONCAT('CMP-', LPAD(CAST(id AS STRING), 5, '0')) AS campaign_id,
    CONCAT(
      ['RB_Wayfarer_Smart', 'OK_Prizm_Sport', 'PS_Handmade_Heritage', 'OP_Luxury_Eyewear', 'VG_Fashion_Style', 'Costa_Water_Polarized', 'SGH_Summer_Promo'][ORDINAL(MOD(id, 7) + 1)],
      '_',
      ['US', 'EU_IT', 'EU_FR', 'EU_DE', 'UK', 'APAC_JP', 'GLOBAL'][ORDINAL(MOD(id * 3, 7) + 1)],
      '_2026'
    ) AS campaign_name,
    ['Google Search', 'Google Shopping', 'YouTube Ads', 'Google Performance Max', 'Meta Instagram', 'Meta Facebook', 'TikTok', 'Pinterest', 'Snapchat', 'Criteo'][ORDINAL(MOD(id, 10) + 1)] AS platform,
    DATE_SUB(DATE '2026-09-30', INTERVAL MOD(id, 365) DAY) AS date,
    ['Ray-Ban', 'Oakley', 'Persol', 'Oliver Peoples', 'Vogue Eyewear', 'Costa', 'Sunglass Hut', 'Alain Mikli', 'Arnette', 'Target Optical'][ORDINAL(MOD(id, 10) + 1)] AS brand,
    
    -- Story Impressions & Clicks: Google Search & Shopping = High intent
    15000 + MOD(ABS(FARM_FINGERPRINT(CAST(id * 23 AS STRING))), 50000) AS impressions,
    500 + MOD(ABS(FARM_FINGERPRINT(CAST(id * 29 AS STRING))), 2500) AS clicks,
    
    -- Story Spend: TikTok/Criteo third-party channels absorb heavy budget with zero return
    CASE 
      WHEN MOD(id, 10) IN (6, 9) THEN ROUND(2200.00 + (MOD(id * 31, 1200)), 2) -- TikTok / Criteo (High spend, low return)
      WHEN MOD(id, 10) IN (0, 1, 2, 3) THEN ROUND(450.00 + (MOD(id * 13, 350)), 2) -- Google Search / Shopping / PMax (Efficient!)
      ELSE ROUND(600.00 + (MOD(ABS(FARM_FINGERPRINT(CAST(id * 31 AS STRING))), 100000) / 100.0), 2)
    END AS spend_eur,
    
    -- Story Conversions: Google Ads drives massive high-margin conversions!
    CASE 
      WHEN MOD(id, 10) IN (0, 1, 3) THEN 120 + MOD(id, 60)                        -- Google Search / Shopping / PMax (Massive Conversions!)
      WHEN MOD(id, 10) IN (2) THEN 85 + MOD(id, 30)                             -- YouTube Ads (High Conversions!)
      WHEN MOD(id, 10) IN (6, 9) THEN 8 + MOD(id, 6)                             -- TikTok / Criteo (0.7x ROAS - Wasteful!)
      ELSE 25 + MOD(ABS(FARM_FINGERPRINT(CAST(id * 37 AS STRING))), 40)
    END AS conversions
  FROM UNNEST(GENERATE_ARRAY(1, 5000)) AS id
)
SELECT * FROM campaign_generator;

-- -----------------------------------------------------------------------------
-- 4. RAW DIRTY MARKETING LEADS TABLE (1,000 Messy Lead Records)
-- Embedded Story Insight: Cleaning unlocks 350+ VIP leads for Google Ads Customer Match!
-- -----------------------------------------------------------------------------
CREATE OR REPLACE TABLE `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.lux_raw_marketing_leads_dirty` AS
WITH dirty_generator AS (
  SELECT
    id,
    CASE WHEN MOD(id, 3) = 0 THEN CONCAT(' LEAD_', LPAD(CAST(id AS STRING), 5, '0'), ' ') ELSE CONCAT('LEAD_', LPAD(CAST(id AS STRING), 5, '0')) END AS raw_lead_id,
    
    CASE 
      WHEN MOD(id, 25) = 0 THEN CONCAT('invalid_email_format_', id)
      WHEN MOD(id, 2) = 0 THEN UPPER(CONCAT('  user_', id, '@LUXMAIL.COM '))
      ELSE LOWER(CONCAT('user_', id, '@luxmail.com  '))
    END AS raw_email,
    
    ['ray ban', 'Ray-Ban ', 'PERSOL', 'Persol', 'oakley', 'OAKLEY', 'oliver peoples', 'Vogue Eyewear', 'vogue', ' Sunglass Hut '][ORDINAL(MOD(id, 10) + 1)] AS raw_brand,
    
    CASE 
      WHEN MOD(id, 3) = 0 THEN FORMAT_DATE('%d/%m/%Y', DATE_SUB(DATE '2026-09-30', INTERVAL MOD(id, 60) DAY))
      WHEN MOD(id, 3) = 1 THEN FORMAT_DATE('%Y-%m-%d', DATE_SUB(DATE '2026-09-30', INTERVAL MOD(id, 60) DAY))
      ELSE FORMAT_DATE('%b %d, %Y', DATE_SUB(DATE '2026-09-30', INTERVAL MOD(id, 60) DAY))
    END AS signup_raw_date,
    
    CASE 
      WHEN MOD(id, 4) = 0 THEN CONCAT(' € ', CAST(250 + MOD(id * 17, 300) AS STRING), '.00 ')
      WHEN MOD(id, 4) = 1 THEN CONCAT(CAST(300 + MOD(id * 17, 200) AS STRING), '.50 EUR')
      WHEN MOD(id, 4) = 2 THEN CONCAT('- ', CAST(50 + MOD(id, 100) AS STRING), '.00')
      ELSE CAST(180 + MOD(id * 17, 200) AS STRING)
    END AS raw_estimated_spend,
    
    ['IT', 'US', 'FR', 'UK', 'DE', 'JP'][ORDINAL(MOD(id, 6) + 1)] AS raw_country,
    MOD(id, 4) + 1 AS lead_priority
  FROM UNNEST(GENERATE_ARRAY(1, 1000)) AS id
)
SELECT * FROM dirty_generator;
