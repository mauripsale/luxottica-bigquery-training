import os
import logging
from typing import Dict, Any, List, Optional
from google.oauth2 import id_token
from google.auth.transport import requests

logger = logging.getLogger("auth-service")

class AuthService:
    def __init__(self, google_client_id: Optional[str] = None):
        self.google_client_id = google_client_id or os.getenv("GOOGLE_CLIENT_ID", "")
        self.auth_required = os.getenv("AUTH_REQUIRED", "false").lower() in ("true", "1", "yes")
        
        # Load allowlists from environment
        raw_domains = os.getenv("ALLOWED_DOMAINS", "luxottica.com,essilorluxottica.com,datatonic.com")
        self.allowed_domains = [d.strip().lower() for d in raw_domains.split(",") if d.strip()]

        raw_emails = os.getenv("ALLOWED_EMAILS", "")
        self.allowed_emails = [e.strip().lower() for e in raw_emails.split(",") if e.strip()]

        raw_trainers = os.getenv("TRAINER_EMAILS", "maurizio.ipsale@gmail.com,trainer@luxottica.com")
        self.trainer_emails = [t.strip().lower() for e in raw_trainers.split(",") for t in [e.strip()] if t]

        self.trainer_pin = os.getenv("TRAINER_PIN", "1926")

    def verify_google_token(self, token: str) -> Dict[str, Any]:
        """
        Verifies a Google OAuth ID Token (JWT) sent from Google Identity Services on the frontend.
        Returns verified user payload if valid and authorized by allowlist.
        """
        if not token:
            raise ValueError("Token di autenticazione Google mancante.")

        try:
            # If Client ID is specified, enforce it. Otherwise verify signature against Google certs.
            request_adapter = requests.Request()
            if self.google_client_id:
                id_info = id_token.verify_oauth2_token(token, request_adapter, self.google_client_id)
            else:
                # In development mode, verify token signature without strict client_id check
                id_info = id_token.verify_oauth2_token(token, request_adapter)

            email = id_info.get("email", "").lower()
            email_verified = id_info.get("email_verified", False)
            name = id_info.get("name", "Utente Luxottica")
            picture = id_info.get("picture", "")

            if not email or not email_verified:
                raise ValueError("L'email associata all'account Google non è verificata.")

            # Check Allowlist
            is_allowed, reason = self.check_allowlist(email)
            if not is_allowed:
                logger.warning(f"Accesso negato per {email}: {reason}")
                raise ValueError(f"Accesso negato ({email}): {reason}")

            # Check Role
            role = "TRAINER" if self.is_trainer_email(email) else "STUDENT"

            return {
                "verified": True,
                "email": email,
                "name": name,
                "picture": picture,
                "role": role,
                "domain": email.split("@")[-1] if "@" in email else "",
                "user_id": id_info.get("sub", "")
            }

        except ValueError as ve:
            raise ve
        except Exception as e:
            logger.error(f"Errore durante la verifica del token Google OAuth: {e}")
            raise ValueError(f"Token Google OAuth non valido o scaduto: {str(e)}")

    def check_allowlist(self, email: str) -> tuple[bool, str]:
        """
        Checks if an email is permitted by allowed_domains or allowed_emails.
        """
        if not self.auth_required and not self.google_client_id:
            # Dev/Demo mode: open if auth not explicitly required
            return True, "Modalità Demo Aperta"

        email = email.lower()
        domain = email.split("@")[-1] if "@" in email else ""

        # Check explicit emails
        if email in self.allowed_emails:
            return True, "Email presente nella allowlist specifica"

        # Check wildcard domains
        if domain in self.allowed_domains:
            return True, f"Dominio @{domain} autorizzato"

        # If allowed_domains includes '*' or all domains allowed
        if "*" in self.allowed_domains:
            return True, "Tutti i domini sono autorizzati"

        return False, f"Il dominio @{domain} non è presente nella allowlist aziendale Luxottica."

    def is_trainer_email(self, email: str) -> bool:
        """
        Returns True if the verified email belongs to an authorized trainer/instructor.
        """
        email = email.lower()
        return email in self.trainer_emails

    def verify_trainer_access(self, email: Optional[str] = None, pin: Optional[str] = None) -> bool:
        """
        Dual verification for Trainer access: either via authorized email OR via fallback PIN.
        """
        if email and self.is_trainer_email(email):
            return True
        if pin and str(pin).strip() == str(self.trainer_pin).strip():
            return True
        return False

# Global instance
auth_service = AuthService()
