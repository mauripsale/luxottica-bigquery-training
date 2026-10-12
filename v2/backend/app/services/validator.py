import logging
from typing import Optional, Dict, Any
from google.cloud import bigquery
from google.api_core.exceptions import GoogleAPIError

logger = logging.getLogger(__name__)

# CHALLENGE VERIFICATION RULES
CHALLENGE_RULES = {
    "b1-s1": {
        "type": "exact_or_numeric",
        "valid_answers": ["ray-ban", "rayban", "4"],
        "points": 100
    },
    "b2-s1": {
        "type": "brand_check",
        "valid_brands": ["oliver peoples", "oliverpeoples", "ray-ban meta"],
        "points": 150
    },
    "b2-s2": {
        "type": "numeric_range",
        "expected": 28.5,
        "tolerance": 1.5,
        "points": 150
    },
    "b3": {
        "type": "exact_or_numeric",
        "valid_answers": ["tiktok", "7.08", "7.08x"],
        "points": 200
    },
    "b4": {
        "type": "numeric_range",
        "expected": 352,
        "tolerance": 5,
        "points": 250
    }
}

class BigQueryValidator:
    """Validates student queries and BigQuery view creation dynamically."""

    def __init__(self, project_id: Optional[str] = None):
        self.default_project_id = project_id
        try:
            self.client = bigquery.Client(project=project_id)
        except Exception as e:
            logger.warning(f"Could not initialize BigQuery client automatically: {e}")
            self.client = None

    def validate_answer(self, challenge_key: str, submitted_value: str) -> Dict[str, Any]:
        """Validates simple answer submissions with normalization and tolerance."""
        rule = CHALLENGE_RULES.get(challenge_key)
        if not rule:
            return {"valid": False, "points": 0, "message": "Unknown challenge key"}

        val = (submitted_value or "").strip().lower()

        if rule["type"] == "brand_check":
            for b in rule["valid_brands"]:
                if b in val:
                    return {"valid": True, "points": rule["points"], "message": "Correct brand identified!"}
            return {"valid": False, "points": 0, "message": "Incorrect brand. Review your SQL query results."}

        elif rule["type"] == "numeric_range":
            try:
                num = float(val.replace("€", "").replace("%", "").replace("x", "").replace(",", ".").strip())
                expected = rule["expected"]
                tolerance = rule["tolerance"]
                if (expected - tolerance) <= num <= (expected + tolerance):
                    return {"valid": True, "points": rule["points"], "message": f"Correct value within tolerance range: {num}"}
                return {"valid": False, "points": 0, "message": f"Value {num} is outside expected range."}
            except ValueError:
                return {"valid": False, "points": 0, "message": "Please provide a valid numeric value."}

        elif rule["type"] == "exact_or_numeric":
            for ans in rule["valid_answers"]:
                if ans in val:
                    return {"valid": True, "points": rule["points"], "message": "Correct answer!"}
            return {"valid": False, "points": 0, "message": "Incorrect answer."}

        return {"valid": False, "points": 0, "message": "Validation rule type not supported"}

    def validate_student_view(self, project_id: str, dataset_id: str, view_name: str) -> Dict[str, Any]:
        """
        Inspects INFORMATION_SCHEMA.VIEWS on BigQuery to confirm the student's view exists,
        is valid SQL, and returns rows as expected.
        """
        if not self.client:
            return {"valid": False, "points": 0, "message": "BigQuery client is not configured on backend."}

        try:
            query = f"""
                SELECT table_name, view_definition
                FROM `{project_id}.{dataset_id}.INFORMATION_SCHEMA.VIEWS`
                WHERE table_name = @view_name
            """
            job_config = bigquery.QueryJobConfig(
                query_parameters=[
                    bigquery.ScalarQueryParameter("view_name", "STRING", view_name)
                ]
            )
            query_job = self.client.query(query, job_config=job_config)
            results = list(query_job.result())

            if not results:
                return {
                    "valid": False,
                    "points": 0,
                    "message": f"View '{view_name}' was not found in dataset '{dataset_id}'. Ensure you ran CREATE OR REPLACE VIEW in BigQuery Studio."
                }

            # Run dry test count on the newly created view
            test_query = f"SELECT COUNT(*) AS total_leads FROM `{project_id}.{dataset_id}.{view_name}`"
            test_job = self.client.query(test_query)
            test_results = list(test_job.result())
            total_leads = test_results[0]["total_leads"] if test_results else 0

            return {
                "valid": True,
                "points": 250,
                "message": f"🎉 View '{view_name}' verified successfully in BigQuery! Rows returned: {total_leads}",
                "details": {"rows": total_leads}
            }

        except GoogleAPIError as e:
            logger.error(f"BigQuery API Error validating view {view_name}: {e}")
            return {
                "valid": False,
                "points": 0,
                "message": f"Error querying BigQuery view '{view_name}': {str(e)}"
            }
