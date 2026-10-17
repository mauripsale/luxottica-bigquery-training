import os
import logging
from typing import Dict, Any, List, Optional, Tuple

try:
    from google.oauth2 import id_token
    from google.auth.transport import requests
except ImportError:
    id_token = None
    requests = None

try:
    from google.cloud import firestore
except ImportError:
    firestore = None

logger = logging.getLogger("auth-service")

class AuthService:
    def __init__(self, google_client_id: Optional[str] = None, project_id: Optional[str] = None):
        self.google_client_id = google_client_id or os.getenv("GOOGLE_CLIENT_ID", "")
        self.auth_required = os.getenv("AUTH_REQUIRED", "false").lower() in ("true", "1", "yes")
        self.project_id = project_id or os.getenv("GCP_PROJECT_ID", "qwiklabs-asl-02-9bb3224716de")
        
        # Firestore DB handle (optional / graceful fallback)
        self.db = None
        if firestore:
            try:
                self.db = firestore.Client(project=self.project_id)
                logger.info(f"Firestore Client inizializzato per AuthService (project: {self.project_id})")
            except Exception as e:
                logger.warning(f"Impossibile connettersi a Firestore per AuthService (modalità fallback in-memory): {e}")

        # Load allowlists and role lists from environment
        raw_domains = os.getenv("ALLOWED_DOMAINS", "luxottica.com,essilorluxottica.com,datatonic.com")
        self.allowed_domains = [d.strip().lower() for d in raw_domains.split(",") if d.strip()]

        raw_emails = os.getenv("ALLOWED_EMAILS", "")
        self.allowed_emails_set = {e.strip().lower() for e in raw_emails.split(",") if e.strip()}

        raw_trainers = os.getenv("TRAINER_EMAILS", "maurizio.ipsale@gmail.com,trainer@luxottica.com")
        self.trainer_emails_set = {e.strip().lower() for e in raw_trainers.split(",") if e.strip()}

        raw_managers = os.getenv("MANAGER_EMAILS", "maurizio.ipsale@gmail.com,manager@luxottica.com,manager@datatonic.com")
        self.manager_emails_set = {e.strip().lower() for e in raw_managers.split(",") if e.strip()}

        raw_creators = os.getenv("CONTENT_CREATOR_EMAILS", "maurizio.ipsale@gmail.com,creator@datatonic.com")
        self.creator_emails_set = {e.strip().lower() for e in raw_creators.split(",") if e.strip()}

        self.trainer_pin = os.getenv("TRAINER_PIN", "1926")

        # Load dynamic allowlist from Firestore if available
        self.load_allowlist_from_firestore()

    @property
    def allowed_emails(self) -> List[str]:
        """Returns sorted list of allowed emails for JSON serialization."""
        return sorted(list(self.allowed_emails_set))

    @property
    def trainer_emails(self) -> List[str]:
        return sorted(list(self.trainer_emails_set))

    @property
    def manager_emails(self) -> List[str]:
        return sorted(list(self.manager_emails_set))

    @property
    def creator_emails(self) -> List[str]:
        return sorted(list(self.creator_emails_set))

    # =========================================================================
    # FIRESTORE PERSISTENCE METHODS
    # =========================================================================
    def load_allowlist_from_firestore(self, tenant_id: str = "luxottica"):
        """Loads persistent allowlist from Firestore tenant document."""
        if not self.db:
            return
        try:
            doc_ref = self.db.collection("tenants").document(tenant_id).collection("allowlists").document("default")
            doc = doc_ref.get()
            if doc.exists:
                data = doc.to_dict() or {}
                stored_emails = data.get("allowed_emails", [])
                if stored_emails:
                    for e in stored_emails:
                        if e and isinstance(e, str):
                            self.allowed_emails_set.add(e.strip().lower())
                    logger.info(f"Caricati {len(stored_emails)} indirizzi email da Firestore per tenant '{tenant_id}'")
        except Exception as e:
            logger.warning(f"Errore durante il caricamento dell'allowlist da Firestore: {e}")

    def save_allowlist_to_firestore(self, tenant_id: str = "luxottica"):
        """Saves current allowlist set to Firestore tenant document."""
        if not self.db:
            return
        try:
            doc_ref = self.db.collection("tenants").document(tenant_id).collection("allowlists").document("default")
            doc_ref.set({
                "tenant_id": tenant_id,
                "allowed_emails": self.allowed_emails,
                "updated_at": firestore.SERVER_TIMESTAMP if firestore else None
            }, merge=True)
            logger.info(f"Salvata allowlist con {len(self.allowed_emails_set)} email in Firestore per tenant '{tenant_id}'")
        except Exception as e:
            logger.error(f"Errore durante il salvataggio dell'allowlist in Firestore: {e}")

    # =========================================================================
    # OAUTH & ROLE RESOLUTION
    # =========================================================================
    def verify_google_token(self, token: str) -> Dict[str, Any]:
        """
        Verifies a Google OAuth ID Token (JWT) sent from Google Identity Services on the frontend.
        Returns verified user payload if valid and authorized by allowlist.
        """
        if not token:
            raise ValueError("Token di autenticazione Google mancante.")

        try:
            request_adapter = requests.Request() if requests else None
            if self.google_client_id and id_token and request_adapter:
                id_info = id_token.verify_oauth2_token(token, request_adapter, self.google_client_id)
            elif id_token and request_adapter:
                # Dev mode: verify token signature without strict client_id check
                id_info = id_token.verify_oauth2_token(token, request_adapter)
            else:
                # Fallback for dev mode when google.oauth2 is not available
                raise ValueError("Libreria google-auth non disponibile nell'ambiente server.")

            email = id_info.get("email", "").lower()
            email_verified = id_info.get("email_verified", False)
            name = id_info.get("name", "Utente IPSALE")
            picture = id_info.get("picture", "")

            if not email or not email_verified:
                raise ValueError("L'email associata all'account Google non è verificata.")

            # Check Allowlist
            is_allowed, reason = self.check_allowlist(email)
            if not is_allowed:
                logger.warning(f"Accesso negato per {email}: {reason}")
                raise ValueError(f"Accesso negato ({email}): {reason}")

            # Resolve role: CONTENT_CREATOR > MANAGER > TRAINER > STUDENT
            role = self.resolve_role(email)

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

    def resolve_user_from_headers(self, authorization: Optional[str] = None, x_user_email: Optional[str] = None) -> Dict[str, Any]:
        """
        Resolves current user identity and assigned role from HTTP headers.
        Supports 'Authorization: Bearer <id_token>' or 'X-User-Email: <email>'.
        """
        # 1. Bearer Token Check
        if authorization and authorization.startswith("Bearer "):
            token = authorization.split("Bearer ")[-1].strip()
            if token and token != "undefined" and token != "null":
                try:
                    return self.verify_google_token(token)
                except Exception as e:
                    logger.debug(f"Bearer token non valido, fall-back a X-User-Email: {e}")

        # 2. X-User-Email / Dev Check
        email = (x_user_email or "").strip().lower()
        if email and "@" in email:
            is_allowed, reason = self.check_allowlist(email)
            if is_allowed:
                return {
                    "verified": True,
                    "email": email,
                    "name": email.split("@")[0].capitalize(),
                    "picture": "",
                    "role": self.resolve_role(email),
                    "domain": email.split("@")[-1],
                    "user_id": email
                }

        # 3. Default Demo / Unauthenticated Fallback
        if not self.auth_required:
            return {
                "verified": True,
                "email": "student@ipsale.io",
                "name": "Demo Student",
                "picture": "",
                "role": "STUDENT",
                "domain": "ipsale.io",
                "user_id": "demo-student"
            }

        raise ValueError("Autenticazione richiesta. Nessun token Google OAuth o indirizzo email fornito.")

    def resolve_role(self, email: str) -> str:
        """Resolves highest assigned role for a verified email in O(1) time."""
        clean = email.strip().lower()
        if clean in self.creator_emails_set:
            return "CONTENT_CREATOR"
        if clean in self.manager_emails_set:
            return "MANAGER"
        if clean in self.trainer_emails_set:
            return "TRAINER"
        return "STUDENT"

    def check_allowlist(self, email: str) -> Tuple[bool, str]:
        """
        Checks if an email is permitted by allowed_domains or allowed_emails_set in O(1) time.
        """
        if not self.auth_required and not self.google_client_id:
            return True, "Modalità Demo Aperta"

        clean = email.strip().lower()
        domain = clean.split("@")[-1] if "@" in clean else ""

        # Managers, Creators, and Trainers are always allowed
        if clean in self.manager_emails_set or clean in self.creator_emails_set or clean in self.trainer_emails_set:
            return True, "Email amministrativa autorizzata"

        # Check explicit emails set O(1)
        if clean in self.allowed_emails_set:
            return True, "Email presente nella allowlist specifica"

        # Check wildcard domains
        if any(domain == d or domain.endswith("." + d) for d in self.allowed_domains):
            return True, f"Dominio @{domain} autorizzato"

        if "*" in self.allowed_domains:
            return True, "Tutti i domini sono autorizzati"

        return False, f"Il dominio @{domain} non è presente nella allowlist aziendale."

    def is_trainer_email(self, email: str) -> bool:
        """Returns True if email is TRAINER, MANAGER or CONTENT_CREATOR."""
        clean = email.strip().lower()
        return clean in self.trainer_emails_set or clean in self.manager_emails_set or clean in self.creator_emails_set

    def is_manager_email(self, email: str) -> bool:
        """Returns True if email is MANAGER or CONTENT_CREATOR."""
        clean = email.strip().lower()
        return clean in self.manager_emails_set or clean in self.creator_emails_set

    def verify_trainer_access(self, email: Optional[str] = None, pin: Optional[str] = None) -> bool:
        """Dual verification for Trainer access: either via authorized email OR via fallback PIN."""
        if email and self.is_trainer_email(email):
            return True
        if pin and str(pin).strip() == str(self.trainer_pin).strip():
            return True
        return False

    # =========================================================================
    # DYNAMIC ALLOWLIST MANAGEMENT METHODS (O(1) & FIRESTORE SYNC)
    # =========================================================================
    def get_allowlist_details(self) -> Dict[str, Any]:
        """Returns current allowlist state and managed accounts."""
        return {
            "auth_required": self.auth_required,
            "allowed_domains": self.allowed_domains,
            "allowed_emails": self.allowed_emails,
            "trainer_emails": self.trainer_emails,
            "manager_emails": self.manager_emails,
            "creator_emails": self.creator_emails,
            "total_allowed_emails": len(self.allowed_emails_set)
        }

    def add_allowed_email(self, email: str) -> Dict[str, Any]:
        """Adds a single email to the allowlist in O(1) and persists to Firestore."""
        clean = email.strip().lower()
        parts = clean.split("@")
        if len(parts) != 2 or not parts[0] or "." not in parts[1] or len(parts[1]) < 3:
            raise ValueError("Indirizzo email non valido.")

        if clean not in self.allowed_emails_set:
            self.allowed_emails_set.add(clean)
            self.save_allowlist_to_firestore()
            logger.info(f"Aggiunta email alla allowlist: {clean}")

        return {"success": True, "email": clean, "total": len(self.allowed_emails_set)}

    def remove_allowed_email(self, email: str) -> Dict[str, Any]:
        """Removes a single email from the allowlist in O(1) and persists to Firestore."""
        clean = email.strip().lower()
        if clean in self.allowed_emails_set:
            self.allowed_emails_set.remove(clean)
            self.save_allowlist_to_firestore()
            logger.info(f"Rimossa email dalla allowlist: {clean}")
            return {"success": True, "removed": True, "email": clean}
        return {"success": True, "removed": False, "email": clean}

    def import_csv_emails(self, csv_content: str) -> Dict[str, Any]:
        """
        Parses raw CSV content and bulk registers new participant emails in O(N) total time.
        Fixed edge case validation: rejects '@no_user.com' and accepts valid short emails 'a@b.c'.
        """
        added = []
        skipped = []
        lines = csv_content.replace("\r\n", "\n").replace("\r", "\n").split("\n")
        
        for line in lines:
            tokens = [t.strip().strip('"').strip("'").lower() for token in line.split(",") for t in token.split(";")]
            for token in tokens:
                parts = token.split("@")
                # Valid email check: exactly 1 '@', non-empty username, valid domain with dot and min 3 chars
                if len(parts) == 2 and len(parts[0]) > 0 and "." in parts[1] and len(parts[1]) >= 3:
                    if token not in self.allowed_emails_set:
                        self.allowed_emails_set.add(token)
                        added.append(token)
                    else:
                        skipped.append(token)

        if added:
            self.save_allowlist_to_firestore()

        logger.info(f"Importati da CSV {len(added)} indirizzi email (saltati {len(skipped)})")
        return {
            "success": True,
            "added_count": len(added),
            "added_emails": added,
            "skipped_count": len(skipped),
            "total_allowed": len(self.allowed_emails_set)
        }

# Global instance
auth_service = AuthService()

