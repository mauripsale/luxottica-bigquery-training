---
marp: true
theme: default
paginate: true
header: '🕶️ Google Cloud & Luxottica | BigQuery Masterclass'
footer: 'Project: qwiklabs-gcp-04-9efaa47f1d21'
---

<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800;900&display=swap');

:root {
  --color-background: #060913;
  --color-foreground: #f3f4f6;
  --color-heading: #4285f4;
  --color-accent: #34a853;
  --color-red: #ea4335;
  --color-yellow: #fbbc05;
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
  font-size: 52px;
  font-weight: 900;
  color: #ffffff;
  line-height: 1.2;
}

h2 {
  font-size: 38px;
  font-weight: 800;
  color: var(--color-heading);
  margin-bottom: 20px;
}

.gradient-text {
  background: linear-gradient(135deg, #4285f4, #34a853, #fbbc05, #ea4335);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.card-red {
  background: rgba(234, 67, 53, 0.15);
  border-left: 6px solid var(--color-red);
  padding: 20px;
  border-radius: 12px;
}

.card-green {
  background: rgba(52, 168, 83, 0.15);
  border-left: 6px solid var(--color-accent);
  padding: 20px;
  border-radius: 12px;
}

.card-blue {
  background: rgba(66, 133, 244, 0.15);
  border-left: 6px solid var(--color-heading);
  padding: 20px;
  border-radius: 12px;
}

.stat-number {
  font-size: 48px;
  font-weight: 900;
}

header {
  font-size: 14px;
  color: #9ca3af;
}

footer {
  font-size: 14px;
  color: #6b7280;
}
</style>

<!-- _class: lead -->
<!-- _backgroundColor: #0b0f19 -->

# Mastering Marketing Data with <br><span class="gradient-text">BigQuery SQL & Studio</span>

### Unlocking High-ROAS Google Ads Growth & Capturing Ray-Ban Meta Demand

**Luxottica Global Analytics & Digital Commerce Workshop**

---

## 🚨 CMO Emergency Briefing

<div class="card-red">

### 🔴 Ad Spend Surge: +35% (€4.8M Total Spend)
Experimental spending on 3rd-party social networks (TikTok/Criteo) assorbe il budget in perdita.

</div>

<br>

<div class="card-blue">

### 🟡 E-Commerce Growth: FLAT (+2% Revenue)
Fatturato online stagnante a €21.5M. Il CMO chiede un piano data-backed per azzerare gli sprechi!

</div>

---

## 🏆 4 Brand Detective Teams

- 🕶️ **Team Ray-Ban** (Smart Glasses & Heritage Icons)
- 🕶️ **Team Oakley** (Prizm Sport Technology)
- 🕶️ **Team Persol** (Handcrafted Italian Luxury)
- 🕶️ **Team Oliver Peoples** (High-AOV Luxury Eyewear)

<br>

| Sfida | Punteggio | Obiettivo |
| :--- | :--- | :--- |
| **Prima Query SQL** | <span style="color:#fbbc05; font-weight:bold;">+100 PTS</span> | Esegui per primo la query in BigQuery Studio |
| **Migliore Insight** | <span style="color:#4285f4; font-weight:bold;">+50 PTS</span> | Interpreta i dati per il CMO |
| **Looker Dashboard** | <span style="color:#34a853; font-weight:bold;">+100 PTS</span> | Crea la vista executive per il C-Level |

---

## 🤖 BigQuery Studio Data Canvas & Gemini AI

### Prompt in Linguaggio Naturale:
> *"Calcola il totale ordini, il fatturato in Euro e lo scontrino medio per brand nel dataset luxottica_marketing_analytics"*

<br>

- **Gemini SQL Generator:** Traduce la domanda in codice SQL pulito.
- **Grafo Visivo (DAG):** Collega tabelle CRM, ordini e spesa adv senza join manuali.
- **AI Insights:** Evidenzia immediatamente i prodotti a margine più elevato.

---

## 🔎 Chapter 1: High Margin Discovery

<div class="card-green">

### 🟢 Oliver Peoples: €396 AOV (Scontrino Medio)
Brand di lusso ad altissimo margine che trascina la redditività e-commerce.

</div>

<br>

<div class="card-blue">

### 🔵 Ray-Ban Meta Smart Glasses: > €320 AOV
Domanda di ricerca alle stelle su Google Search, ma il budget giornaliero si esaurisce troppo presto!

</div>

---

## 📊 Chapter 2: The Google Ads ROAS Revelation

| Piattaforma Adv | Spesa / Giorno | Conversioni | ROAS Calcolato | Esito |
| :--- | :--- | :--- | :--- | :--- |
| **TikTok & Criteo** | €2,200 | 8 | <span style="color:#ea4335; font-weight:bold;">0.7x ROAS</span> | ❌ **Spreco** |
| **Google Search & Shopping** | €450 | 120 | <span style="color:#34a853; font-weight:bold;">6.8x - 8.2x</span> | 🚀 **Hero** |
| **YouTube & PMax** | €600 | 85 | <span style="color:#4285f4; font-weight:bold;">6.5x ROAS</span> | ⭐ **Scala** |

> 💡 **Plot Twist:** Riallocando il 60% del budget dai social terzi a Google Ads, Luxottica cattura il 100% della domanda Smart Glasses!

---

## 🧹 Chapter 3: Google Ads Customer Match

1. **Raw Dirty Leads:** 1,000 lead disordinati con email sporche e formati valuta misti.
2. **Visual Data Prep:** Pulizia automatica no-code con BigQuery Studio.
3. **350+ VIP Customer Match:** Lead con spesa > €200 sbloccati per retargeting su YouTube Ads e Google Search!

---

## 📊 The Q4 Google Growth Plan for CMO

1. **Riallocare il 60% del Budget:** Spostare i fondi dai social terzi inefficienti a Google Search, Shopping e Performance Max.
2. **100% Search Share:** Coprire sempre la domanda di ricerca su Ray-Ban Meta Smart Glasses.
3. **Attivare Customer Match:** Reingaggiare i 350+ lead VIP su YouTube Ads.
4. **Looker Studio Dashboard:** Monitoraggio in tempo reale per il C-Level!

---

<!-- _class: lead -->
<!-- _backgroundColor: #0b0f19 -->

# 🏆 Premiazione Brand Detective Team Vincitore!

### Grazie per aver completato il workshop BigQuery Studio & Google Cloud!

**Repository GitHub:** `github.com/mauripsale/luxottica-bigquery-training`
