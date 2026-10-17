import os
import logging
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException, Query, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.models import (
    SessionState,
    StudentProfile,
    ChallengeValidationRequest,
    ChallengeValidationResponse
)
from app.services.validator import BigQueryValidator
from app.services.state_service import FirestoreStateService
from app.services.auth_service import auth_service
from app.core.course_manager import course_manager

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("training-api")

app = FastAPI(
    title="Universal Training Hub Framework API",
    version="2.2.0",
    description="Multi-course interactive classroom platform running on Google Cloud Run"
)

# GZIP COMPRESSION MIDDLEWARE (Compresses index.html from ~600KB down to ~105KB)
app.add_middleware(GZipMiddleware, minimum_size=1000)

# CORS SETUP FOR PORTAL CLIENTS (RESTRICTED FOR CREDENTIALED REQUESTS)
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https://.*\.run\.app|https://.*\.luxottica\.com|https://.*\.essilorluxottica\.com|http://localhost:.*|http://127\.0\.0\.1:.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PROJECT_ID = os.getenv("GCP_PROJECT_ID", "qwiklabs-asl-02-9bb3224716de")
DATASET_ID = os.getenv("BQ_DATASET_ID", "luxottica_marketing_analytics")
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")

validator = BigQueryValidator(project_id=PROJECT_ID)
state_service = FirestoreStateService(project_id=PROJECT_ID)

# RESOLVE FRONTEND DIRECTORY (LOCAL DEV & DOCKER CONTAINER)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIR = os.getenv("FRONTEND_DIR")
if not FRONTEND_DIR or not os.path.exists(FRONTEND_DIR):
    for candidate in [
        os.path.join(os.path.dirname(BASE_DIR), "frontend"),
        os.path.join(BASE_DIR, "frontend"),
        "/app/frontend"
    ]:
        if os.path.exists(candidate):
            FRONTEND_DIR = candidate
            break

if FRONTEND_DIR and os.path.exists(os.path.join(FRONTEND_DIR, "assets")):
    logger.info(f"Mounting static assets from {os.path.join(FRONTEND_DIR, 'assets')}")
    app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIR, "assets")), name="assets")

from fastapi.responses import FileResponse, Response

@app.get("/favicon.ico", include_in_schema=False)
def favicon():
    return Response(status_code=204)

