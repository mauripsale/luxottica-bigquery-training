-- =============================================================================
-- LUXOTTICA MARKETING ANALYTICS - BIGQUERY TRAINING DATASET SETUP
-- Course: Mastering Marketing Data with BigQuery SQL
-- Target Dataset: `luxottica_marketing_analytics` (or Sandbox dataset)
-- =============================================================================

-- 1. CRM CUSTOMERS TABLE
CREATE OR REPLACE TABLE `luxottica_marketing_analytics.lux_crm_customers` AS
SELECT * FROM UNNEST([
  STRUCT('CUST-1001' AS customer_id, 'Marco' AS first_name, 'Rossi' AS last_name, 'marco.rossi@email.it' AS email, 'IT' AS country, DATE '2024-01-15' AS signup_date, 'Ray-Ban' AS preferred_brand, 'VIP' AS loyalty_tier),
  STRUCT('CUST-1002', 'Sophie', 'Dubois', 'sophie.dubois@email.fr', 'FR', DATE '2024-03-22', 'Persol', 'Gold'),
  STRUCT('CUST-1003', 'John', 'Smith', 'john.smith@email.com', 'US', DATE '2024-05-10', 'Oakley', 'Silver'),
  STRUCT('CUST-1004', 'Elena', 'Bianchi', 'elena.b@email.it', 'IT', DATE '2024-06-01', 'Ray-Ban', 'Standard'),
  STRUCT('CUST-1005', 'Kenji', 'Takahashi', 'kenji.t@email.jp', 'JP', DATE '2024-07-19', 'Oliver Peoples', 'VIP'),
  STRUCT('CUST-1006', 'Emma', 'Watson', 'emma.w@email.co.uk', 'UK', DATE '2024-08-11', 'Vogue Eyewear', 'Gold'),
  STRUCT('CUST-1007', 'Luca', 'Ferrari', 'l.ferrari@email.it', 'IT', DATE '2024-09-05', 'Persol', 'VIP'),
  STRUCT('CUST-1008', 'Michael', 'Brown', 'mbrown@email.com', 'US', DATE '2024-10-12', 'Oakley', 'Standard'),
  STRUCT('CUST-1009', 'Giulia', 'Romano', 'g.romano@email.it', 'IT', DATE '2024-11-30', 'Ray-Ban', 'Gold'),
  STRUCT('CUST-1010', 'Chloe', 'Leroy', 'chloe.l@email.fr', 'FR', DATE '2025-01-08', 'Vogue Eyewear', 'Silver')
]);

-- 2. ONLINE & RETAIL ORDERS TABLE
CREATE OR REPLACE TABLE `luxottica_marketing_analytics.lux_online_orders` AS
SELECT * FROM UNNEST([
  STRUCT('ORD-9001' AS order_id, 'CUST-1001' AS customer_id, TIMESTAMP '2026-09-01 10:15:00 UTC' AS order_timestamp, 'Ray-Ban' AS brand, 'Sunglasses' AS product_category, 'E-Commerce Direct' AS channel, 1 AS units_sold, 175.00 AS revenue_eur, 15.00 AS discount_amount_eur),
  STRUCT('ORD-9002', 'CUST-1002', TIMESTAMP '2026-09-02 14:30:00 UTC', 'Persol', 'Optical', 'Retail Store', 1, 280.00, 0.00),
  STRUCT('ORD-9003', 'CUST-1003', TIMESTAMP '2026-09-03 09:45:00 UTC', 'Oakley', 'Sunglasses', 'E-Commerce Direct', 2, 320.00, 30.00),
  STRUCT('ORD-9004', 'CUST-1001', TIMESTAMP '2026-09-05 16:20:00 UTC', 'Ray-Ban', 'Accessories', 'App', 1, 45.00, 0.00),
  STRUCT('ORD-9005', 'CUST-1005', TIMESTAMP '2026-09-07 11:10:00 UTC', 'Oliver Peoples', 'Sunglasses', 'E-Commerce Direct', 1, 410.00, 50.00),
  STRUCT('ORD-9006', 'CUST-1007', TIMESTAMP '2026-09-10 18:05:00 UTC', 'Persol', 'Sunglasses', 'Retail Store', 1, 310.00, 20.00),
  STRUCT('ORD-9007', 'CUST-1006', TIMESTAMP '2026-09-12 13:40:00 UTC', 'Vogue Eyewear', 'Optical', 'E-Commerce Direct', 1, 135.00, 10.00),
  STRUCT('ORD-9008', 'CUST-1009', TIMESTAMP '2026-09-15 15:50:00 UTC', 'Ray-Ban', 'Sunglasses', 'Affiliate', 1, 195.00, 0.00),
  STRUCT('ORD-9009', 'CUST-1003', TIMESTAMP '2026-09-18 17:15:00 UTC', 'Oakley', 'Custom Remedial', 'App', 1, 250.00, 25.00),
  STRUCT('ORD-9010', 'CUST-1010', TIMESTAMP '2026-09-20 12:00:00 UTC', 'Vogue Eyewear', 'Sunglasses', 'E-Commerce Direct', 2, 210.00, 20.00)
]);

