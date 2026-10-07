# Slide Deck Presentation Outline
**Course Title:** BigQuery for Data Analysis: Mastering Marketing Data with BigQuery SQL  
**Client:** Luxottica  
**GCP Project Name:** `bigquery-luxottica`  
**GCP Project ID:** `qwiklabs-gcp-04-9efaa47f1d21`  
**Project Owner:** `student-02-25b97e18011e@qwiklabs.net`  
**Target Audience:** Global Analytics, Business Analyst, Digital Commerce & Retail Operations  
**Date & Time:** Oct 12th, 2026 | 15:30 - 18:30 (3 Hours / 180 Mins)  
**Format:** Hybrid (In-Person & Remote)

---

## Block 1: BigQuery Fundamentals (15:30 - 16:00)

### Slide 1: Welcome & Executive Introduction
- **Title:** Mastering Marketing Data with BigQuery SQL
- **Visual:** Luxottica Brand Mosaic (Ray-Ban, Oakley, Persol, Oliver Peoples, Sunglass Hut) + Google Cloud BigQuery Logo.
- **Key Message:** Welcome to today's hands-on workshop tailored for Luxottica's Global Analytics & Business teams.
- **Environment:** Project `bigquery-luxottica` (`qwiklabs-gcp-04-9efaa47f1d21`).

### Slide 2: Course Agenda & Objectives
- **Title:** 3-Hour Interactive Agenda
- **Agenda Breakdown:**
  - 15:30 - 16:00 | Block 1: BigQuery Fundamentals
  - 16:00 - 16:45 | Block 2: Exploring & Preparing Data + **Hands-on Challenge #1**
  - 16:45 - 17:00 | ☕ Coffee Break
  - 17:00 - 17:45 | Block 3: Advanced Querying & Cross-Channel Analytics
  - 17:45 - 18:15 | Block 4: Data Cleaning & Transformation + **Hands-on Challenge #2**
  - 18:15 - 18:30 | Executive Summary & Security Spotlight

### Slide 3: Why BigQuery for Luxottica?
- **Title:** Beyond Spreadsheets: Scale, Speed, and Single Source of Truth
- **Comparison Visual:** Excel vs BigQuery Architecture
- **Points:**
  - Scalability: Handling multi-billion row ecommerce clickstream & store transaction tables seamlessly.
  - Speed: Serverless columnar architecture returning query results in seconds.
  - Governance: Unified access controls across global brands and regions.

### Slide 4: BigQuery Architecture in 3 Minutes
- **Title:** Decoupled Compute (Dremel) & Storage (Colossus)
- **Visual Diagram:** How SQL query engine scales dynamically while storage stays cost-effective in GCS/Colossus.
- **Key Concept:** You pay separately for storage and queries executed (bytes scanned).

### Slide 5: Hands-on Orientation - GCP BigQuery Console Walkthrough
- **Title:** Navigating Your Analytics Environment
- **Interactive Action:** Open `https://console.cloud.google.com/bigquery?project=qwiklabs-gcp-04-9efaa47f1d21`
- **Key UI Regions:**
  - Explorer Pane (Project `qwiklabs-gcp-04-9efaa47f1d21` > Dataset `luxottica_marketing_analytics` > Tables)
  - Query Tab & Standard SQL Formatter
  - Query Validator (Bytes scanned preview)
  - Results & Preview tabs

### Slide 6: Dataset Setup Checklist
- **Title:** Verifying Access to Training Dataset
- **Command / Script:** `00_setup_schema_and_data.sql`
- **Tables Created in `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics`:**
  - `lux_crm_customers`
  - `lux_online_orders`
  - `lux_ad_spend`
  - `lux_raw_marketing_leads_dirty`

---

## Block 2: Exploring & Preparing Data (16:00 - 16:45)

### Slide 7: SQL Query Building Blocks
- **Title:** Anatomy of a Standard SQL Query
- **Syntax Breakdown:** `SELECT` -> `FROM` -> `WHERE` -> `GROUP BY` -> `HAVING` -> `ORDER BY` -> `LIMIT`.
- **Pro-Tip:** Always run `SELECT COUNT(*)` or check the schema preview before scanning massive tables!

### Slide 8: Essential Aggregations for Marketers
- **Title:** Summarizing Campaign & E-Commerce Metrics
- **Core Functions:** `COUNT()`, `COUNT(DISTINCT)`, `SUM()`, `AVG()`, `MIN()`, `MAX()`.
- **Code Example:** Calculating Total Revenue and Average Order Value (AOV) by Brand.

### Slide 9: Filtering & Conditional Logic
- **Title:** Slicing Data with `WHERE` & `CASE WHEN`
- **Concepts:** Combining multi-condition logic (`AND`, `OR`, `IN`, `BETWEEN`).
- **Use Case:** Segmenting customer purchases above €150 into tier buckets.

