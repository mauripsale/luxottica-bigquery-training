# Trainer Facilitation Guide & Execution Manual
**Course Title:** BigQuery for Data Analysis: Mastering Marketing Data with BigQuery SQL  
**Client:** Luxottica  
**Date & Time:** Oct 12th, 2026 | 15:30 - 18:30 (3 Hours / 180 Mins)  
**Format:** Hybrid (In-Person & Remote Connection)

---

## 1. Pre-Session Checklist (T-60 Minutes)

### 1.1 Technical Setup
- [ ] Verify access to GCP Project & BigQuery Console (`https://console.cloud.google.com/bigquery`).
- [ ] Run `dataset/00_setup_schema_and_data.sql` to instantiate the 4 Luxottica sample tables.
- [ ] Confirm IAM permissions for participants (`BigQuery Data Viewer` and `BigQuery Job User`).
- [ ] Test screen sharing, microphone, audio levels, and Zoom/Teams chat for remote attendees.

### 1.2 Room & Hybrid Setup
- [ ] Ensure dual screens in the room: One for presentation slides, one showing live BigQuery console.
- [ ] Assign a dedicated co-facilitator or TA (Teaching Assistant) to monitor remote chat queries.
- [ ] Display Wi-Fi credentials and BigQuery console URL on the welcome screen.

---

## 2. Minute-by-Minute Session Schedule

| Time | Block | Topic | Facilitator Action | Participant Action |
| :--- | :--- | :--- | :--- | :--- |
| **15:30 - 15:45** | Block 1 | Welcome, Context & EDW Concepts | Slide 1-4 presentation. Explain EDW vs Spreadsheets. | Follow slides, ask initial questions. |
| **15:45 - 16:00** | Block 1 | Console Orientation & Dataset Verification | Live Console Walkthrough. Guide schema preview. | Open BigQuery UI, verify tables exist. |
| **16:00 - 16:25** | Block 2 | SQL Exploration Basics (`SELECT`, `WHERE`, `GROUP BY`) | Demonstrate live SQL query building. | Code along in BigQuery editor tab. |
| **16:25 - 16:45** | Block 2 | **Hands-on Challenge #1: "The Data Explorer"** | Launch Challenge 1. Monitor room & remote chat. | Execute SQL queries in `challenge_1_data_explorer.sql`. |
| **16:45 - 17:00** | ☕ | **Coffee Break** | Answer casual questions, ensure catch-up for struggling users. | Break / Networking. |
| **17:00 - 17:25** | Block 3 | Multi-Source Integration (`UNIONS` & `JOINS`) | Present Slides 12-15. Live demo of ROAS calculation query. | Practice writing CTEs and JOINs. |
| **17:25 - 17:45** | Block 3 | Cross-Channel CRM & Ad Spend Blending | Walkthrough CRM + E-Commerce + Ad Spend query. | Run cross-channel queries. |
| **17:45 - 18:00** | Block 4 | Data Integrity & SQL Wrangling Toolkit | Explain `TRIM`, `SAFE_CAST`, `PARSE_DATE`, `QUALIFY`. | Follow cleaning functions demo. |
| **18:00 - 18:15** | Block 4 | **Hands-on Challenge #2: "The Clean Slate"** | Launch Challenge 2 view creation exercise. | Write cleanup VIEW query. |
| **18:15 - 18:30** | Wrap-up | Executive Insights, Security & Spotlight | Present Challenge 2 solution, showcase insights & security. | Final Q&A & feedback form. |

---

## 3. Hybrid Session Management Tips

1. **Dual Focus:** Address both in-person attendees and remote video camera equally.
2. **Remote Chat Interaction:** Prompt remote participants by name or run quick Zoom polls during transitions.
3. **Pacing Control:** Keep query snippets on screen for at least 60 seconds before moving to the next query.
4. **Error Debugging:** Have remote users share their query error message in chat; co-facilitator provides instant syntax corrections.

---

## 4. FAQ & Common Troubleshooting During Workshop

### Q1: "Syntax Error: Table not found"
- **Cause:** Participant misspelled dataset name or omitted backticks around dataset/table names.
- **Fix:** Remind them to use full project syntax: `` `project_id.dataset_id.table_name` `` or select target dataset in the query editor dropdown.

### Q2: "Query execution error: Division by zero"
- **Cause:** Calculating ratios like `spend / conversions` when conversions = 0.
- **Fix:** Use `SAFE_DIVIDE(numerator, denominator)` which returns `NULL` instead of throwing a division-by-zero error.

### Q3: "Date parsing error: Invalid format"
- **Cause:** Mixed date formats in raw string column.
- **Fix:** Use `CASE WHEN date_str LIKE '%/%' THEN PARSE_DATE('%d/%m/%Y', date_str) ...` logic as shown in Module 3.

---

## 5. Post-Session Follow-Up Checklist
- [ ] Share completed SQL solution files (`challenge_1_solutions.sql` and `challenge_2_solutions.sql`) with all participants.
- [ ] Provide slide deck PDF export link.
- [ ] Send feedback questionnaire.
