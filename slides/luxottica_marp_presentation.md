---
marp: true
theme: default
paginate: true
header: 'Google Cloud | Luxottica BigQuery Masterclass'
footer: 'Luxottica Data Analytics Workshop'
---

<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800&family=Roboto+Mono:wght@400;500;700&display=swap');

:root {
  --color-background: #ffffff;
  --color-foreground: #202124;
  --color-heading: #1a73e8;
  --color-blue: #4285f4;
  --color-red: #ea4335;
  --color-yellow: #fbbc05;
  --color-green: #34a853;
  --font-default: 'Plus Jakarta Sans', sans-serif;
}

section {
  background-color: var(--color-background);
  color: var(--color-foreground);
  font-family: var(--font-default);
  font-size: 24px;
  padding: 50px;
  box-sizing: border-box;
}

h1 {
  font-size: 48px;
  font-weight: 800;
  color: #202124;
  line-height: 1.2;
}

h2 {
  font-size: 36px;
  font-weight: 700;
  color: #202124;
  margin-bottom: 20px;
}

.g-blue { color: var(--color-blue); }
.g-red { color: var(--color-red); }
.g-yellow { color: var(--color-yellow); }
.g-green { color: var(--color-green); }

.card-red {
  background: #fce8e6;
  border-left: 6px solid var(--color-red);
  padding: 20px;
  border-radius: 12px;
}

.card-green {
  background: #e6f4ea;
  border-left: 6px solid var(--color-green);
  padding: 20px;
  border-radius: 12px;
}

.card-blue {
  background: #e8f0fe;
  border-left: 6px solid var(--color-blue);
  padding: 20px;
  border-radius: 12px;
}

.code-block {
  background: #f8f9fa;
  border: 1px solid #dadce0;
  padding: 18px;
  border-radius: 8px;
  font-family: 'Roboto Mono', monospace;
  font-size: 18px;
}

header {
  font-size: 14px;
  color: #5f6368;
}

footer {
  font-size: 14px;
  color: #80862b;
}
</style>

<!-- _class: lead -->

# Exploring and Preparing Your Data with <span class="g-blue">BigQuery SQL</span> & <span class="g-green">Studio</span>

### Unlocking High-ROAS Google Ads Growth for Luxottica

**Google Cloud & Luxottica Executive Workshop**

---

## Agenda

01. **CMO Emergency Briefing & Data Exploration**
02. **AI SQL Generation with Gemini & BigQuery Studio**
03. **High-Margin Discovery (AOV & Revenue Analysis)**
04. **Cross-Channel Campaign Performance & Google ROAS**
05. **Data Wrangling & Customer Match Activation**

---

<!-- _class: lead -->
<!-- _backgroundColor: #4285f4 -->
<!-- _color: #ffffff -->

# 01 | CMO Emergency Briefing & Data Exploration

---

## Marketing Performance vs. Budget Growth

<div class="card-red">

### 🔴 Ad Budget Growth: +35% (€4.8M Total Spend)
Heavy budget allocation across unverified 3rd-party social channels (TikTok, Criteo).

</div>

<br>

<div class="card-blue">

### 🟡 E-Commerce Revenue: FLAT (+2% to €21.5M)
Flat conversion rates across flagship online storefronts. The CMO needs a data-backed plan!

</div>

---

<!-- _class: lead -->
<!-- _backgroundColor: #ea4335 -->
<!-- _color: #ffffff -->

# 02 | AI SQL Generation with Gemini & BigQuery Studio

---

## BigQuery Studio Data Canvas & Gemini AI

### Natural Language Prompt:
> *"Calculate total orders, total revenue in EUR, and average order value (AOV) grouped by brand in luxottica_marketing_analytics."*

<div class="code-block">

```sql
SELECT 
  brand_name,
  COUNT(order_id) AS total_orders,
  ROUND(SUM(order_value_eur), 2) AS total_revenue_eur,
  ROUND(AVG(order_value_eur), 2) AS average_order_value_eur
FROM `luxottica_marketing_analytics.orders`
GROUP BY brand_name
ORDER BY total_revenue_eur DESC;
```

</div>

---

<!-- _class: lead -->
<!-- _backgroundColor: #fbbc05 -->
<!-- _color: #ffffff -->

# 03 | High-Margin Discovery & Brand Performance

---

## Brand Revenue & Average Order Value (AOV)

<div class="card-green">

### 🟢 Oliver Peoples: €396.00 AOV (Luxury Leader)
High-margin luxury brand driving e-commerce profitability.

</div>

<br>

<div class="card-blue">

### 🔵 Ray-Ban Meta Smart Glasses: > €320.00 AOV
Google Search demand surging, but daily campaign budgets run out too early in the day!

</div>

---

<!-- _class: lead -->
<!-- _backgroundColor: #34a853 -->
<!-- _color: #ffffff -->

# 04 | Cross-Channel Campaign Performance & Google ROAS

---

## Comparing Advertising ROAS Across Channels

| Platform | Daily Spend | Conversions | ROAS | Esito |
| :--- | :--- | :--- | :--- | :--- |
| **TikTok & Criteo** | €2,200/day | 8 | <span class="g-red" style="font-weight:bold;">0.7x ROAS</span> | ❌ **Wasted Spend** |
| **Google Search & Shopping** | €450/day | 120 | <span class="g-green" style="font-weight:bold;">6.8x - 8.2x</span> | 🚀 **High ROI Hero** |
| **YouTube & PMax** | €600/day | 85 | <span class="g-blue" style="font-weight:bold;">6.5x ROAS</span> | ⭐ **Scale** |

> 💡 **Key Finding:** Reallocating 60% budget from 0.7x ROAS social ads to Google Ads captures 100% of Ray-Ban Meta search demand!

---

<!-- _class: lead -->
<!-- _backgroundColor: #4285f4 -->
<!-- _color: #ffffff -->

# 05 | Data Wrangling & Customer Match Activation

---

## Preparing Leads for Google Ads Customer Match

1. **Raw Lead Ingestion:** 1,000 uncleaned records with malformed emails and mixed currency formats.
2. **Visual Data Prep:** Automated no-code cleaning rules in BigQuery Studio.
3. **Google Customer Match:** 350+ VIP leads activated for retargeting on YouTube & Search!

---

## The Q4 Google Growth Strategy for CMO

1. **Reallocate 60% Budget:** Shift funds from 0.7x ROAS social channels to Google Search & Performance Max.
2. **Capture 100% Search Share:** Eliminate budget caps on Ray-Ban Meta Smart Glasses search queries.
3. **Activate Customer Match:** Target 350+ VIP leads on YouTube Ads.
4. **Looker Studio Dashboards:** Real-time ROAS monitoring for C-Level executives.

---

<!-- _class: lead -->

# 🏆 Congratulations to the Winning Brand Detective Team!

### Thank you for completing the BigQuery Studio & Google Cloud Masterclass!

**GitHub Repository:** `github.com/mauripsale/luxottica-bigquery-training`