### Slide 10: Hands-on Challenge #1 - "The Data Explorer"
- **Title:** Challenge #1: "The Data Explorer" (20 Mins)
- **Task Overview:**
  - Q1: Revenue ranking by brand.
  - Q2: Discount impact analysis per channel.
  - Q3: High-performing ad campaign filter (Low cost per conversion).
  - Q4 (Bonus): Revenue breakdown by customer loyalty tier.
- **Facilitator Notes:** Walk around the room and check Zoom chat breakout assistance.

### Slide 11: Challenge #1 Solution Debrief
- **Title:** Solution Walkthrough & Key Insights
- **Display Code:** Highlighting optimal `GROUP BY` and `SAFE_DIVIDE` usage.
- **Business Insight:** Displaying top revenue channels (E-Commerce Direct vs Retail Store vs App).

---

## ☕ Coffee Break (16:45 - 17:00)

---

## Block 3: Advanced Querying & Multi-Source Combination (17:00 - 17:45)

### Slide 12: Multi-Source Data Combination Overview
- **Title:** Unifying Siloed Marketing Data
- **Visual:** Connecting CRM + E-Commerce + Digital Ad Spend (Google, Meta, TikTok).
- **Two Paths:** Stacking rows vertically (`UNIONS`) vs Joining attributes horizontally (`JOINS`).

### Slide 13: Vertical Combination - `UNION ALL` vs `UNION DISTINCT`
- **Title:** Appending Cross-Channel Data Feeds
- **Diagram:** Comparing `UNION ALL` (keep duplicates, faster) vs `UNION DISTINCT` (deduplicate).
- **Luxottica Example:** Combining direct E-Commerce transactions with retail store order logs.

### Slide 14: Horizontal Combination - SQL Joins Demystified
- **Title:** `INNER JOIN`, `LEFT JOIN`, and `FULL OUTER JOIN`
- **Venn Diagrams:** Explaining Join mechanics cleanly.
- **Critical Rule:** Primary Keys vs Foreign Keys in BigQuery to avoid fan-out revenue duplication!

### Slide 15: Cross-Channel Analytics - Calculating Brand ROAS
- **Title:** Return on Ad Spend (ROAS) Calculation
- **Code Breakdown:** Using CTEs (`WITH` clauses) to aggregate Ad Spend and Revenue independently before joining on `brand`.
- **Formula:** `ROAS = Total Revenue / Total Ad Spend`

---

## Block 4: Data Cleaning & Transformation (17:45 - 18:15)

### Slide 16: Data Quality & Integrity in Marketing
- **Title:** The High Cost of Dirty Marketing Data
- **Common Issues:** Whitespace, casing mismatch, raw currency symbols, inconsistent dates, duplicate leads.
- **Target Goal:** Raw Dirty Table -> Clean Standardized View.

### Slide 17: SQL Data Wrangling Toolkit
- **Title:** Essential BigQuery String & Type Functions
- **String Helpers:** `TRIM()`, `LOWER()`, `REGEXP_REPLACE()`.
- **Safe Conversion:** `SAFE_CAST()` to prevent runtime crashes.
- **Date Handling:** `PARSE_DATE('%d/%m/%Y', date_str)`.

### Slide 18: Modern Deduplication with `QUALIFY`
- **Title:** Window Functions & `QUALIFY` Clause
- **Why QUALIFY?** Filters `ROW_NUMBER() OVER(...)` in a single query block without complex nested subqueries!

### Slide 19: Hands-on Challenge #2 - "The Clean Slate"
- **Title:** Challenge #2: "The Clean Slate" (20 Mins)
- **Task:** Transform `lux_raw_marketing_leads_dirty` into `v_clean_marketing_leads`.
- **Requirements Checklist:** Trim IDs, standardize brand names, parse heterogeneous dates, extract clean spend, deduplicate emails.

### Slide 20: Challenge #2 Solution Walkthrough
- **Title:** "The Clean Slate" Solution & View Creation
- **Code Review:** Reviewing the SQL statement that outputs clean, analysis-ready reporting view.

---

## Block 5: Key Takeaways, Wrap-up & Security (18:15 - 18:30)

### Slide 21: Executive Summary & Business Insights
- **Title:** Business Insights Produced by Teams
- **Highlights:**
  - Multi-channel ROAS performance across Ray-Ban, Oakley, Persol.
  - Loyalty tier revenue distribution.
  - Automated data cleaning pipeline savings.

### Slide 22: Security, Governance & Compliance Spotlight
- **Title:** Data Privacy Architecture in BigQuery
- **Key Pillar:** Isolated Cloud Tenant & Enterprise Security
- **Points:**
  - Row-Level & Column-Level Security (Data Masking for PII emails/phones).
  - CMEK (Customer-Managed Encryption Keys) & IAM Role-Based Access Control.
  - Compliance with GDPR & regional privacy regulations.

### Slide 23: Next Steps & Continuous Learning Resources
- **Title:** Keeping Your Skills Sharp
- **Resources:**
  - Luxottica BigQuery Query Repository & Best Practices Guide.
  - Looker Studio Integration for Automated Dashboards.
  - Q&A & Trainer Feedback Form.
