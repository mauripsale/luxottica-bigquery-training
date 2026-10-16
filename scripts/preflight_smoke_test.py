#!/usr/bin/env python3
"""
Luxottica BigQuery Training - Pre-Flight Smoke Test
Checks all 4 tables in <PROJECT_ID>.luxottica_marketing_analytics
"""

import os
import subprocess
import sys

def get_project_id():
    if len(sys.argv) > 1 and not sys.argv[1].startswith("-"):
        return sys.argv[1]
    if os.environ.get("GCP_PROJECT_ID"):
        return os.environ.get("GCP_PROJECT_ID")
    try:
        proc = subprocess.run(["gcloud", "config", "get-value", "project"], capture_output=True, text=True, check=True)
        proj = proc.stdout.strip()
        if proj:
            return proj
    except Exception:
        pass
    return "qwiklabs-asl-02-9bb3224716de"

PROJECT_ID = get_project_id()
DATASET_ID = os.environ.get("BQ_DATASET_ID", "luxottica_marketing_analytics")

EXPECTED_TABLES = [
    ("lux_online_orders", "Transazioni E-commerce & Store Direct"),
    ("lux_ad_spend", "Costi Advertising Google/Meta/TikTok"),
    ("lux_crm_customers", "Anagrafica Clienti & Segmenti VIP"),
    ("lux_raw_marketing_leads_dirty", "Lead Marketing da Normalizzare")
]

SMOKE_TEST_QUERY = f"""
SELECT 
  'lux_online_orders' AS table_name, COUNT(*) AS row_count FROM `{PROJECT_ID}.{DATASET_ID}.lux_online_orders`
UNION ALL
SELECT 
  'lux_ad_spend' AS table_name, COUNT(*) AS row_count FROM `{PROJECT_ID}.{DATASET_ID}.lux_ad_spend`
UNION ALL
SELECT 
  'lux_crm_customers' AS table_name, COUNT(*) AS row_count FROM `{PROJECT_ID}.{DATASET_ID}.lux_crm_customers`
UNION ALL
SELECT 
  'lux_raw_marketing_leads_dirty' AS table_name, COUNT(*) AS row_count FROM `{PROJECT_ID}.{DATASET_ID}.lux_raw_marketing_leads_dirty`
"""

def print_banner():
    print("=" * 65)
    print(" 🕶️ LUXOTTICA BIGQUERY WORKSHOP - VERIFICA PRE-CORSO 4 TABELLE")
    print("=" * 65)
    print(f" Progetto: {PROJECT_ID}")
    print(f" Dataset:  {DATASET_ID}")
    print("-" * 65)
    for table, desc in EXPECTED_TABLES:
        print(f"  • {table:<30} -> {desc}")
    print("-" * 65)

def main():
    print_banner()
    print("\n[INFO] Per verificare le tabelle prima del workshop:")
    print("1. In BigQuery Studio incolla ed esegui la seguente query:\n")
    print(SMOKE_TEST_QUERY.strip())
    print("\n[OK] Se tutte le 4 tabelle restituiscono > 0 righe, l'aula è pronta al 100%!")

if __name__ == "__main__":
    main()
