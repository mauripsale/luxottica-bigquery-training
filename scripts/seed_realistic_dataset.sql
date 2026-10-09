-- ============================================================================
-- LUXOTTICA MARKETING ANALYTICS - REALISTIC DATASET (TEACHABLE MOMENT READY)
-- ============================================================================
-- Execute this script in BigQuery Studio to create realistic sales, AOVs, discounts, and campaign spend.
-- lux_ad_spend stores ad spend and conversions, prompting Gemini to guide students to JOIN with lux_online_orders!
-- ============================================================================

CREATE OR REPLACE TABLE `luxottica_marketing_analytics.lux_online_orders` AS
WITH base_orders AS (

  -- 1. RAY-BAN (42,500 Orders - High Volume Leader, Direct E-Commerce Discount Leakage)
  SELECT 
    CONCAT('ORD-RB-', LPAD(CAST(idx AS STRING), 6, '0')) AS order_id,
    CONCAT('CUST-RB-', LPAD(CAST(MOD(idx, 15000) + 1 AS STRING), 6, '0')) AS customer_id,
    TIMESTAMP_ADD(TIMESTAMP '2026-01-01 08:00:00 UTC', INTERVAL CAST(idx * 600 AS INT64) SECOND) AS order_timestamp,
    'Ray-Ban' AS brand,
    CASE MOD(idx, 3)
      WHEN 0 THEN 'Smart Glasses'
      WHEN 1 THEN 'Iconic Sunglasses'
      ELSE 'Optical'
    END AS product_category,
    CASE MOD(idx, 4)
      WHEN 0 THEN 'E-Commerce Direct'
      WHEN 1 THEN 'Retail Store'
      WHEN 2 THEN 'Mobile App'
      ELSE 'Wholesale Partner'
    END AS channel,
    1 AS units_sold,
    CASE MOD(idx, 3)
      WHEN 0 THEN 320.00  -- Ray-Ban Meta Smart Glasses
      WHEN 1 THEN 185.00  -- Aviator / Wayfarer
      ELSE 165.00         -- Optical Frames
    END AS revenue_eur,
    CASE 
      WHEN MOD(idx, 4) = 0 THEN ROUND(20.00 + (MOD(idx, 5) * 2.5), 2) -- €20.00 - €30.00 discount on Direct
      WHEN MOD(idx, 4) = 3 THEN 8.00                                   -- €8.00 discount on Wholesale
      ELSE 3.00                                                       -- €3.00 in Retail
    END AS discount_amount_eur
  FROM UNNEST(GENERATE_ARRAY(1, 42500)) AS idx

  UNION ALL

  -- 2. OAKLEY (28,000 Orders - Performance & Sport, Wholesale Discounts)
  SELECT 
    CONCAT('ORD-OK-', LPAD(CAST(idx AS STRING), 6, '0')) AS order_id,
    CONCAT('CUST-OK-', LPAD(CAST(MOD(idx, 10000) + 1 AS STRING), 6, '0')) AS customer_id,
    TIMESTAMP_ADD(TIMESTAMP '2026-01-01 08:30:00 UTC', INTERVAL CAST(idx * 900 AS INT64) SECOND) AS order_timestamp,
    'Oakley' AS brand,
    CASE MOD(idx, 3) WHEN 0 THEN 'Prizm Sport' WHEN 1 THEN 'Lifestyle' ELSE 'Goggles' END AS product_category,
    CASE MOD(idx, 3) WHEN 0 THEN 'Wholesale Partner' WHEN 1 THEN 'E-Commerce Direct' ELSE 'Retail Store' END AS channel,
    1 AS units_sold,
    CASE MOD(idx, 3) WHEN 0 THEN 240.00 WHEN 1 THEN 195.00 ELSE 210.00 END AS revenue_eur,
    CASE 
      WHEN MOD(idx, 3) = 0 THEN 14.50
      WHEN MOD(idx, 3) = 1 THEN 5.00
      ELSE 0.00
    END AS discount_amount_eur
  FROM UNNEST(GENERATE_ARRAY(1, 28000)) AS idx

  UNION ALL

  -- 3. VOGUE EYEWEAR (18,000 Orders - Fashion Mass-Market, Heavy Discount Erosion)
  SELECT 
    CONCAT('ORD-VG-', LPAD(CAST(idx AS STRING), 6, '0')) AS order_id,
    CONCAT('CUST-VG-', LPAD(CAST(MOD(idx, 8000) + 1 AS STRING), 6, '0')) AS customer_id,
    TIMESTAMP_ADD(TIMESTAMP '2026-01-01 10:30:00 UTC', INTERVAL CAST(idx * 1400 AS INT64) SECOND) AS order_timestamp,
    'Vogue Eyewear' AS brand,
    'Trend Eyewear' AS product_category,
    CASE MOD(idx, 3) WHEN 0 THEN 'Wholesale Partner' WHEN 1 THEN 'E-Commerce Direct' ELSE 'Retail Store' END AS channel,
    1 AS units_sold,
    CASE MOD(idx, 2) WHEN 0 THEN 135.00 ELSE 115.00 END AS revenue_eur,
    CASE 
      WHEN MOD(idx, 3) = 0 THEN 28.50
      WHEN MOD(idx, 3) = 1 THEN 12.00
      ELSE 5.00
    END AS discount_amount_eur
  FROM UNNEST(GENERATE_ARRAY(1, 18000)) AS idx

  UNION ALL

  -- 4. PERSOL (12,000 Orders - Handcrafted Luxury, Minimal Discounts)
  SELECT 
    CONCAT('ORD-PS-', LPAD(CAST(idx AS STRING), 6, '0')) AS order_id,
    CONCAT('CUST-PS-', LPAD(CAST(MOD(idx, 5000) + 1 AS STRING), 6, '0')) AS customer_id,
    TIMESTAMP_ADD(TIMESTAMP '2026-01-01 10:00:00 UTC', INTERVAL CAST(idx * 2000 AS INT64) SECOND) AS order_timestamp,
    'Persol' AS brand,
    'Handcrafted Luxury' AS product_category,
    CASE MOD(idx, 3) WHEN 0 THEN 'E-Commerce Direct' WHEN 1 THEN 'Retail Store' ELSE 'Wholesale Partner' END AS channel,
    1 AS units_sold,
    CASE MOD(idx, 2) WHEN 0 THEN 320.00 ELSE 285.00 END AS revenue_eur,
    CASE WHEN MOD(idx, 10) = 0 THEN 10.00 ELSE 0.00 END AS discount_amount_eur
  FROM UNNEST(GENERATE_ARRAY(1, 12000)) AS idx

  UNION ALL

  -- 5. OLIVER PEOPLES (6,500 Orders - Premium Ultra-Luxury, Zero Discounts)
  SELECT 
    CONCAT('ORD-OP-', LPAD(CAST(idx AS STRING), 6, '0')) AS order_id,
    CONCAT('CUST-OP-', LPAD(CAST(MOD(idx, 3000) + 1 AS STRING), 6, '0')) AS customer_id,
    TIMESTAMP_ADD(TIMESTAMP '2026-01-01 09:00:00 UTC', INTERVAL CAST(idx * 3600 AS INT64) SECOND) AS order_timestamp,
    'Oliver Peoples' AS brand,
    'High-AOV Luxury Eyewear' AS product_category,
    CASE MOD(idx, 2) WHEN 0 THEN 'E-Commerce Direct' ELSE 'Retail Store' END AS channel,
    1 AS units_sold,
    CASE MOD(idx, 3) WHEN 0 THEN 450.00 WHEN 1 THEN 390.00 ELSE 420.00 END AS revenue_eur,
    0.00 AS discount_amount_eur
  FROM UNNEST(GENERATE_ARRAY(1, 6500)) AS idx
)
SELECT * FROM base_orders;


