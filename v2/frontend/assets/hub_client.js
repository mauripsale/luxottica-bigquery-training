// =========================================================================
// UNIVERSAL TRAINING HUB CLIENT SDK (v2)
// Pluggable State Client supporting:
// 1) FastAPI REST Backend + Firestore Native Sync
// 2) Offline / Standalone Mock Mode for development
// =========================================================================

class TrainingHubClient {
  constructor(config = {}) {
    if (config.apiBaseUrl !== undefined) {
      this.apiBaseUrl = config.apiBaseUrl;
    } else if (typeof window !== "undefined" && window.location) {
      this.apiBaseUrl = (window.location.port === "8000") ? "http://localhost:8080" : window.location.origin;
    } else {
      this.apiBaseUrl = "http://localhost:8080";
    }
    this.courseId = config.courseId || "luxottica-bigquery-marketing";
    this.sessionId = config.sessionId || "default-session";
    this.onStateChangeCallback = null;
    this.manifest = null;
    this.serverConfig = null;
  }

  // Load server public config (GCP project, Google OAuth client ID, etc.)
  async loadConfig() {
    try {
      const resp = await fetch(`${this.apiBaseUrl}/api/v2/config`);
      if (resp.ok) {
        this.serverConfig = await resp.json();
        return this.serverConfig;
      }
    } catch (e) {
      console.debug("[HubClient] Could not fetch server config:", e);
    }
    return null;
  }

  // Load course manifest dynamically from FastAPI backend
  async loadCourseManifest() {
    try {
      const resp = await fetch(`${this.apiBaseUrl}/api/v2/courses/${encodeURIComponent(this.courseId)}`);
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
      const url = `${this.apiBaseUrl}/api/v2/session/${encodeURIComponent(this.sessionId)}?course_id=${encodeURIComponent(this.courseId)}`;
      const resp = await fetch(url);
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
      const url = `${this.apiBaseUrl}/api/v2/session/${encodeURIComponent(this.sessionId)}/block?block_id=${encodeURIComponent(blockId)}&course_id=${encodeURIComponent(this.courseId)}`;
      const resp = await fetch(url, { method: "POST" });
      if (resp.ok) {
        const data = await resp.json();
        return !!data.synced;
      }
      return false;
    } catch (e) {
      console.error("[HubClient] setBlock error:", e);
      return false;
    }
  }

  // Trainer: toggle classroom navigation lock
  async setLock(locked) {
    try {
      const url = `${this.apiBaseUrl}/api/v2/session/${encodeURIComponent(this.sessionId)}/lock?locked=${encodeURIComponent(locked)}&course_id=${encodeURIComponent(this.courseId)}`;
      const resp = await fetch(url, { method: "POST" });
      if (resp.ok) {
        const data = await resp.json();
        return !!data.synced;
      }
      return false;
    } catch (e) {
      console.error("[HubClient] setLock error:", e);
      return false;
    }
  }

  // Trainer: update unlocked hints list
  async setHints(hints) {
    try {
      const url = `${this.apiBaseUrl}/api/v2/session/${encodeURIComponent(this.sessionId)}/hints?course_id=${encodeURIComponent(this.courseId)}`;
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hints)
      });
      return resp.ok;
    } catch (e) {
      console.error("[HubClient] setHints error:", e);
      return false;
    }
  }

  // Trainer: update classroom countdown timer
  async setTimer(timerData) {
    try {
      const url = `${this.apiBaseUrl}/api/v2/session/${encodeURIComponent(this.sessionId)}/timer?course_id=${encodeURIComponent(this.courseId)}`;
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(timerData)
      });
      return resp.ok;
    } catch (e) {
      console.error("[HubClient] setTimer error:", e);
      return false;
    }
  }

  // Student: check-in / profile registration
  async checkinStudent(student) {
    try {
      const url = `${this.apiBaseUrl}/api/v2/student/checkin?session_id=${encodeURIComponent(this.sessionId)}&course_id=${encodeURIComponent(this.courseId)}`;
      const resp = await fetch(url, {
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

  // Trainer: delete single student permanently from Firestore
  async deleteStudent(studentId) {
    try {
      const url = `${this.apiBaseUrl}/api/v2/session/${encodeURIComponent(this.sessionId)}/students/${encodeURIComponent(studentId)}?course_id=${encodeURIComponent(this.courseId)}`;
      const resp = await fetch(url, { method: "DELETE" });
      return resp.ok;
    } catch (e) {
      console.error("[HubClient] deleteStudent error:", e);
      return false;
    }
  }

  // Trainer: batch delete selected students or all
  async deleteStudentsBatch(studentIds = []) {
    try {
      const url = `${this.apiBaseUrl}/api/v2/session/${encodeURIComponent(this.sessionId)}/students/batch-delete?course_id=${encodeURIComponent(this.courseId)}`;
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_ids: studentIds })
      });
      if (resp.ok) {
        return await resp.json();
      }
      return { success: false, deleted_count: 0 };
    } catch (e) {
      console.error("[HubClient] deleteStudentsBatch error:", e);
      return { success: false, deleted_count: 0 };
    }
  }


  // Student / Trainer: submit challenge answer or view for validation
  async validateChallenge(challengeKey, submittedValue, viewName = null) {
    try {
      const url = `${this.apiBaseUrl}/api/v2/challenge/validate?course_id=${encodeURIComponent(this.courseId)}`;
      const resp = await fetch(url, {
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

  // Start polling session state with retained interval handle
  startPolling(intervalMs = 3000) {
    if (this.pollingIntervalId) {
      return; // Already polling
    }
    this.pollingIntervalId = setInterval(async () => {
      const state = await this.getSessionState();
      if (state && this.onStateChangeCallback) {
        this.onStateChangeCallback(state);
      }
    }, intervalMs);
  }

  // Stop polling interval cleanly
  stopPolling() {
    if (this.pollingIntervalId) {
      clearInterval(this.pollingIntervalId);
      this.pollingIntervalId = null;
    }
  }

  onStateChange(cb) {
    this.onStateChangeCallback = cb;
  }
}

// Global Hub Client instance
window.hubClient = new TrainingHubClient();
