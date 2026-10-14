import logging
from typing import Optional, List, Dict, Any
from google.cloud import firestore
from app.models import SessionState, StudentProfile

logger = logging.getLogger(__name__)

class FirestoreStateService:
    """Manages training sessions and student state in Google Cloud Firestore."""

    def __init__(self, project_id: Optional[str] = None):
        try:
            self.db = firestore.Client(project=project_id)
        except Exception as e:
            logger.warning(f"Firestore Client could not be initialized automatically: {e}")
            self.db = None

    def _session_doc_ref(self, course_id: str, session_id: str):
        return self.db.collection("courses").document(course_id).collection("sessions").document(session_id)

    def get_session(self, course_id: str, session_id: str) -> Optional[SessionState]:
        if not self.db:
            return None
        doc = self._session_doc_ref(course_id, session_id).get()
        data = doc.to_dict() if doc.exists else {"session_id": session_id, "active_block": "cover"}
        # Ensure updated_at is clean for Pydantic
        if "updated_at" in data and hasattr(data["updated_at"], "isoformat"):
            data["updated_at"] = data["updated_at"]
        data["students"] = self.get_classroom_leaderboard(course_id, session_id)
        return SessionState(**data)

    def set_session_block(self, course_id: str, session_id: str, block_id: str) -> bool:
        if not self.db:
            return False
        ref = self._session_doc_ref(course_id, session_id)
        ref.set({"active_block": block_id, "updated_at": firestore.SERVER_TIMESTAMP}, merge=True)
        return True

    def set_session_lock(self, course_id: str, session_id: str, locked: bool) -> bool:
        if not self.db:
            return False
        ref = self._session_doc_ref(course_id, session_id)
        ref.set({"is_locked": locked, "updated_at": firestore.SERVER_TIMESTAMP}, merge=True)
        return True

    def set_session_hints(self, course_id: str, session_id: str, hints: List[str]) -> bool:
        if not self.db:
            return False
        ref = self._session_doc_ref(course_id, session_id)
        ref.set({"unlocked_hints": hints, "updated_at": firestore.SERVER_TIMESTAMP}, merge=True)
        return True

    def set_session_timer(self, course_id: str, session_id: str, timer_data: Dict[str, Any]) -> bool:
        if not self.db:
            return False
        ref = self._session_doc_ref(course_id, session_id)
        ref.set({"timer": timer_data, "updated_at": firestore.SERVER_TIMESTAMP}, merge=True)
        return True

    def register_or_update_student(self, course_id: str, session_id: str, student: StudentProfile) -> bool:
        if not self.db:
            return False
        sid = student.student_id or student.id
        if not sid:
            return False
        team = student.team_key or student.teamKey or "rayban"
        ref = self._session_doc_ref(course_id, session_id).collection("students").document(sid)
        data = {
            "student_id": sid,
            "id": sid,
            "name": student.name,
            "team_key": team,
            "teamKey": team,
            "email": student.email,
            "picture": student.picture,
            "score": student.score,
            "completed_challenges": student.completed_challenges,
            "online": True,
            "updated_at": firestore.SERVER_TIMESTAMP
        }
        ref.set(data, merge=True)
        return True

    def get_classroom_leaderboard(self, course_id: str, session_id: str) -> List[Dict[str, Any]]:
        if not self.db:
            return []
        docs = self._session_doc_ref(course_id, session_id).collection("students").stream()
        students = []
        for doc in docs:
            d = doc.to_dict()
            if "updated_at" in d and hasattr(d["updated_at"], "isoformat"):
                d["updated_at"] = d["updated_at"].isoformat()
            if "last_seen" in d and hasattr(d["last_seen"], "isoformat"):
                d["last_seen"] = d["last_seen"].isoformat()
            students.append(d)
        students.sort(key=lambda s: s.get("score", 0), reverse=True)
        return students
