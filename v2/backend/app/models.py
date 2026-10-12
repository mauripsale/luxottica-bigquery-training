from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class TimerState(BaseModel):
    is_active: bool = False
    label: Optional[str] = ""
    end_timestamp: Optional[int] = None

class SessionState(BaseModel):
    session_id: str
    name: str = "Mastering Marketing Data with BigQuery SQL"
    active_block: str = "cover"
    is_locked: bool = True
    student_docs_unlocked: bool = False
    unlocked_hints: List[str] = Field(default_factory=list)
    timer: TimerState = Field(default_factory=TimerState)
    trainer_active: bool = True
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class StudentProfile(BaseModel):
    student_id: str
    name: str
    team_key: str
    score: int = 0
    completed_challenges: Dict[str, bool] = Field(default_factory=dict)
    online: bool = True
    last_seen: datetime = Field(default_factory=datetime.utcnow)

class ChallengeValidationRequest(BaseModel):
    session_id: str
    student_id: str
    challenge_key: str
    submitted_value: Optional[str] = None
    view_name: Optional[str] = None
    project_id: Optional[str] = "qwiklabs-gcp-04-9efaa47f1d21"
    dataset_id: Optional[str] = "luxottica_marketing_analytics"

class ChallengeValidationResponse(BaseModel):
    success: bool
    points_awarded: int = 0
    message: str
    details: Optional[Dict[str, Any]] = None
