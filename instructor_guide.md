# 🕶️ Luxottica BigQuery Training: Instructor Master Guide (Storytelling & Gamification Edition)
**Course:** BigQuery for Data Analysis: Mastering Marketing Data with BigQuery SQL  
**GCP Project Name:** `bigquery-luxottica`  
**GCP Project ID:** `qwiklabs-gcp-04-9efaa47f1d21`  
**Project Owner:** `student-02-25b97e18011e@qwiklabs.net` (student b50b8eff)  
**Target Dataset:** `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics`  
**Target Audience:** Global Analytics, Business Analyst, Digital Commerce & Retail Operations  
**Duration:** 3 Hours / 180 Minutes (15:30 - 18:30)  
**Format:** Hybrid (In-Person & Remote Connection)

---

## 🎬 The Storytelling Narrative: "The Mystery of the Leaky Ad Budget"

> **The Executive Briefing (15:30):**  
> *"It's Q4 2026. The Luxottica CMO calls an emergency meeting: Global digital ad spend across Meta, TikTok, and Google increased by +35%, but overall online revenue growth stayed flat at +2%. The Board demands answers before approving the Q4 Holiday budget. Your team of Marketing Data Detectives has 3 hours in BigQuery Studio to solve the mystery, identify budget leaks, discover secret growth drivers, and present the Q4 Recovery Plan!"*

```mermaid
flowchart TD
    Briefing["<b>15:30 - Emergency Briefing</b><br/>CMO Dilemma: Ad Spend +35%, Revenue +2%"] --> Ch1["<b>16:15 - Chapter 1: The Leaky Bucket</b><br/><i>Uncovering high AOV Ray-Ban Meta Smart Glasses & Oliver Peoples vs TikTok Discount Leakage</i>"]
    Ch1 --> Ch2["<b>17:20 - Chapter 2: The Cross-Channel Plot Twist</b><br/><i>Calculating ROAS: TikTok Vogue (0.8x ROAS 📉) vs Google Search Oliver Peoples (6.2x ROAS 🚀)</i>"]
    Ch2 --> Ch3["<b>17:55 - Chapter 3: The Goldmine in the Trash</b><br/><i>Cleaning dirty leads to recover 350+ VIP leads worth €120,000+ & Building Looker Studio Dashboard</i>"]
    Ch3 --> Victory["<b>18:25 - Executive Board Presentation & Awarding</b><br/>Winning Brand Team presents the Q4 Recovery Plan to CMO"]
```

---

## 🏆 Gamification Rules & Brand Team Competition

1. **Divide into 4 Brand Detective Teams:**
   - 🕶️ **Team Ray-Ban** (Smart Glasses & Heritage Icons)
   - 🕶️ **Team Oakley** (Prizm Sport & Innovation)
   - 🕶️ **Team Persol** (Handmade Italian Heritage)
   - 🕶️ **Team Oliver Peoples** (Luxury Eyewear)
2. **Scoring System:**
   - **First Team to submit correct SQL query:** +100 Points
   - **Best Business Insight / Story Interpretation:** +50 Points
   - **Most Creative Looker Studio Dashboard:** +100 Points

---

## ⏱️ 180-Minute Master Schedule & Story Arc

### 🕒 15:30 - 16:00 | Block 1: Executive Briefing, Data Insights & Data Canvas (30 Mins)

- **15:30 - 15:40 (10m) | Emergency Briefing & Icebreaker**
  - Present the CMO Dilemma: Ad Spend +35%, Revenue +2%.
  - Icebreaker Poll: *"Where do you suspect the marketing money is leaking?"*

- **15:40 - 15:52 (12m) | BigQuery Studio, Data Insights & Data Canvas Demo**
  - Open dataset `qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics`.
  - **Data Insights Demo (`cloud.google.com/bigquery/docs/data-insights`):** Click *"Generate Data Insights"* to render the **Interactive Relationship Graph**. Show how Gemini maps `lux_crm_customers` -> `lux_online_orders` -> `lux_ad_spend`!
  - **Data Canvas Demo:** Show visual DAG nodes (Search, Table, SQL, Visualization, Insights Node).

- **15:52 - 16:00 (8m) | First Code-Along Query (Checking Total Revenue vs Spend)**

---

### 🕒 16:00 - 16:45 | Block 2: Chapter 1 - "The Leaky Bucket" (45 Mins)

- **16:00 - 16:15 (15m) | Core SQL Building Blocks (`SELECT`, `WHERE`, `GROUP BY`)**
- **16:15 - 16:40 (25m) | 🏆 Challenge #1: "The Data Explorer" (8 Clues)**
  - Teams investigate sales performance, brand revenue ranking, and discount leakage.
  - **Plot Twist #1 Discovered:** *Ray-Ban Meta Smart Glasses* and *Oliver Peoples* have massive Average Order Values (> €300), but heavy discount promotions on *Vogue Eyewear* are destroying margins!
- **16:40 - 16:45 (5m) | Chapter 1 Debrief & Scoreboard Update**

---

### ☕ 16:45 - 17:00 | Coffee Break (15 Mins)

---

### 🕒 17:00 - 17:45 | Block 3: Chapter 2 - "The Cross-Channel Plot Twist" (45 Mins)

- **17:00 - 17:20 (20m) | Advanced SQL: UNIONS, JOINS & CTEs**
- **17:20 - 17:40 (20m) | 🏆 Challenge #2: "Cross-Channel Intelligence" (4 Clues)**
  - Teams calculate Customer LTV and Multi-Platform Brand ROAS.
  - **Plot Twist #2 Discovered:** *TikTok Vogue Eyewear* campaigns have a disastrous **0.8x ROAS** (losing money!), while *Google Search Oliver Peoples & Persol* have a stellar **6.2x ROAS**!
- **17:40 - 17:45 (5m) | Chapter 2 Debrief & Scoreboard Update**

---

### 🕒 17:45 - 18:15 | Block 4: Chapter 3 - "The Goldmine in the Trash" (30 Mins)

- **17:45 - 17:55 (10m) | DEMO: BigQuery Studio Visual Data Prep**
  - Show Gemini suggestion cards and few-shot cell editing for data wrangling.
- **17:55 - 18:10 (15m) | 🏆 Challenge #3: "The Clean Slate" (Automated View & Looker Studio)**
  - Teams clean `lux_raw_marketing_leads_dirty` into `v_clean_marketing_leads`.
  - **Plot Twist #3 Discovered:** Cleaning the dirty leads unlocks **350+ valid VIP leads** worth over **€120,000 in Q4 revenue**!
  - **1-Click Looker Studio Demo:** Connect the View to Looker Studio to display the **CMO Executive Rescue Dashboard**!
- **18:10 - 18:15 (5m) | Chapter 3 Debrief**

---

### 🕒 18:15 - 18:30 | Block 5: The Q4 Recovery Plan & Award Ceremony (15 Mins)

- **18:15 - 18:25 (10m) | Executive Summary & Security Spotlight**
  - Summarize the Q4 Recovery Plan: Shift 40% of TikTok ad budget to Google Search Oliver Peoples & Ray-Ban Meta Smart Glasses, and activate the 350 recovered VIP leads.
  - Security Spotlight: Row/Column-level security and PII masking.
- **18:25 - 18:30 (5m) | Awarding the Winning Brand Detective Team!**
