import sys
import os
import json

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, os.path.join(BASE_DIR, "v2/backend"))

from fastapi.testclient import TestClient
from app.main import app
from app.services.auth_service import AuthService

def run_qa_audit_suite():
    print("=" * 80)
    print("IPSALE ENGINE v3.0 — QA & ALLOWLIST EDGE CASE AUDIT SUITE")
    print("=" * 80)

    client = TestClient(app)
    results = {}
    bugs_found = []

    # -------------------------------------------------------------------------
    # TEST 1: Endpoints v3 Admin Allowlist (/api/v3/admin/allowlist)
    # -------------------------------------------------------------------------
    print("\n--- TEST 1: Endpoint v3 Admin Allowlist CRUD Operations ---")
    
    # GET /api/v3/admin/allowlist
    res_get = client.get("/api/v3/admin/allowlist")
    assert res_get.status_code == 200, f"GET allowlist failed: {res_get.text}"
    data_get = res_get.json()
    assert "allowed_emails" in data_get
    assert "allowed_domains" in data_get
    assert "total_allowed_emails" in data_get
    print("✓ GET /api/v3/admin/allowlist returned 200 OK with state keys.")

    # POST /api/v3/admin/allowlist (Valid Email)
    res_post = client.post("/api/v3/admin/allowlist", json={"email": "qa.tester@luxottica.com"})
    assert res_post.status_code == 200, f"POST allowlist failed: {res_post.text}"
    assert res_post.json()["email"] == "qa.tester@luxottica.com"
    print("✓ POST /api/v3/admin/allowlist added valid email successfully.")

    # POST /api/v3/admin/allowlist (Invalid Email)
    res_post_inv = client.post("/api/v3/admin/allowlist", json={"email": "invalid_no_at"})
    assert res_post_inv.status_code == 400, f"Expected 400 for invalid email, got {res_post_inv.status_code}"
    print("✓ POST /api/v3/admin/allowlist rejected malformed email with 400 Bad Request.")

    # DELETE /api/v3/admin/allowlist/{email}
    res_del = client.delete("/api/v3/admin/allowlist/qa.tester@luxottica.com")
    assert res_del.status_code == 200
    assert res_del.json()["removed"] is True
    print("✓ DELETE /api/v3/admin/allowlist/{email} removed email successfully.")

    # DELETE non-existent email
    res_del_non = client.delete("/api/v3/admin/allowlist/nonexistent@luxottica.com")
    assert res_del_non.status_code == 200
    assert res_del_non.json()["removed"] is False
    print("✓ DELETE non-existent email handled gracefully without throwing errors.")

    results["admin_endpoints"] = "PASS"

    # -------------------------------------------------------------------------
    # TEST 2: Edge Case Handling in CSV Import
    # -------------------------------------------------------------------------
    print("\n--- TEST 2: CSV Import Edge Cases Audit ---")
    
    csv_edge_case_data = """
    Header_Name,Header_Email,Header_Role
    " John Doe " , john.doe@essilorluxottica.com , Student
    'Jane Smith' ; jane.smith@luxottica.com ; Trainer
    user1@partner.com,user2@partner.com;user3@partner.com
    
    DUPLICATE@PARTNER.COM, Duplicate@Partner.com, duplicate@partner.com
    invalid_email_no_at.com, @no_user.com, user_no_domain@, a@b.c
    "  " , , ,, ;;
    ""
    """
    
    res_csv = client.post("/api/v3/admin/allowlist/import-csv", json={"csv_content": csv_edge_case_data})
    assert res_csv.status_code == 200, f"CSV import failed: {res_csv.text}"
    csv_out = res_csv.json()
    
    added_set = set(csv_out["added_emails"])
    
    # Assert valid extracted emails
    assert "john.doe@essilorluxottica.com" in added_set, "Failed to extract trimmed quoted comma email"
    assert "jane.smith@luxottica.com" in added_set, "Failed to extract trimmed quoted semicolon email"
    assert "user1@partner.com" in added_set
    assert "user2@partner.com" in added_set
    assert "user3@partner.com" in added_set
    assert "duplicate@partner.com" in added_set
    
    # Check for detected bugs/vulnerabilities
    if "@no_user.com" in added_set:
        bugs_found.append("CSV parser accepts email starting with '@' (@no_user.com) because startswith('@') is not checked.")
        print("⚠️ BUG CONFIRMED: CSV parser accepts '@no_user.com' (missing username before @).")

    if "a@b.c" not in added_set:
        bugs_found.append("CSV parser rejects valid short email 'a@b.c' due to strict 'len(token) > 5' condition.")
        print("⚠️ BUG CONFIRMED: CSV parser rejects valid 5-char email 'a@b.c'.")

    # Verify duplicates skipped
    assert csv_out["skipped_count"] >= 2, f"Expected duplicates skipped, got skipped_count={csv_out['skipped_count']}"
    print("✓ Intra-CSV duplicates and inter-allowlist duplicates correctly skipped.")
    
    # Verify non-emails ignored
    assert "invalid_email_no_at.com" not in added_set
    assert "user_no_domain@" not in added_set
    print("✓ Non-email strings and trailing-@ strings correctly filtered out.")
    
    results["csv_import"] = "WARN (Bugs Identified)"

    # -------------------------------------------------------------------------
    # TEST 3: RBAC Role Resolution Hierarchy (CONTENT_CREATOR > MANAGER > TRAINER > STUDENT)
    # -------------------------------------------------------------------------
    print("\n--- TEST 3: RBAC 4-Role Hierarchy Resolution ---")
    
    svc = AuthService()
    svc.creator_emails = ["super.user@luxottica.com", "creator@datatonic.com"]
    svc.manager_emails = ["super.user@luxottica.com", "manager@luxottica.com"]
    svc.trainer_emails = ["super.user@luxottica.com", "manager@luxottica.com", "trainer@luxottica.com"]
    
    # 1. Super User in all 3 lists must resolve to CONTENT_CREATOR
    role_super = svc.resolve_role("super.user@luxottica.com")
    assert role_super == "CONTENT_CREATOR", f"Expected CONTENT_CREATOR, got {role_super}"
    print("✓ Priority 1: User in (Creator, Manager, Trainer) -> CONTENT_CREATOR")

    # 2. User in Manager + Trainer lists must resolve to MANAGER
    role_mgr = svc.resolve_role("manager@luxottica.com")
    assert role_mgr == "MANAGER", f"Expected MANAGER, got {role_mgr}"
    print("✓ Priority 2: User in (Manager, Trainer) -> MANAGER")

    # 3. User in Trainer list only must resolve to TRAINER
    role_tr = svc.resolve_role("trainer@luxottica.com")
    assert role_tr == "TRAINER", f"Expected TRAINER, got {role_tr}"
    print("✓ Priority 3: User in (Trainer) -> TRAINER")

    # 4. Ordinary email must resolve to STUDENT
    role_st = svc.resolve_role("student@luxottica.com")
    assert role_st == "STUDENT", f"Expected STUDENT, got {role_st}"
    print("✓ Priority 4: Standard user -> STUDENT")

    results["rbac_hierarchy"] = "PASS"

    # -------------------------------------------------------------------------
    # FINAL SUMMARY
    # -------------------------------------------------------------------------
    print("\n" + "=" * 80)
    print("AUDIT RESULTS SUMMARY:")
    for k, v in results.items():
        print(f"  [{v}] {k}")
    
    if bugs_found:
        print("\nIDENTIFIED BUGS & DEFECTS:")
        for idx, b in enumerate(bugs_found, 1):
            print(f"  {idx}. {b}")
    print("=" * 80)

if __name__ == "__main__":
    run_qa_audit_suite()
