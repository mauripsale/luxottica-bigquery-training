import os
import json
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

class CourseManager:
    """Loads and serves course manifests dynamically, allowing multi-course reuse."""

    def __init__(self, courses_dir: Optional[str] = None):
        if courses_dir is None:
            # Prefer environment variable COURSES_DIR, fallback to relative path
            courses_dir = os.getenv("COURSES_DIR", "v2/courses")
            if not os.path.exists(courses_dir):
                # Fallback check for local execution inside v2/backend
                alt_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../courses"))
                if os.path.exists(alt_path):
                    courses_dir = alt_path

        self.courses_dir = os.path.abspath(courses_dir)
        self.loaded_courses: Dict[str, Dict[str, Any]] = {}
        self.load_all_courses()

    def load_all_courses(self):
        """Scans the courses directory and loads all manifest files."""
        if not os.path.exists(self.courses_dir):
            logger.warning(f"Courses directory '{self.courses_dir}' not found.")
            return

        for item in os.listdir(self.courses_dir):
            item_path = os.path.join(self.courses_dir, item)
            if not os.path.isdir(item_path):
                continue
            manifest_path = os.path.join(item_path, "course_manifest.json")
            if os.path.isfile(manifest_path):
                try:
                    with open(manifest_path, "r", encoding="utf-8") as f:
                        data = json.load(f)
                        cid = data.get("course_id") or item
                        self.loaded_courses[cid] = data
                        logger.info(f"Loaded course manifest: {cid} ({data.get('title')})")
                except Exception as e:
                    logger.error(f"Error reading manifest {manifest_path}: {e}")

    def get_course(self, course_id: str) -> Optional[Dict[str, Any]]:
        return self.loaded_courses.get(course_id)

    def get_student_manifest(self, course_id: str) -> Optional[Dict[str, Any]]:
        """Returns course manifest with grading solutions and hint PINs stripped out for students."""
        raw = self.get_course(course_id)
        if not raw:
            return None

        # Deep copy to sanitize
        import copy
        manifest = copy.deepcopy(raw)
        if "challenges" in manifest and isinstance(manifest["challenges"], dict):
            for ch_key, ch_data in manifest["challenges"].items():
                if isinstance(ch_data, dict):
                    ch_data.pop("valid_answers", None)
                    ch_data.pop("valid_brands", None)
                    ch_data.pop("expected", None)
                    ch_data.pop("expected_leads_count", None)
                    ch_data.pop("hint_pin", None)
        return manifest

    def list_courses(self) -> Dict[str, str]:
        return {cid: c.get("title", cid) for cid, c in self.loaded_courses.items()}

# Global CourseManager instance
course_manager = CourseManager()
