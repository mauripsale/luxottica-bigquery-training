
    // ROSETTA SEARCH
    function filterRosetta() {
      const searchEl = document.getElementById('rosetta-search');
      if (!searchEl) return;
      const query = searchEl.value.toLowerCase();
      document.querySelectorAll('.rosetta-row').forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
      });
    }

    function openRosettaModal() {
      const searchEl = document.getElementById('rosetta-modal-search');
      if (searchEl) {
        searchEl.value = '';
        filterRosettaModal();
      }
      showModalDialog('rosetta-modal');
    }

    function closeRosettaModal() {
      closeModalDialog('rosetta-modal');
    }

    function filterRosettaModal() {
      const searchEl = document.getElementById('rosetta-modal-search');
      if (!searchEl) return;
      const query = searchEl.value.toLowerCase();
      document.querySelectorAll('.rosetta-modal-row').forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
      });
    }

    // ==========================================
    // IN-PAGE MODAL CONTROLLERS (NO GITHUB REQUIRED)
    // ==========================================
    const CHALLENGE_DATA = {
      1: {
        filename: "challenge_1_data_explorer.sql",
        title: "Challenge #1: High Margin Discovery & Analisi Sconti",
        titleEn: "Challenge #1: High Margin Discovery & Discount Analysis",
        subtitle: "lux_online_orders & lux_ad_spend (8 Domande Investigative)",
        subtitleEn: "lux_online_orders & lux_ad_spend (8 Investigative Questions)",
        fileContent: `-- =============================================================================
-- HANDS-ON CHALLENGE #1: "THE DATA EXPLORER" (EXTENDED WORKBOOK)
-- Target Duration: 35 Minutes (Block 2: 16:10 - 16:45)
-- GCP Project ID: qwiklabs-asl-02-9bb3224716de
-- Target Dataset: \`qwiklabs-asl-02-9bb3224716de.luxottica_marketing_analytics\`
-- =============================================================================

-- Q1: Total Revenue and Units Sold per Brand
SELECT 
  brand, 
  COUNT(order_id) AS total_orders, 
  ROUND(SUM(revenue_eur), 2) AS total_revenue_eur, 
  ROUND(AVG(revenue_eur), 2) AS aov_eur
FROM \`qwiklabs-asl-02-9bb3224716de.luxottica_marketing_analytics.lux_online_orders\`
GROUP BY brand
ORDER BY total_revenue_eur DESC;

-- Q2: Sales Channel Breakdown
SELECT 
  channel, 
  COUNT(order_id) AS order_count, 
  ROUND(SUM(revenue_eur), 2) AS total_revenue
FROM \`qwiklabs-asl-02-9bb3224716de.luxottica_marketing_analytics.lux_online_orders\`
GROUP BY channel
ORDER BY total_revenue DESC;

-- Q3: High-Value E-Commerce Transactions (> €300)
SELECT 
  brand, 
  channel, 
  COUNT(order_id) AS high_value_orders, 
  ROUND(SUM(revenue_eur), 2) AS high_value_revenue
FROM \`qwiklabs-asl-02-9bb3224716de.luxottica_marketing_analytics.lux_online_orders\`
WHERE revenue_eur > 300
GROUP BY brand, channel
ORDER BY high_value_revenue DESC;

-- Q4: Platform Performance (CTR % per platform)
SELECT 
  platform, 
  SUM(impressions) AS total_impressions, 
  SUM(clicks) AS total_clicks, 
  ROUND(SAFE_DIVIDE(SUM(clicks), SUM(impressions)) * 100, 3) AS ctr_percentage
FROM \`qwiklabs-asl-02-9bb3224716de.luxottica_marketing_analytics.lux_ad_spend\`
GROUP BY platform
ORDER BY ctr_percentage DESC;

-- Q5: Top 5 Campaign Efficiency (Cost per Conversion)
SELECT 
  campaign_name, 
  platform, 
  ROUND(SUM(spend_eur), 2) AS total_spend, 
  SUM(conversions) AS total_conversions, 
  ROUND(SAFE_DIVIDE(SUM(spend_eur), SUM(conversions)), 2) AS cost_per_conversion
FROM \`qwiklabs-asl-02-9bb3224716de.luxottica_marketing_analytics.lux_ad_spend\`
GROUP BY campaign_name, platform
HAVING total_conversions > 0
ORDER BY cost_per_conversion ASC
LIMIT 5;

-- Q6: Wholesale Margin Erosion (Discounts by Brand & Channel)
SELECT 
  brand, 
  channel, 
  ROUND(AVG(discount_amount_eur), 2) AS avg_discount_eur, 
  ROUND(SUM(discount_amount_eur), 2) AS total_discount_given
FROM \`qwiklabs-asl-02-9bb3224716de.luxottica_marketing_analytics.lux_online_orders\`
GROUP BY brand, channel
ORDER BY avg_discount_eur DESC;

-- Q7: Regional Customer Behavior & Loyalty
SELECT 
  region, 
  loyalty_tier, 
  COUNT(customer_id) AS total_customers, 
  ROUND(AVG(lifetime_spend_eur), 2) AS avg_customer_ltv
FROM \`qwiklabs-asl-02-9bb3224716de.luxottica_marketing_analytics.lux_crm_customers\`
GROUP BY region, loyalty_tier
ORDER BY region, avg_customer_ltv DESC;

-- Q8: Spend Bracket Segmentation (CASE WHEN)
SELECT 
  CASE 
    WHEN revenue_eur < 150 THEN '1. Entry Level (< 150 €)'
    WHEN revenue_eur <= 300 THEN '2. Core Luxury (150-300 €)'
    ELSE '3. High-End (> 300 €)'
  END AS spend_bracket, 
  COUNT(order_id) AS total_orders, 
  ROUND(SUM(revenue_eur), 2) AS bracket_revenue
FROM \`qwiklabs-asl-02-9bb3224716de.luxottica_marketing_analytics.lux_online_orders\`
GROUP BY spend_bracket
ORDER BY spend_bracket ASC;
`,
        questions: [
          {
            num: "Q1",
            title: "Ricavi e Scontrino Medio per Brand",
            titleEn: "Revenue & Average Order Value per Brand",
            desc: "Calcola il fatturato totale (revenue_eur), il numero totale di ordini e lo scontrino medio (AOV) per ciascun brand.",
            descEn: "Calculate total revenue (revenue_eur), total order count, and average order value (AOV) for each brand.",
            sql: "SELECT \n  brand, \n  COUNT(order_id) AS total_orders, \n  ROUND(SUM(revenue_eur), 2) AS total_revenue_eur, \n  ROUND(AVG(revenue_eur), 2) AS aov_eur\nFROM `qwiklabs-asl-02-9bb3224716de.luxottica_marketing_analytics.lux_online_orders`\nGROUP BY brand\nORDER BY total_revenue_eur DESC;"
          },
          {
            num: "Q2",
            title: "Ripartizione Vendite per Canale",
            titleEn: "Sales Breakdown by Channel",
            desc: "Qual è il canale di vendita che genera il maggior volume d'affari complessivo?",
            descEn: "Which sales channel generates the highest overall business volume?",
            sql: "SELECT \n  channel, \n  COUNT(order_id) AS order_count, \n  ROUND(SUM(revenue_eur), 2) AS total_revenue\nFROM `qwiklabs-asl-02-9bb3224716de.luxottica_marketing_analytics.lux_online_orders`\nGROUP BY channel\nORDER BY total_revenue DESC;"
          },
          {
            num: "Q3",
            title: "Ordini ad Alto Scontrino (> 300 €)",
            titleEn: "High Value Orders (> €300)",
            desc: "Filtra gli ordini con valore superiore a 300 € per individuare dove si concentrano i prodotti premium (Ray-Ban Meta, Oliver Peoples).",
            descEn: "Filter orders with value exceeding €300 to find where premium products are concentrated.",
            sql: "SELECT \n  brand, \n  channel, \n  COUNT(order_id) AS high_value_orders, \n  ROUND(SUM(revenue_eur), 2) AS high_value_revenue\nFROM `qwiklabs-asl-02-9bb3224716de.luxottica_marketing_analytics.lux_online_orders`\nWHERE revenue_eur > 300\nGROUP BY brand, channel\nORDER BY high_value_revenue DESC;"
          },
          {
            num: "Q4",
            title: "CTR ed Efficienza Piattaforme Pubblicitarie",
            titleEn: "CTR & Ad Platform Efficiency",
            desc: "Calcola il Click-Through Rate (CTR = clicks / impressions * 100) per ogni canale pubblicitario.",
            descEn: "Calculate Click-Through Rate (CTR = clicks / impressions * 100) per ad channel.",
            sql: "SELECT \n  platform, \n  SUM(impressions) AS total_impressions, \n  SUM(clicks) AS total_clicks, \n  ROUND(SAFE_DIVIDE(SUM(clicks), SUM(impressions)) * 100, 3) AS ctr_percentage\nFROM `qwiklabs-asl-02-9bb3224716de.luxottica_marketing_analytics.lux_ad_spend`\nGROUP BY platform\nORDER BY ctr_percentage DESC;"
          },
          {
            num: "Q5",
            title: "Top 5 Campagne per Costo di Acquisizione (CAC)",
            titleEn: "Top 5 Campaigns by Cost per Conversion (CAC)",
            desc: "Quali campagne adv hanno il costo per conversione più vantaggioso?",
            descEn: "Which advertising campaigns have the best cost per conversion?",
            sql: "SELECT \n  campaign_name, \n  platform, \n  ROUND(SUM(spend_eur), 2) AS total_spend, \n  SUM(conversions) AS total_conversions, \n  ROUND(SAFE_DIVIDE(SUM(spend_eur), SUM(conversions)), 2) AS cost_per_conversion\nFROM `qwiklabs-asl-02-9bb3224716de.luxottica_marketing_analytics.lux_ad_spend`\nGROUP BY campaign_name, platform\nHAVING total_conversions > 0\nORDER BY cost_per_conversion ASC\nLIMIT 5;"
          },
          {
            num: "Q6",
            title: "Erosione Margine: Impatto Sconti Wholesale per Brand",
            titleEn: "Margin Leakage: Wholesale Discount Impact per Brand",
            desc: "Confronta l'ammontare medio degli sconti concessi per canale. Scopri la fuga di margine sul canale Wholesale!",
            descEn: "Compare average discounts granted per channel. Reveal the margin leak on Wholesale!",
            sql: "SELECT \n  brand, \n  channel, \n  ROUND(AVG(discount_amount_eur), 2) AS avg_discount_eur, \n  ROUND(SUM(discount_amount_eur), 2) AS total_discount_given\nFROM `qwiklabs-asl-02-9bb3224716de.luxottica_marketing_analytics.lux_online_orders`\nGROUP BY brand, channel\nORDER BY avg_discount_eur DESC;"
          },
          {
            num: "Q7",
            title: "Loyalty Tier CRM e Comportamento Geografico",
            titleEn: "CRM Loyalty Tier & Regional Behavior",
            desc: "Come si distribuiscono i clienti per fascia di fedeltà e regione?",
            descEn: "How are customers distributed across loyalty tiers and regions?",
            sql: "SELECT \n  region, \n  loyalty_tier, \n  COUNT(customer_id) AS total_customers, \n  ROUND(AVG(lifetime_spend_eur), 2) AS avg_customer_ltv\nFROM `qwiklabs-asl-02-9bb3224716de.luxottica_marketing_analytics.lux_crm_customers`\nGROUP BY region, loyalty_tier\nORDER BY region, avg_customer_ltv DESC;"
          },
          {
            num: "Q8",
            title: "Segmentazione con CASE WHEN (Fasce di Spesa Ordini)",
            titleEn: "Order Spend Segmentation with CASE WHEN",
            desc: "Raggruppa gli ordini in 3 fasce: Entry Level (< 150 €), Core Luxury (150-300 €), High-End (> 300 €).",
            descEn: "Group orders into 3 brackets: Entry Level (< €150), Core Luxury (€150-€300), High-End (> €300).",
            sql: "SELECT \n  CASE \n    WHEN revenue_eur < 150 THEN '1. Entry Level (< 150 €)'\n    WHEN revenue_eur <= 300 THEN '2. Core Luxury (150-300 €)'\n    ELSE '3. High-End (> 300 €)'\n  END AS spend_bracket,\n  COUNT(order_id) AS total_orders,\n  ROUND(SUM(revenue_eur), 2) AS bracket_revenue\nFROM `qwiklabs-asl-02-9bb3224716de.luxottica_marketing_analytics.lux_online_orders`\nGROUP BY spend_bracket\nORDER BY spend_bracket ASC;"
          }
        ]
      },
      2: {
        filename: "challenge_2_cross_channel.sql",
        title: "Challenge #2: ROAS Cross-Channel con CTE & Anti-Fan-Out JOIN",
        titleEn: "Challenge #2: Cross-Channel ROAS with CTE & Anti-Fan-Out JOIN",
        subtitle: "Spesa Pubblicitaria vs Vendite Reali: Google Ads vs TikTok Ads",
        subtitleEn: "Ad Spend vs Real Sales: Google Ads vs TikTok Ads",
        fileContent: `-- =============================================================================
-- HANDS-ON CHALLENGE #2: "CROSS-CHANNEL MARKETING INTELLIGENCE"
-- Target Duration: 25 Minutes (Block 3: 17:20 - 17:45)
-- GCP Project ID: qwiklabs-asl-02-9bb3224716de
-- Target Dataset: \`qwiklabs-asl-02-9bb3224716de.luxottica_marketing_analytics\`
-- =============================================================================

-- Q1: Customer Lifetime Value (LTV) by Loyalty Tier
SELECT 
  c.loyalty_tier, 
  c.preferred_brand, 
  COUNT(DISTINCT c.customer_id) AS active_customers, 
  ROUND(SUM(o.revenue_eur), 2) AS total_realized_revenue, 
  ROUND(SAFE_DIVIDE(SUM(o.revenue_eur), COUNT(DISTINCT c.customer_id)), 2) AS realized_aov
FROM \`qwiklabs-asl-02-9bb3224716de.luxottica_marketing_analytics.lux_crm_customers\` c
JOIN \`qwiklabs-asl-02-9bb3224716de.luxottica_marketing_analytics.lux_online_orders\` o
  ON c.customer_id = o.customer_id
GROUP BY c.loyalty_tier, c.preferred_brand
ORDER BY total_realized_revenue DESC;

-- Q2: Omnichannel Activity Stream with UNION ALL
SELECT 
  order_id AS event_id, 
  customer_id, 
  order_date AS event_date, 
  'PURCHASE' AS event_type, 
  brand, 
  revenue_eur AS monetary_value
FROM \`qwiklabs-asl-02-9bb3224716de.luxottica_marketing_analytics.lux_online_orders\`
UNION ALL
SELECT 
  customer_id AS event_id, 
  customer_id, 
  signup_date AS event_date, 
  'SIGNUP' AS event_type, 
  preferred_brand AS brand, 
  lifetime_spend_eur AS monetary_value
FROM \`qwiklabs-asl-02-9bb3224716de.luxottica_marketing_analytics.lux_crm_customers\`;

-- Q3: Multi-Platform ROAS Calculation (The Decisive Query)
WITH spend_summary AS (
  SELECT 
    brand, 
    platform, 
    ROUND(SUM(spend_eur), 2) AS total_spend
  FROM \`qwiklabs-asl-02-9bb3224716de.luxottica_marketing_analytics.lux_ad_spend\`
  GROUP BY brand, platform
),
revenue_summary AS (
  SELECT 
    brand, 
    ROUND(SUM(revenue_eur), 2) AS total_revenue
  FROM \`qwiklabs-asl-02-9bb3224716de.luxottica_marketing_analytics.lux_online_orders\`
  GROUP BY brand
)
SELECT 
  s.platform, 
  s.brand, 
  s.total_spend, 
  r.total_revenue, 
  ROUND(SAFE_DIVIDE(r.total_revenue, s.total_spend), 2) AS roas_multiplier
FROM spend_summary s
JOIN revenue_summary r ON s.brand = r.brand
ORDER BY roas_multiplier DESC;

-- Q4: Preferred Brand vs Actually Purchased Brand Alignment
SELECT 
  c.preferred_brand AS stated_brand, 
  o.brand AS purchased_brand, 
  COUNT(o.order_id) AS transaction_count, 
  ROUND(SUM(o.revenue_eur), 2) AS cross_brand_sales
FROM \`qwiklabs-asl-02-9bb3224716de.luxottica_marketing_analytics.lux_crm_customers\` c
JOIN \`qwiklabs-asl-02-9bb3224716de.luxottica_marketing_analytics.lux_online_orders\` o 
  ON c.customer_id = o.customer_id
WHERE c.preferred_brand != o.brand
GROUP BY stated_brand, purchased_brand
ORDER BY transaction_count DESC;
`,
        questions: [
          {
            num: "Q1",
            title: "Customer LTV per Loyalty Tier & Brand Preferito",
            titleEn: "Customer LTV by Loyalty Tier & Preferred Brand",
            desc: "Unisci lux_crm_customers e lux_online_orders per analizzare la spesa effettiva rispetto alla fedeltà dichiarata.",
            descEn: "Join lux_crm_customers and lux_online_orders to analyze actual spend vs declared loyalty.",
            sql: "SELECT \n  c.loyalty_tier, \n  c.preferred_brand, \n  COUNT(DISTINCT c.customer_id) AS active_customers, \n  ROUND(SUM(o.revenue_eur), 2) AS total_realized_revenue, \n  ROUND(SAFE_DIVIDE(SUM(o.revenue_eur), COUNT(DISTINCT c.customer_id)), 2) AS realized_aov\nFROM `qwiklabs-asl-02-9bb3224716de.luxottica_marketing_analytics.lux_crm_customers` c\nJOIN `qwiklabs-asl-02-9bb3224716de.luxottica_marketing_analytics.lux_online_orders` o\n  ON c.customer_id = o.customer_id\nGROUP BY c.loyalty_tier, c.preferred_brand\nORDER BY total_realized_revenue DESC;"
          },
          {
            num: "Q2",
            title: "Omnichannel Stream con UNION ALL",
            titleEn: "Omnichannel Activity Stream with UNION ALL",
            desc: "Crea un flusso unificato di touchpoint combinando ordini online e interazioni CRM.",
            descEn: "Create a unified touchpoint stream combining online orders and CRM records.",
            sql: "SELECT \n  order_id AS event_id, \n  customer_id, \n  order_date AS event_date, \n  'PURCHASE' AS event_type, \n  brand, \n  revenue_eur AS monetary_value\nFROM `qwiklabs-asl-02-9bb3224716de.luxottica_marketing_analytics.lux_online_orders`\nUNION ALL\nSELECT \n  customer_id AS event_id, \n  customer_id, \n  signup_date AS event_date, \n  'SIGNUP' AS event_type, \n  preferred_brand AS brand, \n  lifetime_spend_eur AS monetary_value\nFROM `qwiklabs-asl-02-9bb3224716de.luxottica_marketing_analytics.lux_crm_customers`;"
          },
          {
            num: "Q3",
            title: "Calcolo ROAS Multi-Piattaforma (La Query Decisiva)",
            titleEn: "Multi-Platform ROAS Calculation (The Decisive Query)",
            desc: "Aggrega separatamente la spesa adv e i ricavi con due CTE pre-aggregate, poi unisci su brand per identificare chi produce valore e chi brucia budget.",
            descEn: "Separately aggregate ad spend and revenues using two pre-aggregated CTEs, then join on brand to uncover high vs low performing ad channels.",
            sql: "WITH spend_summary AS (\n  SELECT \n    brand, \n    platform, \n    ROUND(SUM(spend_eur), 2) AS total_spend\n  FROM `qwiklabs-asl-02-9bb3224716de.luxottica_marketing_analytics.lux_ad_spend`\n  GROUP BY brand, platform\n),\nrevenue_summary AS (\n  SELECT \n    brand, \n    ROUND(SUM(revenue_eur), 2) AS total_revenue\n  FROM `qwiklabs-asl-02-9bb3224716de.luxottica_marketing_analytics.lux_online_orders`\n  GROUP BY brand\n)\nSELECT \n  s.platform, \n  s.brand, \n  s.total_spend, \n  r.total_revenue, \n  ROUND(SAFE_DIVIDE(r.total_revenue, s.total_spend), 2) AS roas_multiplier\nFROM spend_summary s\nJOIN revenue_summary r ON s.brand = r.brand\nORDER BY roas_multiplier DESC;"
          },
          {
            num: "Q4",
            title: "Allineamento Brand Preferito vs Brand Effettivamente Acquistato",
            titleEn: "Preferred Brand vs Actually Purchased Brand Alignment",
            desc: "Verifica quanti clienti acquistano un brand diverso da quello indicato come preferito nel CRM.",
            descEn: "Check how many customers buy a brand different from their stated preference in CRM.",
            sql: "SELECT \n  c.preferred_brand AS stated_brand, \n  o.brand AS purchased_brand, \n  COUNT(o.order_id) AS transaction_count, \n  ROUND(SUM(o.revenue_eur), 2) AS cross_brand_sales\nFROM `qwiklabs-asl-02-9bb3224716de.luxottica_marketing_analytics.lux_crm_customers` c\nJOIN `qwiklabs-asl-02-9bb3224716de.luxottica_marketing_analytics.lux_online_orders` o \n  ON c.customer_id = o.customer_id\nWHERE c.preferred_brand != o.brand\nGROUP BY stated_brand, purchased_brand\nORDER BY transaction_count DESC;"
          }
        ]
      },
      3: {
        filename: "challenge_3_clean_slate.sql",
        title: "Challenge #3: Data Cleaning & Creazione Vista BigQuery Lead VIP",
        titleEn: "Challenge #3: Data Cleaning & BigQuery VIP Leads View Creation",
        subtitle: "Da dati grezzi e sporchi a Google Ads Customer Match Ready",
        subtitleEn: "From raw messy leads to Google Ads Customer Match Ready",
        fileContent: `-- =============================================================================
-- HANDS-ON CHALLENGE #3: "THE CLEAN SLATE" (AUTOMATED ETL VIEW)
-- Target Duration: 20 Minutes (Block 4: 17:55 - 18:15)
-- GCP Project ID: qwiklabs-asl-02-9bb3224716de
-- Target Dataset: \`qwiklabs-asl-02-9bb3224716de.luxottica_marketing_analytics\`
-- =============================================================================

/*
OBJECTIVE:
Transform lux_raw_marketing_leads_dirty into a clean BigQuery SQL VIEW named
v_clean_marketing_leads_<your_name> for Google Ads Customer Match ingestion.
*/

CREATE OR REPLACE VIEW \`qwiklabs-asl-02-9bb3224716de.luxottica_marketing_analytics.v_clean_marketing_leads_<your_name>\` AS
SELECT 
  TRIM(raw_lead_id) AS lead_id, 
  LOWER(TRIM(raw_email)) AS clean_email, 
  UPPER(TRIM(raw_brand)) AS target_brand, 
  SAFE_CAST(REPLACE(REPLACE(REPLACE(raw_estimated_spend, '€', ''), 'EUR', ''), ' ', '') AS NUMERIC) AS clean_spend_eur, 
  signup_raw_date AS capture_date, 
  raw_country AS country,
  'VIP_CUSTOMER_MATCH' AS audience_segment
FROM \`qwiklabs-asl-02-9bb3224716de.luxottica_marketing_analytics.lux_raw_marketing_leads_dirty\`
WHERE SAFE_CAST(REPLACE(REPLACE(REPLACE(raw_estimated_spend, '€', ''), 'EUR', ''), ' ', '') AS NUMERIC) > 200
QUALIFY ROW_NUMBER() OVER(PARTITION BY LOWER(TRIM(raw_email)) ORDER BY signup_raw_date DESC) = 1;

-- Verification Query: Check Recovered VIP Leads
SELECT 
  target_brand, 
  COUNT(lead_id) AS total_vip_leads, 
  ROUND(AVG(clean_spend_eur), 2) AS avg_vip_spend, 
  ROUND(SUM(clean_spend_eur), 2) AS pipeline_potential_eur
FROM \`qwiklabs-asl-02-9bb3224716de.luxottica_marketing_analytics.v_clean_marketing_leads_team\`
GROUP BY target_brand
ORDER BY total_vip_leads DESC;
`,
        questions: [
          {
            num: "Blueprint",
            title: "Specifiche di Trasformazione DDL",
            titleEn: "DDL Transformation Specifications",
            desc: "La tabella lux_raw_marketing_leads_dirty presenta email con spazi e maiuscole sballate (raw_email), spesa formattata come stringa con simboli '€'/'EUR' (raw_estimated_spend) e lead non qualificati. Dobbiamo creare una Vista BigQuery permanente che isoli i lead VIP (> 200 €).",
            descEn: "The dirty table has emails with extra spaces (raw_email) and string currency symbols in raw_estimated_spend. Create a permanent View isolating VIP leads (> €200).",
            sql: "-- Sostituisci il suffisso con il tuo team o nome (es. v_clean_marketing_leads_rayban_chiara)\nCREATE OR REPLACE VIEW `qwiklabs-asl-02-9bb3224716de.luxottica_marketing_analytics.v_clean_marketing_leads_team` AS\nSELECT \n  TRIM(raw_lead_id) AS lead_id, \n  LOWER(TRIM(raw_email)) AS clean_email, \n  UPPER(TRIM(raw_brand)) AS target_brand, \n  SAFE_CAST(REPLACE(REPLACE(REPLACE(raw_estimated_spend, '€', ''), 'EUR', ''), ' ', '') AS NUMERIC) AS clean_spend_eur, \n  signup_raw_date AS capture_date, \n  raw_country AS country, \n  'VIP_CUSTOMER_MATCH' AS audience_segment\nFROM `qwiklabs-asl-02-9bb3224716de.luxottica_marketing_analytics.lux_raw_marketing_leads_dirty`\nWHERE SAFE_CAST(REPLACE(REPLACE(REPLACE(raw_estimated_spend, '€', ''), 'EUR', ''), ' ', '') AS NUMERIC) > 200\nQUALIFY ROW_NUMBER() OVER(PARTITION BY LOWER(TRIM(raw_email)) ORDER BY signup_raw_date DESC) = 1;"
          },
          {
            num: "Verify",
            title: "Query di Verifica Conteggio Lead VIP Recuperati",
            titleEn: "VIP Leads Recovery Count Verification Query",
            desc: "Esegui questa query per verificare quanti lead qualificati sono stati recuperati dalla tua vista:",
            descEn: "Run this query to verify recovered qualified leads count from your view:",
            sql: "SELECT \n  target_brand, \n  COUNT(lead_id) AS total_vip_leads, \n  ROUND(AVG(clean_spend_eur), 2) AS avg_vip_spend, \n  ROUND(SUM(clean_spend_eur), 2) AS pipeline_potential_eur\nFROM `qwiklabs-asl-02-9bb3224716de.luxottica_marketing_analytics.v_clean_marketing_leads_team`\nGROUP BY target_brand\nORDER BY total_vip_leads DESC;"
          }
        ]
      }
    };

    let currentActiveChallengeModal = 1;

    function openChallengeModal(chNum) {
      currentActiveChallengeModal = chNum;
      const modal = document.getElementById('challenge-modal');
      const titleEl = document.getElementById('cm-title');
      const subtitleEl = document.getElementById('cm-subtitle');
      const badgeEl = document.getElementById('cm-filename-badge');
      const bodyEl = document.getElementById('cm-body');
      if (!modal || !CHALLENGE_DATA[chNum]) return;

      const data = CHALLENGE_DATA[chNum];
      const isIt = (currentLang === 'it');
      titleEl.innerText = isIt ? data.title : data.titleEn;
      subtitleEl.innerText = isIt ? data.subtitle : data.subtitleEn;
      if (badgeEl) badgeEl.innerText = data.filename;

      bodyEl.innerHTML = data.questions.map(q => `
        <div class="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <span class="px-2 py-0.5 rounded font-mono font-bold text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30">${q.num}</span>
              <h4 class="font-bold text-sm text-white">${isIt ? q.title : q.titleEn}</h4>
            </div>
            <button onclick="copyToClipboard(\`${q.sql.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`)" class="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition flex items-center space-x-1 cursor-pointer">
              <span>Copia SQL</span>
              <span>📋</span>
            </button>
          </div>
          <p class="text-xs text-slate-300 leading-relaxed">${isIt ? q.desc : q.descEn}</p>
          <pre class="p-3 rounded-xl bg-slate-950 font-mono text-[11px] text-emerald-400 overflow-x-auto border border-slate-800 leading-normal">${q.sql.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
        </div>
      `).join('');

      showModalDialog('challenge-modal');
    }

    function downloadChallengeSQL() {
      const data = CHALLENGE_DATA[currentActiveChallengeModal];
      if (!data) return;
      const blob = new Blob([data.fileContent], { type: 'text/plain;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = data.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(`💾 Scaricato ${data.filename}!`);
    }

    function closeChallengeModal() {
      closeModalDialog('challenge-modal');
    }

    function openGuideModal(lang) {
      const modal = document.getElementById('guide-modal');
      const body = document.getElementById('gm-body');
      const title = document.getElementById('gm-title');
      const btnIt = document.getElementById('btn-gm-lang-it');
      const btnEn = document.getElementById('btn-gm-lang-en');
      if (!modal || !body) return;

      const isIt = (lang === 'it');
      if (btnIt && btnEn) {
        btnIt.className = isIt ? "px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-600 text-white" : "px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-800 text-slate-400 hover:text-white";
        btnEn.className = !isIt ? "px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-600 text-white" : "px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-800 text-slate-400 hover:text-white";
      }

      title.innerText = isIt ? "Guida Ufficiale Studente: BigQuery & Gemini Workshop" : "Official Student Guide: BigQuery & Gemini Workshop";

      if (isIt) {
        body.innerHTML = `
          <div class="space-y-4">
            <div class="p-3 bg-blue-950/60 border border-blue-800 rounded-xl">
              <h3 class="font-bold text-blue-300 text-sm">🎯 Il Caso di Business del CMO</h3>
              <p class="text-slate-200 mt-1">Nel primo semestre 2026, la spesa pubblicitaria globale di Luxottica è salita del 35% su canali social ed esperimenti terzi, ma l'e-commerce online è cresciuto appena del 2%. Il board ha commissionato questa indagine su 116.000 record per individuare dove si perde valore.</p>
            </div>
            <div class="p-3 bg-slate-800 rounded-xl space-y-2">
              <h4 class="font-bold text-white text-xs uppercase tracking-wider">Dataset Perimetro:</h4>
              <ul class="list-disc list-inside space-y-1 text-slate-300">
                <li><code>lux_crm_customers</code>: 50.000 clienti, loyalty tier (Platinum, Gold, Silver, Bronze), regione, preferenze di brand.</li>
                <li><code>lux_online_orders</code>: 65.000 transazioni e-commerce con revenue, sconti e canali di vendita.</li>
                <li><code>lux_ad_spend</code>: 1.000 righe di investimenti media giornalieri suddivisi su 6 piattaforme.</li>
                <li><code>lux_raw_marketing_leads_dirty</code>: dati lead grezzi con errori di battitura, spazi e formati errati.</li>
              </ul>
            </div>
            <div class="p-3 bg-amber-950/40 border border-amber-800 rounded-xl space-y-1">
              <h4 class="font-bold text-amber-300 text-xs">⚠️ Come Evitare la Trappola del Fan-Out SQL</h4>
              <p class="text-slate-200">Non unire mai direttamente tabelle a granularità diversa (es. ordini con campagne) senza averle prima pre-aggregate tramite CTE (<code>WITH spend AS (...)</code>). Altrimenti moltiplicherai i ricavi falsando il ROAS!</p>
            </div>
          </div>
        `;
      } else {
        body.innerHTML = `
          <div class="space-y-4">
            <div class="p-3 bg-blue-950/60 border border-blue-800 rounded-xl">
              <h3 class="font-bold text-blue-300 text-sm">🎯 CMO Executive Business Dilemma</h3>
              <p class="text-slate-200 mt-1">During H1 2026, global ad spend surged 35% due to aggressive social media experiments, but online e-commerce grew merely 2%. The CMO tasked you to analyze 116,000 real records to find out where margin is leaking and reallocate budget to high-performing channels.</p>
            </div>
            <div class="p-3 bg-slate-800 rounded-xl space-y-2">
              <h4 class="font-bold text-white text-xs uppercase tracking-wider">Dataset Architecture:</h4>
              <ul class="list-disc list-inside space-y-1 text-slate-300">
                <li><code>lux_crm_customers</code>: 50,000 customers, loyalty tiers, regions, preferred brands.</li>
                <li><code>lux_online_orders</code>: 65,000 e-commerce transactions with order values and discount tracking.</li>
                <li><code>lux_ad_spend</code>: 1,000 rows of daily media investment across 6 ad platforms.</li>
                <li><code>lux_raw_marketing_leads_dirty</code>: Messy captured leads with casing and spacing errors.</li>
              </ul>
            </div>
            <div class="p-3 bg-amber-950/40 border border-amber-800 rounded-xl space-y-1">
              <h4 class="font-bold text-amber-300 text-xs">⚠️ Avoiding the SQL Fan-Out Trap</h4>
              <p class="text-slate-200">Never perform direct JOINs between tables of differing granularities without pre-aggregating them via Common Table Expressions (CTEs: <code>WITH spend AS (...)</code>). Otherwise order revenues will duplicate and corrupt your ROAS.</p>
            </div>
          </div>
        `;
      }

      showModalDialog('guide-modal');
    }

    function closeGuideModal() {
      closeModalDialog('guide-modal');
    }

    function openPlaybookModal(lang) {
      const modal = document.getElementById('playbook-modal');
      const body = document.getElementById('pm-body');
      const title = document.getElementById('pm-title');
      const subtitle = document.getElementById('pm-subtitle');
      const btnIt = document.getElementById('btn-pm-lang-it');
      const btnEn = document.getElementById('btn-pm-lang-en');
      if (!modal || !body) return;

      const activeLang = lang || currentLang || 'it';
      const isIt = (activeLang === 'it');

      if (btnIt && btnEn) {
        btnIt.className = isIt ? "px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-600 text-white" : "px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-800 text-slate-400 hover:text-white";
        btnEn.className = !isIt ? "px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-600 text-white" : "px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-800 text-slate-400 hover:text-white";
      }

      if (title) title.innerText = isIt ? "Copione & Gobbo Dettagliato Minuto per Minuto" : "Minute-by-Minute Playbook & Teleprompter";
      if (subtitle) subtitle.innerText = isIt ? "Doppia traccia simultanea Trainer vs Studente per tutti i 180 minuti della Masterclass" : "Synchronized dual-track action script (Trainer vs Student) for all 180 minutes";

      if (isIt) {
        body.innerHTML = `
          <div class="space-y-4">
            <div class="p-3 bg-indigo-950/60 border border-indigo-800 rounded-xl">
              <h3 class="font-bold text-indigo-300 text-sm">🎬 Guida Regia & Teleprompter Didattico Luxottica (180 Minuti)</h3>
              <p class="text-slate-200 text-xs mt-1">Questo copione sincronizza minuto per minuto cosa dice e fa il Docente e quali azioni concrete compiono i partecipanti in BigQuery Studio e nello Student Hub.</p>
            </div>
            <div class="space-y-3">
              <!-- BLOCCO 1 -->
              <div class="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 space-y-2">
                <div class="flex items-center justify-between border-b border-slate-700/80 pb-1.5">
                  <span class="font-bold text-amber-400 text-xs uppercase tracking-wider">🕒 15:30 - 16:00 | Blocco 1: Briefing Emergenza CMO & Live Data Canvas</span>
                  <span class="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono">+50 pt</span>
                </div>
                <div class="text-[11px] text-slate-300 space-y-1.5">
                  <div><strong>🎙️ Cosa Dice e Fa il Docente:</strong> Proietta lo Student Hub a schermo intero. Apre l'indagine: <em>"Nel primo semestre la spesa adv è salita del +35%, ma il fatturato online è cresciuto solo del +2%. Dov'è finita la cassa?"</em>. Entra in BigQuery Studio su <code>qwiklabs-asl-02-9bb3224716de</code>, apre <strong>Data Canvas</strong> e digita: <em>"Mostrami vendite totali e scontrino medio per brand"</em>. Commenta il grafico a barre colorate con Gemini AI Insights.</div>
                  <div><strong>💻 Cosa Fa lo Studente:</strong> Incolla l'ID di progetto nei preferiti dell'Explorer di BigQuery Studio. Osserva le 4 tabelle. Compila la card scura di convalida nel Blocco 1 dell'Hub per incassare i primi 50 punti!</div>
                </div>
              </div>

              <!-- BLOCCO 2 -->
              <div class="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 space-y-2">
                <div class="flex items-center justify-between border-b border-slate-700/80 pb-1.5">
                  <span class="font-bold text-amber-400 text-xs uppercase tracking-wider">🕒 16:00 - 16:45 | Blocco 2: Capitolo 1 - Prodotti ad Alto Margine & Sconti Wholesale</span>
                  <span class="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">+100 pt</span>
                </div>
                <div class="text-[11px] text-slate-300 space-y-1.5">
                  <div><strong>🎙️ Cosa Dice e Fa il Docente:</strong> Clicca <code>B2: Sconti</code> nella Trainer Bar. Spiega la metafora fondamentale: <em>"GROUP BY in SQL è esattamente la Tabella Pivot di Excel, ma gira su 100M di righe in 3 secondi"</em>. Allerta su precedenza filtri (<code>AND</code> prima di <code>OR</code>) e mostra <code>SAFE_DIVIDE</code> anti-crash. Se necessario sblocca hint da sidebar (o comunica PIN 2144 / 2255).</div>
                  <div><strong>💻 Cosa Fa lo Studente:</strong> Clicca sul pulsante in alto <code>📄 challenge_1_data_explorer.sql</code>. Esegue le query in BigQuery: scopre che <strong>Ray-Ban Meta Smart Glasses</strong> e <strong>Oliver Peoples</strong> hanno AOV > 300 € su E-Commerce Direct, mentre su Wholesale Vogue gli sconti medi salgono vertiginosamente. Invia le risposte nel quiz (+100 pt).</div>
                </div>
              </div>

              <!-- BREAK -->
              <div class="p-2.5 rounded-xl bg-slate-850 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>☕ <strong>16:45 - 17:00 | Coffee Break:</strong> Il docente clicca <code>☕ Pausa</code> per mostrare l'animazione di break.</span>
                <span class="text-[11px] text-amber-400 font-mono">15 Mins</span>
              </div>

              <!-- BLOCCO 3 -->
              <div class="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 space-y-2">
                <div class="flex items-center justify-between border-b border-slate-700/80 pb-1.5">
                  <span class="font-bold text-amber-400 text-xs uppercase tracking-wider">🕒 17:00 - 17:45 | Blocco 3: Capitolo 2 - ROAS Google Ads vs Social Terzi</span>
                  <span class="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">+100 pt</span>
                </div>
                <div class="text-[11px] text-slate-300 space-y-1.5">
                  <div><strong>🎙️ Cosa Dice e Fa il Docente:</strong> Clicca <code>B3: ROAS</code> nella Trainer Bar. Spiega la <strong>Trappola del Fan-Out SQL</strong>: unire direttamente spese adv e ordini moltiplica i ricavi per centinaia di volte! Spiega le CTE (<code>WITH spend AS (...)</code>) come due fogli Pivot Excel separati prima del JOIN. Mostra che Google Ads genera un ROAS stellare (> 7.0x) mentre TikTok registra un disastroso 0.52x. Supporto con PIN 3388.</div>
                  <div><strong>💻 Cosa Fa lo Studente:</strong> Apre <code>📄 challenge_2_cross_channel.sql</code> dall'header del Blocco 3. Esegue la query a 2 CTE con SAFE_DIVIDE, constata la voragine di budget su TikTok Ads e la leadership di Google Ads. Convalida la risposta nel quiz (+100 pt).</div>
                </div>
              </div>

              <!-- BLOCCO 4 -->
              <div class="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 space-y-2">
                <div class="flex items-center justify-between border-b border-slate-700/80 pb-1.5">
                  <span class="font-bold text-amber-400 text-xs uppercase tracking-wider">🕒 17:45 - 18:15 | Blocco 4: Capitolo 3 - Google Ads Customer Match & Creazione Vista</span>
                  <span class="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">+100 pt</span>
                </div>
                <div class="text-[11px] text-slate-300 space-y-1.5">
                  <div><strong>🎙️ Cosa Dice e Fa il Docente:</strong> Clicca <code>B4: Leads</code>. Illustra Google Ads Customer Match per scalare le vendite Q4. Mostra le tecniche di pulizia dati: <code>TRIM</code>, <code>LOWER</code> e pulizia simboli valuta. Ricorda la <strong>Regola Nome Vista Individuale</strong> (ogni studente usa il proprio nome per non sovrascrivere i colleghi). Fa la demo di esportazione 1-Click su Looker Studio. PIN 4499.</div>
                  <div><strong>💻 Cosa Fa lo Studente:</strong> Apre <code>📄 challenge_3_clean_slate.sql</code>. Crea la vista con il proprio nome univoco, recupera oltre 350 lead VIP (> 200 €) e convalida la Challenge #3 (+100 pt).</div>
                </div>
              </div>

              <!-- BLOCCO 5 -->
              <div class="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 space-y-2">
                <div class="flex items-center justify-between border-b border-slate-700/80 pb-1.5">
                  <span class="font-bold text-amber-400 text-xs uppercase tracking-wider">🕒 18:15 - 18:30 | Blocco 5: Piano Strategico Q4 per il CMO & Cerimonia Finale</span>
                  <span class="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">🏆 Premiazione</span>
                </div>
                <div class="text-[11px] text-slate-300 space-y-1.5">
                  <div><strong>🎙️ Cosa Dice e Fa il Docente:</strong> Clicca <code>🎉 Finale</code> nella Trainer Bar. Pronuncia il discorso conclusivo per il board con le 3 raccomandazioni (spostare il 60% del budget su Google, difendere i margini, attivare Customer Match). Proietta la classifica sul maxischermo, lancia la pioggia di coriandoli e proclama il Detective e la Squadra vincitori!</div>
                  <div><strong>💻 Cosa Fa lo Studente:</strong> Verifica il punteggio finale (massimo 350 pt), festeggia i risultati sul maxischermo e riceve le congratulazioni.</div>
                </div>
              </div>
            </div>
          </div>
        `;
      } else {
        body.innerHTML = `
          <div class="space-y-4">
            <div class="p-3 bg-indigo-950/60 border border-indigo-800 rounded-xl">
              <h3 class="font-bold text-indigo-300 text-sm">🎬 Luxottica Masterclass Production Playbook & Teleprompter (180 Mins)</h3>
              <p class="text-slate-200 text-xs mt-1">Minute-by-minute dual-track action script coordinating what the Trainer presents and what students execute in BigQuery Studio and the Student Hub.</p>
            </div>
            <div class="space-y-3">
              <!-- BLOCK 1 -->
              <div class="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 space-y-2">
                <div class="flex items-center justify-between border-b border-slate-700/80 pb-1.5">
                  <span class="font-bold text-amber-400 text-xs uppercase tracking-wider">🕒 15:30 - 16:00 | Block 1: CMO Emergency Briefing & Live Data Canvas</span>
                  <span class="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono">+50 pts</span>
                </div>
                <div class="text-[11px] text-slate-300 space-y-1.5">
                  <div><strong>🎙️ Trainer Action & Words:</strong> Present Student Hub on main screen: <em>"H1 ad spend jumped +35%, yet online sales grew only +2%. Where is our margin bleeding?"</em>. Open BigQuery Studio in <code>qwiklabs-asl-02-9bb3224716de</code>, open <strong>Data Canvas</strong>, type: <em>"Show total sales and average order value by brand"</em>. Comment on color-coded bar chart with Gemini AI Insights.</div>
                  <div><strong>💻 Student Action:</strong> Pin project ID to BigQuery Explorer. Inspect 4 tables. Complete the dark validation card in Block 1 of the Hub to lock in their first 50 points!</div>
                </div>
              </div>

              <!-- BLOCK 2 -->
              <div class="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 space-y-2">
                <div class="flex items-center justify-between border-b border-slate-700/80 pb-1.5">
                  <span class="font-bold text-amber-400 text-xs uppercase tracking-wider">🕒 16:00 - 16:45 | Block 2: Chapter 1 - High Margin Discovery & Wholesale Discounts</span>
                  <span class="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">+100 pts</span>
                </div>
                <div class="text-[11px] text-slate-300 space-y-1.5">
                  <div><strong>🎙️ Trainer Action & Words:</strong> Click <code>B2: Sconti</code> in Trainer Bar. Teach Rosetta Stone metaphor: <em>"SQL GROUP BY is literally an Excel Pivot Table, processing 100M rows in 3 seconds"</em>. Warn on filter precedence (<code>AND</code> before <code>OR</code>) and introduce crash-safe <code>SAFE_DIVIDE</code>. Unlock hints via console or share PIN 2144 / 2255.</div>
                  <div><strong>💻 Student Action:</strong> Click top header button <code>📄 challenge_1_data_explorer.sql</code>. Run BigQuery queries: discover <strong>Ray-Ban Meta Smart Glasses</strong> and <strong>Oliver Peoples</strong> command AOV > €300 on E-Commerce Direct, while Wholesale Vogue leaks high discounts. Validate quiz (+100 pts).</div>
                </div>
              </div>

              <!-- BREAK -->
              <div class="p-2.5 rounded-xl bg-slate-850 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>☕ <strong>16:45 - 17:00 | Coffee Break:</strong> Trainer clicks <code>☕ Pausa</code> to trigger the break animation screen.</span>
                <span class="text-[11px] text-amber-400 font-mono">15 Mins</span>
              </div>

              <!-- BLOCK 3 -->
              <div class="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 space-y-2">
                <div class="flex items-center justify-between border-b border-slate-700/80 pb-1.5">
                  <span class="font-bold text-amber-400 text-xs uppercase tracking-wider">🕒 17:00 - 17:45 | Block 3: Chapter 2 - Cross-Channel ROAS: Google Ads vs 3rd-Party Social</span>
                  <span class="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">+100 pts</span>
                </div>
                <div class="text-[11px] text-slate-300 space-y-1.5">
                  <div><strong>🎙️ Trainer Action & Words:</strong> Click <code>B3: ROAS</code> in Trainer Bar. Warn against the fatal <strong>SQL Fan-Out Trap</strong>: direct joins between campaign spend and orders multiply revenue hundreds of times! Teach CTEs (<code>WITH spend AS (...)</code>) as separate Excel Pivot tabs before joining. Highlight Google Ads high ROAS (> 7.0x) vs TikTok money pit (0.52x). Support with PIN 3388.</div>
                  <div><strong>💻 Student Action:</strong> Open <code>📄 challenge_2_cross_channel.sql</code> directly from Block 3 header. Execute 2-CTE query with SAFE_DIVIDE, verify TikTok net loss and Google Ads dominance. Submit answers in quiz (+100 pts).</div>
                </div>
              </div>

              <!-- BLOCK 4 -->
              <div class="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 space-y-2">
                <div class="flex items-center justify-between border-b border-slate-700/80 pb-1.5">
                  <span class="font-bold text-amber-400 text-xs uppercase tracking-wider">🕒 17:45 - 18:15 | Block 4: Chapter 3 - Google Ads Customer Match & BigQuery View</span>
                  <span class="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">+100 pts</span>
                </div>
                <div class="text-[11px] text-slate-300 space-y-1.5">
                  <div><strong>🎙️ Trainer Action & Words:</strong> Click <code>B4: Leads</code>. Introduce Google Ads Customer Match to scale Q4 sales. Teach string cleansing: <code>TRIM</code>, <code>LOWER</code>, and currency string cleaning. Emphasize the <strong>Individual View Name Rule</strong> (each student uses their own name to prevent collisions). Demonstrate 1-Click Looker Studio dashboard. PIN 4499.</div>
                  <div><strong>💻 Student Action:</strong> Open <code>📄 challenge_3_clean_slate.sql</code>. Build view with unique personal name, recover 350+ VIP leads (> €200), and validate Challenge #3 (+100 pts).</div>
                </div>
              </div>

              <!-- BLOCK 5 -->
              <div class="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 space-y-2">
                <div class="flex items-center justify-between border-b border-slate-700/80 pb-1.5">
                  <span class="font-bold text-amber-400 text-xs uppercase tracking-wider">🕒 18:15 - 18:30 | Block 5: Q4 Growth Plan for CMO & Award Ceremony</span>
                  <span class="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">🏆 Awards</span>
                </div>
                <div class="text-[11px] text-slate-300 space-y-1.5">
                  <div><strong>🎙️ Trainer Action & Words:</strong> Click <code>🎉 Finale</code> in Trainer Bar. Deliver the executive board address summarizing the 3 pillars (reallocate 60% budget to Google Ads, defend product margins, activate Customer Match). Project leaderboard on big screen, trigger confetti shower, and crown the top Detective and Team!</div>
                  <div><strong>💻 Student Action:</strong> Review final cumulative score (max 350 pts), celebrate team standing, and wrap up.</div>
                </div>
              </div>
            </div>
          </div>
        `;
      }

      showModalDialog('playbook-modal');
    }

    function closePlaybookModal() {
      closeModalDialog('playbook-modal');
    }

    // DEDICATED PIN CODES PER STEP HINT (ALSO MASTER PIN 1926 ALWAYS UNLOCKS)
    const stepPins = {
      'b1-s1': '1122',
      'b1-s2': '1234',
      'b2-s1': '2144',
      'b2-s2': '2255',
      'b3':    '3388',
      'b4':    '4499'
    };

    // UNLOCK HINT WITH PIN
    function unlockHint(stepKey) {
      const pinInput = document.getElementById(`pin-${stepKey}`);
      if (!pinInput) return;
      const enteredPin = pinInput.value.trim();
      const expectedPin = stepPins[stepKey];

      if (enteredPin === expectedPin || enteredPin === '1926' || enteredPin === '2026') {
        const lockState = document.getElementById(`lock-state-${stepKey}`);
        const content = document.getElementById(`content-${stepKey}`);
        if (lockState) lockState.classList.add('hidden');
        if (content) content.classList.remove('hidden');
        updateTrainerHintUI();
        showToast(currentLang === 'it' ? "🔓 Suggerimento sbloccato!" : "🔓 Hint unlocked!");
      } else {
        pinInput.classList.add('ring-2', 'ring-red-500', 'bg-red-950');
        setTimeout(() => pinInput.classList.remove('ring-2', 'ring-red-500', 'bg-red-950'), 1500);
        showToast(currentLang === 'it' ? "❌ PIN errato! Chiedi al docente" : "❌ Invalid PIN! Ask the trainer");
      }
    }

    // ALLOW ENTER KEY ON PIN INPUTS & ONBOARDING
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        if (e.target && e.target.id && e.target.id.startsWith('pin-')) {
          const stepKey = e.target.id.replace('pin-', '');
          unlockHint(stepKey);
        } else if (e.target && e.target.id === 'student-input-name') {
          e.preventDefault();
          submitStudentOnboarding();
        }
      }
    });

    // MODERN WEB GUIDANCE: LIGHT-DISMISS FALLBACK FOR BROWSERS WITHOUT NATIVE closedby SUPPORT
    function initDialogLightDismissFallback() {
      document.querySelectorAll('dialog[closedby]').forEach(dialog => {
        dialog.addEventListener('click', (event) => {
          if (event.target === dialog) {
            const rect = dialog.getBoundingClientRect();
            const isInDialog = (
              rect.top <= event.clientY &&
              event.clientY <= rect.top + rect.height &&
              rect.left <= event.clientX &&
              event.clientX <= rect.left + rect.width
            );
            if (!isInDialog) {
              closeModalDialog(dialog);
            }
          }
        });
      });
    }

    // AUTO-INITIALIZE TRAINER MODE & STUDENT PROFILE AT LOAD TIME
    (function initMasterclass() {
      initDialogLightDismissFallback();

      const trainerPinDialog = document.getElementById('trainer-pin-modal');
      if (trainerPinDialog) {
        trainerPinDialog.addEventListener('close', () => {
          if (!isTrainerMode) {
            const savedRole = localStorage.getItem('lux_bq_user_role_v1');
            if (!savedRole || savedRole !== 'student') {
              openRoleSelectionModal();
            }
          }
        });
      }

      const urlParams = new URLSearchParams(window.location.search);
      const role = urlParams.get('role');
      const pin = urlParams.get('pin');
      const trainer = urlParams.get('trainer');

      if (role === 'trainer' || pin === '1926' || pin === '2026' || trainer === 'true' || trainer === '1') {
        enableTrainerMode();
      } else {
        applyLockState(true);
      }
      const initialLang = localStorage.getItem('lux_bq_lang') || 'it';
      setLanguage(initialLang);
      initTheme();

      // Check if there is an active workshop block in progress; fallback to 'cover'
      let initialBlock = 'cover';
      try {
        const savedBlock = localStorage.getItem('lux_bq_active_block_v1');
        if (savedBlock && document.getElementById(`block-${savedBlock}`)) {
          initialBlock = savedBlock;
        }
      } catch (e) {}

      showBlock(initialBlock, false);
      loadStudentProfile();

      // Fetch backend dynamic configuration (/api/v2/config)
      if (window.hubClient) {
        window.hubClient.loadConfig().then(cfg => {
          if (!cfg) return;
          console.log("[HubClient v2] Configuration loaded:", cfg);
          if (cfg.google_client_id) {
            initGoogleAuth(cfg.google_client_id);
          }
          if (cfg.gcp_project_id) {
            document.querySelectorAll('.gcp-project-placeholder').forEach(el => {
              el.textContent = cfg.gcp_project_id;
            });
          }
        }).catch(e => {
          console.warn("[HubClient v2] Could not load backend config:", e);
        });
      }

      // Ask trainer for current active block (solves late-joiners opening page after block switch)
      if (!isTrainerMode) {
        setTimeout(requestClassroomSync, 500);
      }
    })();
