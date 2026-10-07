# Luxottica Training: BigQuery for Data Analysis
## Mastering Marketing Data with BigQuery SQL

Welcome to the official repository for the **Luxottica Training Workshop: Mastering Marketing Data with BigQuery SQL**.

---

## 📅 Workshop Details
- **Target Audience:** Global Analytics, Business Analyst, Digital Commerce & Retail Operations
- **Date & Time:** Oct 12th, 2026 | 15:30 - 18:30 (3 Hours / 180 Minutes)
- **Format:** Hybrid (In-Person & Remote Connection)
- **Methodology:** Interactive Hands-on

---

## 📂 Repository Structure

```
.
├── README.md                                  # Repository Overview & Quick Start
├── trainer_guide.md                           # Facilitator Checklist & Minute-by-Minute Schedule
├── dataset/
│   └── 00_setup_schema_and_data.sql           # Complete BigQuery Standard SQL Dataset Seed Script
├── handouts/
│   ├── 01_fundamentals_and_exploration.md     # Block 1 & 2 Concepts, Console Guide & Starter SQL
│   ├── 02_advanced_querying.md                # Block 3 UNIONS, JOINS & Multi-Source Cross-Channel Analytics
│   └── 03_data_cleaning_and_transformation.md # Block 4 Data Integrity, String/Date Wrangling & QUALIFY
├── challenges/
│   ├── challenge_1_data_explorer.sql          # Hands-on Challenge #1 Exercises
│   ├── challenge_1_solutions.sql              # Challenge #1 Solution Queries
│   ├── challenge_2_clean_slate.sql            # Hands-on Challenge #2 Exercises
│   └── challenge_2_solutions.sql              # Challenge #2 Solution View Script
└── slides/
    └── slide_deck_outline.md                  # Complete Slide Deck Outline & Speaker Script
```

---

## 🚀 Quick Start for Trainers & Participants

### Step 1: Environment Setup
1. Log into Google Cloud Console and open [BigQuery Studio](https://console.cloud.google.com/bigquery).
2. Create or select target dataset: `luxottica_marketing_analytics`.
3. Open a new SQL Query tab, paste the contents of `dataset/00_setup_schema_and_data.sql`, and execute.
4. Verify the 4 created tables: `lux_crm_customers`, `lux_online_orders`, `lux_ad_spend`, `lux_raw_marketing_leads_dirty`.

### Step 2: Hands-on Execution
- **Block 2 (16:00 - 16:45):** Open `challenges/challenge_1_data_explorer.sql` for Challenge #1.
- **Block 4 (17:45 - 18:15):** Open `challenges/challenge_2_clean_slate.sql` for Challenge #2.

---

## 🔒 Security & Compliance Spotlight
All datasets use sanitized mock schema structure modeling Luxottica's real-world business dynamics (Ray-Ban, Oakley, Persol, Oliver Peoples, Vogue Eyewear) and operate safely within an isolated BigQuery project tenant.
