// =========================================================================
// UNIVERSAL TRAINING HUB CLIENT SDK (v2)
// Pluggable State Client supporting:
// 1) FastAPI REST Backend + Firestore Native Sync
// 2) Offline / Standalone Mock Mode for development
// =========================================================================

class TrainingHubClient {
  constructor(config = {}) {
    this.apiBaseUrl = config.apiBaseUrl || "http://localhost:8080";
    this.courseId = config.courseId || "luxottica-bigquery-marketing";
    this.sessionId = config.sessionId || "default-session";
    this.onStateChangeCallback = null;
    this.manifest = null;
  }

  // Load course manifest dynamically from FastAPI backend
  async loadCourseManifest() {
    try {
      const resp = await fetch(`${this.apiBaseUrl}/api/v2/courses/${this.courseId}`);
      if (resp.ok) {
        this.manifest = await resp.json();
        return this.manifest;
      }
    } catch (e) {
      console.warn("[HubClient] Could not reach backend, falling back to local cached manifest:", e);
    }
    return null;
  }

  // Fetch current session state
  async getSessionState() {
    try {
      const resp = await fetch(`${this.apiBaseUrl}/api/v2/session/${this.sessionId}?course_id=${this.courseId}`);
      if (resp.ok) {
        return await resp.json();
      }
    } catch (e) {
      console.warn("[HubClient] getSessionState error:", e);
    }
    return null;
  }

  // Trainer: change active block
  async setBlock(blockId) {
    try {
      const resp = await fetch(`${this.apiBaseUrl}/api/v2/session/${this.sessionId}/block?block_id=${blockId}`, {
        method: "POST"
      });
      return resp.ok;
    } catch (e) {
      console.error("[HubClient] setBlock error:", e);
      return false;
    }
  }

  // Student: check-in / profile registration
  async checkinStudent(student) {
    try {
      const resp = await fetch(`${this.apiBaseUrl}/api/v2/student/checkin?session_id=${this.sessionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student)
      });
      return resp.ok;
    } catch (e) {
      console.error("[HubClient] checkinStudent error:", e);
      return false;
    }
  }

  // Student / Trainer: submit challenge answer or view for validation
  async validateChallenge(challengeKey, submittedValue, viewName = null) {
    try {
      const resp = await fetch(`${this.apiBaseUrl}/api/v2/challenge/validate?course_id=${this.courseId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: this.sessionId,
          student_id: (window.currentStudent ? window.currentStudent.id : "anonymous"),
          challenge_key: challengeKey,
          submitted_value: submittedValue,
          view_name: viewName
        })
      });
      if (resp.ok) {
        return await resp.json();
      }
    } catch (e) {
      console.error("[HubClient] validateChallenge error:", e);
    }
    return { success: false, message: "Errore di connessione con il backend di validazione" };
  }

  // Poll or listen for state changes
  startPolling(intervalMs = 3000) {
    setInterval(async () => {
      const state = await this.getSessionState();
      if (state && this.onStateChangeCallback) {
        this.onStateChangeCallback(state);
      }
    }, intervalMs);
  }

  onStateChange(cb) {
    this.onStateChangeCallback = cb;
  }
}

// Global Hub Client instance
window.hubClient = new TrainingHubClient();
