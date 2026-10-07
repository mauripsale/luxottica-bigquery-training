# Luxottica Training: BigQuery for Data Analysis
## Mastering Marketing Data with BigQuery SQL & BigQuery Studio

Welcome to the official repository for the **Luxottica Training Workshop: Mastering Marketing Data with BigQuery SQL & BigQuery Studio**.

---

## 📅 Workshop Details
- **GCP Project Name:** `bigquery-luxottica`
- **GCP Project ID:** `qwiklabs-gcp-04-9efaa47f1d21`
- **Project Owner:** `student-02-25b97e18011e@qwiklabs.net`
- **Target Dataset:** `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics`
- **Target Audience:** Global Analytics, Business Analyst, Digital Commerce & Retail Operations
- **Date & Time:** Oct 12th, 2026 | 15:30 - 18:30 (3 Hours / 180 Minutes)
- **Format:** Hybrid (In-Person & Remote Connection)
- **Methodology:** Interactive Hands-on

---

## 📂 Repository Structure

```
.
├── README.md                                  # Repository Overview & Quick Start
├── instructor_guide.md                        # Complete 180-Minute Instructor Facilitation Script
├── student_guide.md                           # Student Participant Guide & Cheat Sheet
├── dataset/
│   └── 00_setup_schema_and_data.sql           # Rich Seed Script (Hundreds of realistic records)
├── handouts/
│   ├── 01_fundamentals_and_exploration.md     # Block 1 & 2 Concepts, BigQuery Data Canvas & Starter SQL
│   ├── 02_advanced_querying.md                # Block 3 UNIONS, JOINS & Multi-Source Cross-Channel Analytics
│   └── 03_data_cleaning_and_transformation.md # Block 4 BigQuery Visual Data Prep, Wrangling & QUALIFY
├── challenges/
│   ├── challenge_1_data_explorer.sql          # Block 2: Challenge #1 Exercises (8 Business Questions)
│   ├── challenge_1_solutions.sql              # Challenge #1 Solution Queries
│   ├── challenge_2_cross_channel.sql          # Block 3: Challenge #2 Exercises (ROAS & Multi-table JOINS)
│   ├── challenge_2_solutions.sql              # Challenge #2 Solution Queries
│   ├── challenge_3_clean_slate.sql            # Block 4: Challenge #3 Exercises (Building Automated View)
│   └── challenge_3_solutions.sql              # Challenge #3 Solution View Script
└── slides/
    └── slide_deck_outline.md                  # Complete Slide Deck Outline & Speaker Script
```

---

## 🚀 Quick Start for Trainers & Participants

### Step 1: Environment Setup
1. Log into Google Cloud Console and open [BigQuery Studio](https://console.cloud.google.com/bigquery?project=qwiklabs-gcp-04-9efaa47f1d21).
2. Verify target dataset exists: `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics`.
3. Open a new SQL Query tab, paste the contents of `dataset/00_setup_schema_and_data.sql`, and execute.
4. Verify created tables: `lux_crm_customers` (50 rows), `lux_online_orders` (120 rows), `lux_ad_spend` (60 rows), `lux_raw_marketing_leads_dirty` (30 rows).

### Step 2: Hands-on Execution Across the 3 Hours
- **Block 1 (15:40 - 15:52):** BigQuery Data Canvas orientation (Search Nodes, Table Nodes, SQL Nodes).
- **Block 2 (16:15 - 16:40):** Challenge #1 (`challenges/challenge_1_data_explorer.sql`).
- **Block 3 (17:20 - 17:40):** Challenge #2 (`challenges/challenge_2_cross_channel.sql`).
- **Block 4 (17:45 - 18:10):** Visual Data Prep & Challenge #3 (`challenges/challenge_3_clean_slate.sql`).

---

## 🔒 Security & Compliance Spotlight
All datasets use sanitized mock schema structure modeling Luxottica's real-world business dynamics (Ray-Ban, Oakley, Persol, Oliver Peoples, Vogue Eyewear) and operate safely within the isolated BigQuery project `qwiklabs-gcp-04-9efaa47f1d21`.
