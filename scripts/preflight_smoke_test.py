#!/usr/bin/env python3
"""
Luxottica BigQuery Training - Pre-Flight Smoke Test
Checks all 4 tables in qwiklabs-gcp-04-9efaa47f1d21.luxottica_marketing_analytics
"""

import sys

PROJECT_ID = "qwiklabs-gcp-04-9efaa47f1d21"
DATASET_ID = "luxottica_marketing_analytics"

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