-- 3. MULTI-CHANNEL AD SPEND TABLE
CREATE OR REPLACE TABLE `luxottica_marketing_analytics.lux_ad_spend` AS
SELECT * FROM UNNEST([
  STRUCT('CMP-101' AS campaign_id, 'RB_Wayfarer_Summer2026_EU' AS campaign_name, 'Google Ads' AS platform, DATE '2026-09-01' AS date, 'Ray-Ban' AS brand, 45000 AS impressions, 1800 AS clicks, 2400.00 AS spend_eur, 120 AS conversions),
  STRUCT('CMP-102', 'RB_Wayfarer_Summer2026_EU', 'Meta', DATE '2026-09-01', 'Ray-Ban', 62000, 2100, 2900.00, 145),
  STRUCT('CMP-103', 'OK_Prizm_Sport_US', 'Google Ads', DATE '2026-09-01', 'Oakley', 38000, 1400, 1950.00, 95),
  STRUCT('CMP-104', 'OK_Prizm_Sport_US', 'TikTok', DATE '2026-09-01', 'Oakley', 85000, 3200, 2100.00, 110),
  STRUCT('CMP-105', 'PS_Handmade_Heritage_IT', 'Meta', DATE '2026-09-01', 'Persol', 22000, 890, 1400.00, 42),
  STRUCT('CMP-106', 'OP_Luxury_Fall2026', 'Pinterest', DATE '2026-09-01', 'Oliver Peoples', 15000, 620, 1200.00, 28),
  STRUCT('CMP-107', 'VG_Fashion_Style_FR', 'TikTok', DATE '2026-09-01', 'Vogue Eyewear', 54000, 2300, 1600.00, 88)
]);

-- 4. RAW DIRTY MARKETING LEADS TABLE (FOR CLEANING CHALLENGE #2)
CREATE OR REPLACE TABLE `luxottica_marketing_analytics.lux_raw_marketing_leads_dirty` AS
SELECT * FROM UNNEST([
  STRUCT(' LEAD_001 ' AS raw_lead_id, '  MARCO.ROSSI@EMAIL.IT ' AS raw_email, 'Ray-Ban ' AS raw_brand, '2026-09-01' AS signup_raw_date, ' € 175.00 ' AS raw_estimated_spend, 'IT' AS raw_country, 1 AS lead_priority),
  STRUCT('LEAD_002', 'sophie.dubois@email.fr', 'PERSOL', '02/09/2026', '280.00', 'FR', 2),
  STRUCT('LEAD_003', 'JOHN.SMITH@EMAIL.COM', 'ray ban', '2026/09/03', '€320.00', 'US', 1),
  STRUCT('LEAD_001', 'marco.rossi@email.it', 'Ray-Ban', '2026-09-01', '175', 'IT', 2), -- Duplicate lead entry
  STRUCT('LEAD_004', 'invalid-email-format', 'Oakley', '2026-09-04', 'NULL', 'US', 3), -- Invalid email
  STRUCT('LEAD_005', 'elena.b@email.it  ', '  Persol ', 'Sep 05, 2026', ' € 450,50 ', 'IT', 1),
  STRUCT('LEAD_006', 'kenji.t@email.jp', 'OLIVER PEOPLES', '2026-09-06', '410.00 EUR', 'JP', 1),
  STRUCT('LEAD_007', '  chloe.l@email.fr', 'vogue eyewear', '2026-09-07', '-50.00', 'FR', 2) -- Negative spend anomaly
]);
