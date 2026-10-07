-- =============================================================================
-- HANDS-ON CHALLENGE #3: "THE CLEAN SLATE" (AUTOMATED ETL VIEW)
-- Target Duration: 20 Minutes (Block 4: 17:55 - 18:15)
-- GCP Project ID: qwiklabs-gcp-04-9efaa47f1d21
-- Target Dataset: `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics`
-- =============================================================================

/*
BUSINESS CONTEXT:
The global lead ingestion pipeline receives raw, messy marketing registrations from social forms.
The table `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.lux_raw_marketing_leads_dirty`
contains string whitespace padding, mixed case brands ('ray ban', 'PERSOL'), string currency values (' € 175.00 '),
heterogeneous dates ('2026-09-01', '02/09/2026', 'Sep 05, 2026'), and duplicate lead entries.

OBJECTIVE:
Transform this dirty table into a clean BigQuery SQL VIEW named
`qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.v_clean_marketing_leads`.
*/

-- WRITE YOUR VIEW CREATION STATEMENT BELOW:

CREATE OR REPLACE VIEW `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics.v_clean_marketing_leads` AS
-- YOUR SQL CODE HERE;
