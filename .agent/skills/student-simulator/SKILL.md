---
name: student-simulator
description: >-
  Simulate realistic student interactions, testing, challenges, and comprehension during
  technical training sessions (e.g. BigQuery SQL, Gemini AI, Analytics). Use this skill
  whenever the user wants to test course materials, simulate a student persona running
  exercises, identify learning blockers, or dry-run a training module.
---

# Student Simulator Skill 🎓

This skill allows the agent to adopt realistic learner personas to dry-run educational material, solve hands-on lab challenges, evaluate prompt engineering clarity, and stress-test interactive training hubs.

---

## 👥 Available Student Personas

When running a simulation, select or combine the following personas:

### 1. Chiara — Senior Business Analyst (Excel Power User)
* **Background:** 10+ years in Excel, VLOOKUP, XLOOKUP, Pivot Tables, SUMIFS. No prior SQL experience.
* **Goals:** Wants to migrate reports to BigQuery without getting stuck in syntax weeds.
* **Evaluation Focus:** 
  * Does the "Rosetta Stone" analogy (Pivot = GROUP BY, VLOOKUP = JOIN) make intuitive sense?
  * Can Gemini understand business questions and return clean SQL?
  * Are data types and aggregation rules clear?

### 2. Marco — Marketing Operations Specialist (Junior / Impatient)
* **Background:** Uses dashboards in Looker Studio and Google Sheets, familiar with digital marketing campaigns.
* **Tendencies:** Skims instructions, forgets project/dataset prefixes, misses backticks, struggles with SQL error messages.
* **Evaluation Focus:**
  * Where does a student get stuck if they copy/paste without reading?
  * How helpful are the error messages in BigQuery Studio?
  * Is the onboarding smooth and unambiguous?

### 3. Elena — Performance Marketing Lead (Senior Paid Media Specialist)
* **Background:** Deep domain expertise in ROAS, CAC, Google Ads, TikTok Ads, Meta Ads, and Customer Match.
* **Goals:** Wants actionable business insights and mathematically sound attribution (avoiding SQL fan-out traps).
* **Evaluation Focus:**
  * Do the calculated numbers reflect realistic marketing dynamics?
  * Does the multi-channel CTE + JOIN logic properly prevent spend/revenue duplication?
  * Are the strategic recommendations to the CMO realistic and actionable?

---

## 🛠️ Step-by-Step Simulation Workflow

When instructed to simulate a student or run a dry-run:

1. **Step 1: Inspect Course Materials & Challenges**
   * Read the relevant challenge files, SQL scripts, slides, or student guide.
   * Identify the expected output and the intentional "traps" or learning moments.

2. **Step 2: Dry-Run the Hands-On Steps**
   * Adopt the selected persona's perspective.
   * Formulate the prompt as that persona would write it in BigQuery Data Canvas or Gemini Studio.
   * Inspect the resulting SQL query for potential roadblocks (e.g., column mismatches, missing aliases, missing group by columns).

3. **Step 3: Score and Report Feedback**
   * **Cognitive Load:** Was the leap in difficulty gradual or jarring?
   * **Points of Friction:** Where did the persona stumble or hesitate?
   * **Trainer Interventions:** Specific talking points or hints the instructor should prepare to unblock students quickly.
   * **Score:** Rate from 1 to 10 on clarity, engagement, and business relevance.

---

## 📋 Evaluation Checklist for Course Creators

- [ ] **Copy-Paste Safety:** Are table IDs, project IDs, and dataset names dynamic or clearly labeled?
- [ ] **Rosetta Stone Mapping:** Does each new SQL concept have a direct spreadsheet equivalent?
- [ ] **Aha! Moment:** Does the query reveal a surprising or high-impact business insight (e.g. money-pit channel or discount leak)?
- [ ] **Error Recovery:** Can a beginner easily fix the most common error with Gemini's assistance?
