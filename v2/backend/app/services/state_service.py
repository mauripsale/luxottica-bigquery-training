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
        if doc.exists:
            return SessionState(**doc.to_dict())
        return None

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

    def register_or_update_student(self, course_id: str, session_id: str, student: StudentProfile) -> bool:
        if not self.db:
            return False
        ref = self._session_doc_ref(course_id, session_id).collection("students").document(student.student_id)
        data = student.model_dump()
        ref.set(data, merge=True)
        return True

    def get_classroom_leaderboard(self, course_id: str, session_id: str) -> List[Dict[str, Any]]:
        if not self.db:
            return []
        docs = self._session_doc_ref(course_id, session_id).collection("students").stream()
        students = [doc.to_dict() for doc in docs]
        students.sort(key=lambda s: s.get("score", 0), reverse=True)
        return students
