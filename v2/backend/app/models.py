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
    students: List[Dict[str, Any]] = Field(default_factory=list)
    updated_at: Optional[datetime] = None

class StudentProfile(BaseModel):
    student_id: Optional[str] = None
    id: Optional[str] = None
    name: str = "Detective"
    team_key: Optional[str] = None
    teamKey: Optional[str] = None
    email: Optional[str] = None
    picture: Optional[str] = None
    score: int = 0
    completed_challenges: Dict[str, bool] = Field(default_factory=dict)
    online: bool = True
    last_seen: Optional[datetime] = None

class ChallengeValidationRequest(BaseModel):
    session_id: str
    student_id: str
    challenge_key: str
    submitted_value: Optional[str] = None
    view_name: Optional[str] = None
    project_id: Optional[str] = None
    dataset_id: Optional[str] = None

class ChallengeValidationResponse(BaseModel):
    success: bool
    points_awarded: int = 0
    message: str
    details: Optional[Dict[str, Any]] = None
