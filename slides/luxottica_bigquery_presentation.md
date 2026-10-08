---
marp: true
theme: gaia
_class: lead
paginate: true
backgroundColor: #1a1a2e
color: #ffffff
style: |
  section {
    font-family: 'Google Sans', 'Helvetica Neue', Arial, sans-serif;
    padding: 40px 60px;
  }
  h1, h2, h3 {
    color: #4285f4;
  }
  footer {
    font-size: 14px;
    color: #888888;
  }
  .highlight {
    background-color: #34a853;
    color: #ffffff;
    padding: 4px 12px;
    border-radius: 4px;
  }
  .badge-google {
    background-color: #ea4335;
    color: white;
    padding: 4px 12px;
    border-radius: 4px;
    font-weight: bold;
  }
  code {
    background-color: #0f3460;
    color: #e94560;
  }
---

<!-- _backgroundColor: #0f3460 -->
<!-- _color: #ffffff -->

# 🕶️ BigQuery for Data Analysis
### Mastering Marketing Data with BigQuery SQL & Studio
**Luxottica Global Analytics & Digital Commerce Workshop**

`Project GCP:` **`qwiklabs-gcp-04-9efaa47f1d21`**

---

## 🚨 Executive Mission Briefing: The Q4 Dilemma

- **The CMO's Challenge:** Global digital ad spend increased by **+35%**, but online e-commerce revenue growth remained flat at **+2%**.
- **The Core Question:** *Where is the marketing budget leaking, and how do we unlock high-ROAS growth for Luxottica?*
- **Your 3-Hour Mission:**
  1. Explore 116,000+ records in BigQuery Studio.
  2. Uncover budget waste on third-party networks.
  3. Prove the high-ROAS growth power of **Google Ads** (Search, Shopping, YouTube, PMax).
  4. Present the Q4 Growth Plan to the CMO!

---

## 🏆 Gamification & Brand Detective Teams

### 4 Brand Detective Teams
- 🕶️ **Team Ray-Ban** (Smart Glasses & Heritage Icons)
- 🕶️ **Team Oakley** (Prizm Sport Technology)
- 🕶️ **Team Persol** (Italian Handcrafted Luxury)
- 🕶️ **Team Oliver Peoples** (High-AOV Luxury Eyewear)

### 📊 Point Scoring System
- **+100 Points:** First team with the correct SQL query!
- **+50 Points:** Best business insight / storytelling interpretation.
- **+100 Points:** Most creative Looker Studio Executive Dashboard.

---

## 🎨 BigQuery Studio: Data Canvas & Gemini AI

- **Visual Node Analytics (DAG):** Map relationships between `lux_crm_customers` $\rightarrow$ `lux_online_orders` $\rightarrow$ `lux_ad_spend`.
- **Natural Language Prompts:** Type plain Italian/English requests to auto-generate queries and charts.
- **Gemini Insights Node:** Automated executive summaries generated directly from data visualizations.

```sql
-- Prompt in Data Canvas:
-- "Show total sales and average order value by brand in dataset luxottica_marketing_analytics"
```

---

## 🔍 Chapter 1: High Margin Discovery

### What the Data Reveals:
- **Oliver Peoples:** Top revenue leader (€3.96M) with premium AOV (**€396.00**).
- **Ray-Ban Meta Smart Glasses:** High-margin category (**€320.00+ AOV**).
- **Vogue Eyewear:** Lagging performance (€1.29M) due to heavy promotional discounting (**€129.00 AOV**).

> **Plot Twist #1:** Ray-Ban Meta Smart Glasses represent Luxottica's biggest margin expansion opportunity, but online sales are capped! Why?

---

## ☕ Coffee Break (15 Minutes)

- Network with your Brand Detective Team!
- Review your score on the Leaderboard.
- Get ready for **Multi-Source Cross-Channel Analytics** in Chapter 2!

---

## 📈 Chapter 2: The Google ROAS Revelation

### Cross-Channel Performance Analysis (SQL JOINS)

| Channel / Platform | Spend (€) | Revenue (€) | ROAS | Verdict |
| :--- | :--- | :--- | :--- | :--- |
| **TikTok / Criteo (3rd-Party Social)** | €2,200/day | Low | < **0.8x** | ❌ **Budget Waste!** |
| **Google Search & Shopping** | €450/day | Massive | **6.8x - 8.2x** | 🚀 **High-ROAS Hero!** |
| **YouTube Ads & PMax** | €600/day | High | **6.5x+** | 🚀 **Scale Channel!** |

> **Plot Twist #2:** Luxottica was running out of daily budget on Google Search by midday because funds were trapped in low-performing third-party networks!

---

## 🧹 Chapter 3: Data Wrangling & Google Ads Customer Match

- **Dirty Data Problem:** 1,000 messy lead records in `lux_raw_marketing_leads_dirty` (untrimmed spaces, uppercase emails, mixed currency formats).
- **Gemini Visual Data Prep:** Clean data without writing manual string manipulation code!
- **350+ VIP Leads Recovered:** Leads with estimated spend > €200 siphoned directly into **Google Ads Customer Match** for high-converting retargeting!

---

## 📊 The Q4 Google Growth Strategy

1. **Riallocate 60% of Budget:** Shift funds away from 0.7x ROAS social networks to **Google Search, Shopping, YouTube Ads, and Performance Max**.
2. **Capture 100% Impression Share:** Never run out of daily budget on Google Search for *Ray-Ban Meta Smart Glasses* and *Oliver Peoples*.
3. **Activate Customer Match:** Re-engage 350+ VIP leads on YouTube Ads and Google Search.
4. **1-Click Executive Dashboard:** Real-time growth tracking on Looker Studio!

---

<!-- _backgroundColor: #0f3460 -->
<!-- _color: #ffffff -->

# 🏆 Award Ceremony & Next Steps
### Congratulations to the Winning Brand Detective Team!

- **Repository:** `github.com/mauripsale/luxottica-bigquery-training`
- **GCP Project:** `qwiklabs-gcp-04-9efaa47f1d21`

*Thank you for mastering BigQuery Studio with Google Cloud!*
