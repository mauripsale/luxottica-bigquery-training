-- =============================================================================
-- HANDS-ON CHALLENGE #2: "THE CLEAN SLATE"
-- Target Duration: 20 Minutes (within Block 4: 17:45 - 18:15)
-- Target Audience: Luxottica Global Analytics & Business Analysts
-- GCP Project ID: qwiklabs-gcp-04-9efaa47f1d21
-- Target Dataset: `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics`
-- =============================================================================

/*
BUSINESS CONTEXT:
The marketing leads pipeline receives raw data from global digital forms.
The raw table `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.lux_raw_marketing_leads_dirty` 
contains whitespace issues, inconsistent brand casing, varied date formats, string currency values,
and duplicate email submissions.

OBJECTIVE:
Transform this messy dataset into a standardized, production-ready BigQuery SQL VIEW
named `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.v_clean_marketing_leads`.

REQUIREMENTS:
1. Standardize Lead ID: Trim leading/trailing whitespace.
2. Clean Email: Convert to lowercase, trim whitespace, filter out invalid emails missing '@'.
3. Brand Normalization: Standardize brand names so 'ray ban' / 'RAY-BAN' / 'Ray-Ban ' all map to 'Ray-Ban', 'PERSOL' maps to 'Persol', 'OLIVER PEOPLES' maps to 'Oliver Peoples', 'vogue eyewear' maps to 'Vogue Eyewear'.
4. Safe Currency Parsing: Extract numeric values from strings like ' € 175.00 ' and '410.00 EUR' into a clean NUMERIC column `estimated_spend_eur`. Filter out or replace negative values with 0.00.
5. Flexible Date Parsing: Convert heterogeneous raw dates ('2026-09-01', '02/09/2026', 'Sep 05, 2026') into standard DATE format `signup_date`.
6. Deduplication: Keep only 1 record per unique email address based on highest priority (lowest lead_priority number).
*/

-- -----------------------------------------------------------------------------
-- WRITE YOUR CLEANING SQL / VIEW CREATION STATEMENT BELOW:
-- -----------------------------------------------------------------------------

CREATE OR REPLACE VIEW `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.v_clean_marketing_leads` AS
-- YOUR SQL STATEMENT HERE;


