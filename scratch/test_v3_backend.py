import time
import sys
import os

# Add v2/backend to path
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "v2", "backend"))

from app.services.auth_service import AuthService
from fastapi.testclient import TestClient
from app.main import app, auth_service

def test_o1_lookup_performance():
    print("\n--- 1. Testing O(1) Set Lookup & CSV Import Benchmark ---")
    auth = AuthService()
    auth.db = None  # Disable GCP network I/O for pure in-memory performance test
    auth.allowed_emails_set = set()  # Reset set for fresh import benchmark
    
    # Generate 10,000 synthetic emails
    emails = [f"student_{i}@testdomain.com" for i in range(10000)]
    csv_content = "\n".join(emails)
    
    start_time = time.perf_counter()
    result = auth.import_csv_emails(csv_content)
    elapsed_ms = (time.perf_counter() - start_time) * 1000
    
    print(f"✅ Pure In-Memory Imported {result['added_count']} emails in {elapsed_ms:.2f} ms")
    assert elapsed_ms < 50.0, f"Performance regression: expected < 50ms, got {elapsed_ms:.2f}ms"
    assert result['added_count'] == 10000, f"Expected 10000 added, got {result['added_count']}"

def test_csv_edge_case_validation():
    print("\n--- 2. Testing CSV Edge Case Email Validation ---")
    auth = AuthService()
    auth.db = None  # Offline test mode
    auth.allowed_emails_set = set()  # Reset set so pre-existing Firestore records do not mark test emails as duplicates
    
    # Test cases: invalid vs valid
    test_csv = """
    valid_student@luxottica.com
    a@b.c
    @no_user.com
    invalid-email-without-at.com
    "quoted_user@domain.org"
    semicolon_user@test.com;other_user@test.it
    """
    
    res = auth.import_csv_emails(test_csv)
    added = res["added_emails"]
    
    print(f"Added emails: {added}")
    
    assert "a@b.c" in added, "Valid short email 'a@b.c' should be accepted"
    assert "@no_user.com" not in added, "Email without username '@no_user.com' should be rejected"
    assert "quoted_user@domain.org" in added, "Quoted email should be cleaned and accepted"
    assert "semicolon_user@test.com" in added, "Semicolon separated email should be accepted"
    assert "other_user@test.it" in added, "Semicolon separated second email should be accepted"
    print("✅ All CSV edge case validations passed successfully!")

def test_rbac_endpoint_security():
    print("\n--- 3. Testing FastAPI RBAC & Authorization Endpoints ---")
    auth_service.db = None  # Offline test mode
    client = TestClient(app)
    
    # Test 1: Unauthenticated request to Manager Allowlist endpoint
    res = client.get("/api/v3/admin/allowlist")
    print(f"GET /api/v3/admin/allowlist (Unauthenticated) -> Status {res.status_code}")
    assert res.status_code in (401, 403), f"Expected 401 or 403, got {res.status_code}"
    
    # Test 2: Student user request to Manager Allowlist endpoint
    res = client.get("/api/v3/admin/allowlist", headers={"X-User-Email": "regular_student@luxottica.com"})
    print(f"GET /api/v3/admin/allowlist (Student) -> Status {res.status_code}")
    assert res.status_code == 403, f"Expected 403 Forbidden for Student, got {res.status_code}"
    
    # Test 3: Manager user request to Manager Allowlist endpoint
    res = client.get("/api/v3/admin/allowlist", headers={"X-User-Email": "maurizio.ipsale@gmail.com"})
    print(f"GET /api/v3/admin/allowlist (Manager) -> Status {res.status_code}")
    assert res.status_code == 200, f"Expected 200 OK for Manager, got {res.status_code}"
    assert "allowed_domains" in res.json()
    
    # Test 4: Unauthenticated request to Trainer control endpoint
    res = client.post("/api/v2/session/s123/block?block_id=block-2")
    print(f"POST /api/v2/session/s123/block (Unauthenticated) -> Status {res.status_code}")
    assert res.status_code in (401, 403), f"Expected 401 or 403, got {res.status_code}"
    
    # Test 5: Trainer user request to Trainer control endpoint
    res = client.post("/api/v2/session/s123/block?block_id=block-2", headers={"X-User-Email": "maurizio.ipsale@gmail.com"})
    print(f"POST /api/v2/session/s123/block (Trainer) -> Status {res.status_code}")
    assert res.status_code == 200, f"Expected 200 OK for Trainer, got {res.status_code}"
    
    print("✅ All FastAPI RBAC endpoint security checks passed successfully!")

if __name__ == "__main__":
    test_o1_lookup_performance()
    test_csv_edge_case_validation()
    test_rbac_endpoint_security()
    print("\n🎉 ALL BACKEND HARDENING & SECURITY TESTS PASSED PERFECTLY!\n")
