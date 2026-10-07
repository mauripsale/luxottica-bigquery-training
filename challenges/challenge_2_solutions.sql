-- =============================================================================
-- HANDS-ON CHALLENGE #2 SOLUTIONS: "THE CLEAN SLATE"
-- Luxottica Marketing Analytics Workshop
-- =============================================================================

CREATE OR REPLACE VIEW `luxottica_marketing_analytics.v_clean_marketing_leads` AS
WITH CleanedBase AS (
  SELECT
    TRIM(raw_lead_id) AS lead_id,
    
    -- Email cleanup
    LOWER(TRIM(raw_email)) AS clean_email,
    
    -- Brand normalization
    CASE 
      WHEN LOWER(TRIM(raw_brand)) LIKE '%ray%' THEN 'Ray-Ban'
      WHEN LOWER(TRIM(raw_brand)) LIKE '%persol%' THEN 'Persol'
      WHEN LOWER(TRIM(raw_brand)) LIKE '%oakley%' THEN 'Oakley'
      WHEN LOWER(TRIM(raw_brand)) LIKE '%oliver%' THEN 'Oliver Peoples'
      WHEN LOWER(TRIM(raw_brand)) LIKE '%vogue%' THEN 'Vogue Eyewear'
      ELSE INITCAP(TRIM(raw_brand))
    END AS clean_brand,
    
    -- Heterogeneous Date parsing
    CASE
      WHEN signup_raw_date LIKE '%/%' THEN PARSE_DATE('%d/%m/%Y', signup_raw_date)
      WHEN signup_raw_date LIKE '%-%' THEN PARSE_DATE('%Y-%m-%d', signup_raw_date)
      WHEN REGEXP_CONTAINS(signup_raw_date, r'^[A-Za-z]{3}') THEN PARSE_DATE('%b %d, %Y', signup_raw_date)
      ELSE NULL
    END AS signup_date,
    
    -- Currency extraction & non-negative spend check
    GREATEST(
      0.00,
      COALESCE(
        SAFE_CAST(
          REGEXP_REPLACE(
            REGEXP_REPLACE(raw_estimated_spend, r',', '.'), 
            r'[^0-9.-]', ''
          ) AS NUMERIC
        ),
        0.00
      )
    ) AS estimated_spend_eur,
    
    UPPER(TRIM(raw_country)) AS country,
    lead_priority
  FROM
    `luxottica_marketing_analytics.lux_raw_marketing_leads_dirty`
  WHERE
    -- Filter invalid email formats
    REGEXP_CONTAINS(TRIM(raw_email), r'^[^@]+@[^@]+\.[^@]+$')
)

SELECT
  lead_id,
  clean_email AS email,
  clean_brand AS brand,
  signup_date,
  estimated_spend_eur,
  country
FROM
  CleanedBase
-- Deduplicate by email keeping top lead priority
QUALIFY ROW_NUMBER() OVER(
  PARTITION BY clean_email 
  ORDER BY lead_priority ASC, signup_date DESC
) = 1;

-- Verification Query to view output
SELECT * FROM `luxottica_marketing_analytics.v_clean_marketing_leads`;
