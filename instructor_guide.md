# 🕶️ Luxottica BigQuery Training: Instructor Master Guide
**Course:** BigQuery for Data Analysis: Mastering Marketing Data with BigQuery SQL  
**Target Audience:** Global Analytics, Business Analyst, Digital Commerce & Retail Operations  
**Date & Time:** Oct 12th, 2026 | 15:30 - 18:30 (3 Hours / 180 Minutes)  
**Format:** Hybrid (In-Person & Remote Connection)

---

## 📋 1. Pre-Session Checklist & Technical Logistics

### T-24 Hours Before Session
- [ ] Confirm GCP Project Access: Ensure `lux-bq-training-2026` is active.
- [ ] Add all participant email addresses to the Google Group `bq-training-participants@luxottica.com`.
- [ ] Assign IAM Roles to the Group:
  - `roles/bigquery.jobUser` (on project level)
  - `roles/bigquery.dataViewer` (on dataset level)
  - `roles/bigquery.dataEditor` (on dataset level for Challenge #2 VIEW creation)
- [ ] Execute `dataset/00_setup_schema_and_data.sql` to populate all 4 tables in `luxottica_marketing_analytics`.
- [ ] Send `student_guide.md` and Wi-Fi / Zoom access details to all participants.

### T-60 Minutes Before Session
- [ ] Test room audio, dual screens, wireless microphone, and Zoom/Teams screen sharing.
- [ ] Open BigQuery Console (`https://console.cloud.google.com/bigquery`) and verify dataset availability.
- [ ] Open Mentimeter / Slido icebreaker poll.
- [ ] Open a blank Looker Studio window linked to `luxottica_marketing_analytics`.

---

## ⏱️ 2. Minute-by-Minute Facilitation Timeline

### 🕒 15:30 - 15:45 | Welcome, Icebreaker & Concept Hook (15 Mins)
- **Slide 1-3:** Welcome & Agenda overview.
- **Interactive Icebreaker (Mentimeter/Slido):**  
  *Prompt:* "What's the biggest pain point in your daily Excel spreadsheets?"  
  *Instructor Action:* Highlight common answers (vlookups freezing, 1M row cap, broken formulas). Connect them to BigQuery's serverless speed.
- **Excel vs EDW Analogy:**  
  Explain that BigQuery is not replacing Excel's flexibility, but taking over the heavy lifting for massive datasets.

### 🕒 15:45 - 16:00 | Hands-on Orientation & Project Pinning (15 Mins)
- **Console Walkthrough:**  
  Direct participants to `https://console.cloud.google.com/bigquery`.
- **Project Pinning Exercise:**  
  Guide participants live: Click **"+ ADD" -> "Star a project by name"** -> Type `lux-bq-training-2026`.
- **Dataset Exploration:**  
  Show participants how to click on `luxottica_marketing_analytics` and inspect table schemas (`lux_crm_customers`, `lux_online_orders`, `lux_ad_spend`, `lux_raw_marketing_leads_dirty`).

### 🕒 16:00 - 16:25 | SQL Exploration Basics & Live Code-Along (25 Mins)
- **Core Clause Order:** Explain `SELECT` -> `FROM` -> `WHERE` -> `GROUP BY` -> `ORDER BY`.
- **Excel Translation Table:**
  - `SELECT` = Picking columns in Excel
  - `WHERE` = Excel Header Filters
  - `GROUP BY` = Excel Pivot Table
  - `SUM / AVG` = Pivot Values
- **Live Code-Along Query:**  
  Write together: Revenue & Units Sold by Brand in `lux_online_orders`.
  ```sql
  SELECT brand, COUNT(order_id) AS total_orders, SUM(revenue_eur) AS total_revenue
  FROM `luxottica_marketing_analytics.lux_online_orders`
  GROUP BY brand ORDER BY total_revenue DESC;
  ```

### 🕒 16:25 - 16:45 | 🏆 Challenge #1: "The Data Explorer" (20 Mins)
- **Team Gamification Launch:**  
  Divide attendees into 4 Luxottica Brand Teams (Team Ray-Ban, Team Oakley, Team Persol, Team Oliver Peoples).
- **Task:** Participants complete Questions 1-4 in `challenge_1_data_explorer.sql`.
- **Instructor Role:** Walk the room and check Zoom chat. Assist stuck participants.
- **Solution Debrief (16:40):** Show `challenge_1_solutions.sql` and declare the winning team.

---

### ☕ 16:45 - 17:00 | Coffee Break & Catch-up Buffer

---

### 🕒 17:00 - 17:25 | Multi-Source Querying: UNIONS & JOINS (25 Mins)
- **Concept:** Combining data across platforms (CRM + Orders + Ad Spend).
- **`UNION ALL` vs `JOIN`:**  
  - Vertical (UNIONS) = Stacking rows from same format feeds.
  - Horizontal (JOINS) = Adding extra columns via matching keys (`customer_id` / `brand`).
- **Live Code-Along:** Blending Customer Loyalty Tier with Order Revenue.

### 🕒 17:25 - 17:45 | Cross-Channel ROAS Analytics (20 Mins)
- **Concept:** Calculating Return on Ad Spend (ROAS) per brand.
- **Code Demo:** Using CTEs (`WITH` clause) to aggregate spend and sales independently before joining on `brand`.
- **Key Takeaway:** How BigQuery helps marketing teams prove campaign ROI across Google Ads, Meta, and TikTok.

---

### 🕒 17:45 - 18:00 | Data Cleaning & Wrangling Toolkit (15 Mins)
- **Data Quality Principles:** Why bad data ruins campaign attribution.
- **Key Functions Demo:**
  - `TRIM()` & `LOWER()`
  - `SAFE_CAST()` (Defensive casting to avoid crashes)
  - `PARSE_DATE()` (Handling mixed date formats)
  - `QUALIFY ROW_NUMBER() OVER(...)` (Clean deduplication)
- **Simplifying Nested Fields Note:** Keep `ARRAY` / `STRUCT` explanations purely conceptual (max 3 minutes) so non-technical users stay confident.

### 🕒 18:00 - 18:15 | 🏆 Challenge #2: "The Clean Slate" + Looker Studio Demo (15 Mins)
- **Task:** Participants transform `lux_raw_marketing_leads_dirty` into `v_clean_marketing_leads` view.
- **1-Click Looker Studio Demo (18:10):**  
  Instructor opens Looker Studio directly from the created VIEW in BigQuery and shows a live, polished marketing dashboard!

---

### 🕒 18:15 - 18:30 | Executive Summary, Security & Awarding (15 Mins)
- **Executive Wrap-up:** Summary of skills gained.
- **Security & PII Spotlight:** Row-level & Column-level security, PII data masking (emails/phones), and isolated cloud tenant governance.
- **Awards & Feedback:** Declare overall winning Brand Team, distribute feedback link.

---

## 🛠️ 3. Troubleshooting & FAQs for Instructor

| Issue / Error | Root Cause | Solution / Fix |
| :--- | :--- | :--- |
| **`Table not found`** | Typo in dataset name or missing backticks. | Remind them to use full path `` `lux-bq-training-2026.luxottica_marketing_analytics.table_name` ``. |
| **`Division by zero`** | Dividing by zero in cost metrics. | Replace `a / b` with `SAFE_DIVIDE(a, b)`. |
| **`Cannot parse date`** | Mixed date format string (`02/09/2026` vs `2026-09-01`). | Use `CASE WHEN string LIKE '%/%' THEN PARSE_DATE('%d/%m/%Y', string) ...` |
