import os
import logging
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from app.models import (
    SessionState,
    StudentProfile,
    ChallengeValidationRequest,
    ChallengeValidationResponse
)
from app.services.validator import BigQueryValidator
from app.services.state_service import FirestoreStateService

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("training-api")

app = FastAPI(
    title="Luxottica BigQuery Training Platform API",
    version="2.0.0",
    description="Enterprise-grade training hub backend running on Google Cloud Run"
)

# CORS SETUP FOR PORTAL CLIENTS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PROJECT_ID = os.getenv("GCP_PROJECT_ID", "qwiklabs-gcp-04-9efaa47f1d21")
DATASET_ID = os.getenv("BQ_DATASET_ID", "luxottica_marketing_analytics")

validator = BigQueryValidator(project_id=PROJECT_ID)
state_service = FirestoreStateService(project_id=PROJECT_ID)

@app.get("/healthz")
def healthcheck():
    return {"status": "ok", "version": "2.0.0", "gcp_project": PROJECT_ID}

@app.get("/api/v2/session/{session_id}")
def get_session_state(session_id: str):
    session = state_service.get_session(session_id)
    if not session:
        # Fallback default session state
        return SessionState(session_id=session_id)
    return session

@app.post("/api/v2/session/{session_id}/block")
def change_block(session_id: str, block_id: str):
    success = state_service.set_session_block(session_id, block_id)
    return {"session_id": session_id, "active_block": block_id, "synced": success}

@app.post("/api/v2/student/checkin")
def student_checkin(session_id: str, student: StudentProfile):
    success = state_service.register_or_update_student(session_id, student)
    return {"success": success, "student_id": student.student_id}

@app.get("/api/v2/session/{session_id}/leaderboard")
def get_leaderboard(session_id: str):
    return state_service.get_classroom_leaderboard(session_id)

@app.post("/api/v2/challenge/validate", response_model=ChallengeValidationResponse)
def validate_challenge(req: ChallengeValidationRequest):
    # Case 1: BigQuery View verification (Block 4 Challenge 3)
    if req.view_name:
        result = validator.validate_student_view(
            project_id=req.project_id or PROJECT_ID,
            dataset_id=req.dataset_id or DATASET_ID,
            view_name=req.view_name
        )
        return ChallengeValidationResponse(
            success=result["valid"],
            points_awarded=result["points"],
            message=result["message"],
            details=result.get("details")
        )

    # Case 2: Numeric/text SQL Challenge verification (Block 1, 2, 3)
    if req.submitted_value:
        result = validator.validate_answer(
            challenge_key=req.challenge_key,
            submitted_value=req.submitted_value
        )
        return ChallengeValidationResponse(
            success=result["valid"],
            points_awarded=result["points"],
            message=result["message"]
        )

    raise HTTPException(status_code=400, detail="Missing either submitted_value or view_name")