@app.get("/")
def serve_index():
    if FRONTEND_DIR:
        index_file = os.path.join(FRONTEND_DIR, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
    return {"message": "Universal Training Hub API running. Frontend index.html not found."}

@app.get("/api/v2/config")
def get_hub_config():
    """Returns runtime public configuration for client SDK & Google Identity Services."""
    return {
        "gcp_project_id": PROJECT_ID,
        "dataset_id": DATASET_ID,
        "google_client_id": GOOGLE_CLIENT_ID,
        "auth_required": auth_service.auth_required,
        "allowed_domains": auth_service.allowed_domains,
        "default_course_id": "luxottica-bigquery-marketing",
        "api_version": "2.2.0"
    }

@app.post("/api/v2/auth/verify-google-token")
def verify_google_oauth_token(payload: Dict[str, Any] = Body(...)):
    """
    Verifies a Google OAuth ID Token sent by Google Identity Services on the frontend.
    Returns user profile, verified email, assigned role (TRAINER vs STUDENT), and allowlist status.
    """
    token = payload.get("credential") or payload.get("id_token") or payload.get("token")
    if not token:
        raise HTTPException(status_code=400, detail="Mancante il token 'credential' di Google OAuth")

    try:
        user_profile = auth_service.verify_google_token(token)
        return {
            "success": True,
            "user": user_profile
        }
    except ValueError as ve:
        raise HTTPException(status_code=403, detail=str(ve))
    except Exception as e:
        logger.error(f"Errore auth Google OAuth: {e}")
        raise HTTPException(status_code=500, detail=f"Errore interno durante l'autenticazione: {str(e)}")

@app.get("/api/v2/auth/allowlist")
def get_auth_allowlist():
    """Returns configured domains and public allowlist status."""
    return {
        "auth_required": auth_service.auth_required,
        "allowed_domains": auth_service.allowed_domains,
        "google_client_id_configured": bool(GOOGLE_CLIENT_ID)
    }

@app.get("/healthz")
def healthcheck():
    return {
        "status": "ok",
        "version": "2.2.0",
        "gcp_project": PROJECT_ID,
        "auth_required": auth_service.auth_required,
        "frontend_mounted": bool(FRONTEND_DIR and os.path.exists(FRONTEND_DIR)),
        "available_courses": list(course_manager.list_courses().keys())
    }

# =========================================================================
# COURSE CATALOG & MANIFEST ENDPOINTS (THE REUSABLE CORE)
# =========================================================================
@app.get("/api/v2/courses")
def list_available_courses():
    """Returns the list of all configured training courses."""
    return course_manager.list_courses()

@app.get("/api/v2/courses/{course_id}")
def get_course_manifest(course_id: str, raw: bool = Query(False, description="Set true for trainer backend to view grading keys")):
    """Returns the course structure. By default, solutions and hint PINs are stripped for student protection."""
    if raw:
        manifest = course_manager.get_course(course_id)
    else:
        manifest = course_manager.get_student_manifest(course_id)

    if not manifest:
        raise HTTPException(status_code=404, detail=f"Course '{course_id}' not found")
    return manifest

# =========================================================================
# SESSION & REALTIME STATE ENDPOINTS (SCOPED BY COURSE)
# =========================================================================
@app.get("/api/v2/session/{session_id}")
def get_session_state(session_id: str, course_id: str = Query("luxottica-bigquery-marketing")):
    session = state_service.get_session(course_id=course_id, session_id=session_id)
    if not session:
        manifest = course_manager.get_course(course_id)
        if not manifest:
            raise HTTPException(status_code=404, detail=f"Course '{course_id}' not found")
        course_name = manifest.get("title", "Masterclass")
        return SessionState(session_id=session_id, name=course_name)
    return session

@app.post("/api/v2/session/{session_id}/block")
def change_block(session_id: str, block_id: str, course_id: str = Query("luxottica-bigquery-marketing")):
    success = state_service.set_session_block(course_id=course_id, session_id=session_id, block_id=block_id)
    return {"session_id": session_id, "course_id": course_id, "active_block": block_id, "synced": success}

@app.post("/api/v2/session/{session_id}/lock")
def change_lock(session_id: str, locked: bool = Query(...), course_id: str = Query("luxottica-bigquery-marketing")):
    success = state_service.set_session_lock(course_id=course_id, session_id=session_id, locked=locked)
    return {"session_id": session_id, "course_id": course_id, "is_locked": locked, "synced": success}

@app.post("/api/v2/session/{session_id}/hints")
def change_hints(session_id: str, hints: List[str] = Body(...), course_id: str = Query("luxottica-bigquery-marketing")):
    success = state_service.set_session_hints(course_id=course_id, session_id=session_id, hints=hints)
    return {"session_id": session_id, "course_id": course_id, "unlocked_hints": hints, "synced": success}

@app.post("/api/v2/session/{session_id}/timer")
def change_timer(session_id: str, timer: Dict[str, Any] = Body(...), course_id: str = Query("luxottica-bigquery-marketing")):
    success = state_service.set_session_timer(course_id=course_id, session_id=session_id, timer_data=timer)
    return {"session_id": session_id, "course_id": course_id, "timer": timer, "synced": success}

@app.post("/api/v2/student/checkin")
def student_checkin(session_id: str, student: StudentProfile, course_id: str = Query("luxottica-bigquery-marketing")):
    success = state_service.register_or_update_student(course_id=course_id, session_id=session_id, student=student)
    sid = student.student_id or student.id
    return {"success": success, "session_id": session_id, "student_id": sid}

@app.get("/api/v2/session/{session_id}/leaderboard")
def get_leaderboard(session_id: str, course_id: str = Query("luxottica-bigquery-marketing")):
    return state_service.get_classroom_leaderboard(course_id=course_id, session_id=session_id)

@app.delete("/api/v2/session/{session_id}/students/{student_id}")
def delete_single_student(session_id: str, student_id: str, course_id: str = Query("luxottica-bigquery-marketing")):
    """Removes a student permanently from the classroom session in Firestore."""
    success = state_service.delete_student(course_id=course_id, session_id=session_id, student_id=student_id)
    return {"success": success, "deleted_student_id": student_id, "session_id": session_id}

@app.post("/api/v2/session/{session_id}/students/batch-delete")
def delete_students_batch(session_id: str, payload: Dict[str, Any] = Body(...), course_id: str = Query("luxottica-bigquery-marketing")):
    """Batch removes selected or all students from the classroom session in Firestore."""
    student_ids = payload.get("student_ids", [])
    result = state_service.delete_students_batch(course_id=course_id, session_id=session_id, student_ids=student_ids)
    return {"success": result.get("success", False), "deleted_count": result.get("deleted_count", 0), "session_id": session_id}


# =========================================================================
# DYNAMIC CHALLENGE VALIDATION (READS FROM COURSE MANIFEST)
# =========================================================================
@app.post("/api/v2/challenge/validate", response_model=ChallengeValidationResponse)
def validate_challenge(req: ChallengeValidationRequest, course_id: str = Query("luxottica-bigquery-marketing")):
    manifest = course_manager.get_course(course_id)
    if not manifest:
        raise HTTPException(status_code=404, detail=f"Course '{course_id}' not found")

    challenges_map = manifest.get("challenges", {})
    if req.challenge_key not in challenges_map:
        raise HTTPException(status_code=404, detail=f"Challenge '{req.challenge_key}' not found in course '{course_id}'")

    challenge_def = challenges_map[req.challenge_key]

    # Case 1: BigQuery View verification (eg. Block 4 Challenge 3)
    if req.view_name or (challenge_def and challenge_def.get("type") == "bigquery_view_check"):
        v_name = req.view_name or req.submitted_value
        result = validator.validate_student_view(
            project_id=req.project_id or PROJECT_ID,
            dataset_id=req.dataset_id or DATASET_ID,
            view_name=v_name
        )
        return ChallengeValidationResponse(
            success=result["valid"],
            points_awarded=result["points"],
            message=result["message"],
            details=result.get("details")
        )

    # Case 2: Dynamic answer verification based on manifest rules
    if req.submitted_value:
        result = validator.validate_answer(
            challenge_key=req.challenge_key,
            submitted_value=req.submitted_value,
            custom_rule=challenge_def
        )
        return ChallengeValidationResponse(
            success=result["valid"],
            points_awarded=result["points"],
            message=result["message"]
        )

    raise HTTPException(status_code=400, detail="Missing either submitted_value or view_name")
