import os
import json
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

class CourseManager:
    """Loads and serves course manifests dynamically, allowing multi-course reuse."""

    def __init__(self, courses_dir: str = "v2/courses"):
        self.courses_dir = courses_dir
        self.loaded_courses: Dict[str, Dict[str, Any]] = {}
        self.load_all_courses()

    def load_all_courses(self):
        """Scans the courses directory and loads all manifest files."""
        if not os.path.exists(self.courses_dir):
            logger.warning(f"Courses directory '{self.courses_dir}' not found.")
            return

        for item in os.listdir(self.courses_dir):
            manifest_path = os.path.join(self.courses_dir, item, "course_manifest.json")
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

    def list_courses(self) -> Dict[str, str]:
        return {cid: c.get("title", cid) for cid, c in self.loaded_courses.items()}

# Global CourseManager instance
course_manager = CourseManager()