-- ============================================================================
-- RE-CREATE TABLE: lux_ad_spend
-- Stores campaign costs and conversions. Requires CTE + JOIN with lux_online_orders for ROAS!
-- ============================================================================
CREATE OR REPLACE TABLE `luxottica_marketing_analytics.lux_ad_spend` AS
WITH ad_data AS (
  -- GOOGLE ADS (High Conversion Efficiency)
  SELECT 1 AS id, 'CMP-GGL-01' AS campaign_id, 'Google_Search_RayBan_Meta_SmartGlasses' AS campaign_name, 'Google Ads' AS platform, DATE('2026-05-01') AS date, 'Ray-Ban' AS brand, 45000 AS impressions, 3800 AS clicks, 450.00 AS spend_eur, 120 AS conversions

  UNION ALL SELECT 2, 'CMP-GGL-02', 'Google_Shopping_Oakley_Prizm', 'Google Ads', DATE('2026-05-01'), 'Oakley', 38000, 2900, 380.00, 85

  UNION ALL SELECT 3, 'CMP-GGL-03', 'Google_PMax_OliverPeoples_Luxury', 'Google Ads', DATE('2026-05-01'), 'Oliver Peoples', 18000, 1200, 250.00, 42

  -- TIKTOK ADS (High Spend, Low Conversions - Money Pit!)
  UNION ALL SELECT 4, 'CMP-TTK-01', 'TikTok_GenZ_Awareness_Campaign', 'TikTok Ads', DATE('2026-05-01'), 'Vogue Eyewear', 120000, 15000, 2200.00, 8

  UNION ALL SELECT 5, 'CMP-TTK-02', 'TikTok_Influencer_RayBan_Trendy', 'TikTok Ads', DATE('2026-05-01'), 'Ray-Ban', 95000, 11000, 1800.00, 12

  -- CRITEO SOCIAL (Retargeting Leakage)
  UNION ALL SELECT 6, 'CMP-CRT-01', 'Criteo_Dynamic_Retargeting_Global', 'Criteo Social', DATE('2026-05-01'), 'Ray-Ban', 65000, 4200, 1200.00, 9

  -- META ADS (Instagram / Facebook)
  UNION ALL SELECT 7, 'CMP-MTA-01', 'Meta_Instagram_Persol_Craftsmanship', 'Meta Ads', DATE('2026-05-01'), 'Persol', 42000, 3100, 550.00, 38
)
SELECT * FROM ad_data;
