/**
 * Google OAuth 2.0 & Email Allowlist Service for Luxottica Training Hub
 */
window.luxAuth = {
    user: null,
    clientId: "",
    authRequired: false,
    allowedDomains: [],
    tenantConfig: null,

    init: async function() {
        try {
            const res = await fetch('/api/v2/config');
            if (res.ok) {
                const config = await res.json();
                this.clientId = config.google_client_id || "";
                this.authRequired = !!config.auth_required;
                this.allowedDomains = config.allowed_domains || [];
                if (config.tenant_config) {
                    this.tenantConfig = config.tenant_config;
                    this.applyTenantConfig(config.tenant_config);
                }
            }
        } catch (e) {
            console.warn("[Auth] Imperfetta lettura config:", e);
        }

        // Restore stored user if available
        const stored = localStorage.getItem('lux_user');
        if (stored) {
            try {
                this.user = JSON.parse(stored);
                this.updateUIProfileBadge();
            } catch (e) {
                localStorage.removeItem('lux_user');
            }
        }

        // Load Google GIS SDK if Client ID is configured or GIS button present
        if (this.clientId) {
            this.loadGoogleSDK();
        }
    },

    applyTenantConfig: function(tenant) {
        if (!tenant) return;
        
        // 1. Update Organization Branding Name and Logos
        if (tenant.org_name) {
            document.title = `${tenant.org_name} | IPSALE Engine`;
            const orgTitleEls = document.querySelectorAll('.tenant-org-name');
            orgTitleEls.forEach(el => { el.textContent = tenant.org_name; });
        }

        if (tenant.logo_url) {
            const logoEls = document.querySelectorAll('.tenant-logo-img');
            logoEls.forEach(el => { el.src = tenant.logo_url; });
        }

        // 2. Dynamic Team Names in Onboarding Modal
        if (tenant.team_names && Array.isArray(tenant.team_names) && tenant.team_names.length > 0) {
            const teamSelects = document.querySelectorAll('.tenant-team-select');
            teamSelects.forEach(select => {
                select.innerHTML = '<option value="">-- Seleziona il tuo Team --</option>' + 
                    tenant.team_names.map(t => `<option value="${t}">${t}</option>`).join('');
            });
        }
    },

    loadGoogleSDK: function() {
        if (document.getElementById('google-gsi-script')) return;
        const script = document.createElement('script');
        script.id = 'google-gsi-script';
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => this.renderGoogleButtons();
        document.head.appendChild(script);
    },

    renderGoogleButtons: function() {
        if (!window.google || !this.clientId) return;

        window.google.accounts.id.initialize({
            client_id: this.clientId,
            callback: (response) => this.handleGoogleCredential(response)
        });

        const targetElements = document.querySelectorAll('.google-signin-container');
        targetElements.forEach(el => {
            window.google.accounts.id.renderButton(el, {
                theme: 'outline',
                size: 'large',
                text: 'signin_with',
                shape: 'pill',
                logo_alignment: 'left'
            });
        });
    },

    handleGoogleCredential: async function(response) {
        if (!response || !response.credential) return;

        try {
            const res = await fetch('/api/v2/auth/verify-google-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential: response.credential })
            });

            const data = await res.json();
            if (res.ok && data.success && data.user) {
                this.user = data.user;
                localStorage.setItem('lux_user', JSON.stringify(this.user));
                this.updateUIProfileBadge();

                // Toast notification
                if (window.showToast) {
                    window.showToast(`Benvenuto ${this.user.name}! Accesso autorizzato (@${this.user.domain})`, 'success');
                }

                // Role actions
                if (this.isTrainer() && window.enableTrainerMode) {
                    window.enableTrainerMode();
                }
            } else {
                const errMsg = data.detail || "Accesso negato: email non presente nella allowlist.";
                if (window.showToast) {
                    window.showToast(errMsg, 'error');
                } else {
                    alert(errMsg);
                }
            }
        } catch (err) {
            console.error("[Auth] Errore verifica token Google:", err);
            alert("Errore durante la verifica dell'account Google.");
        }
    },

    isTrainer: function() {
        return this.user && ['TRAINER', 'MANAGER', 'CONTENT_CREATOR'].includes(this.user.role);
    },

    isManager: function() {
        return this.user && ['MANAGER', 'CONTENT_CREATOR'].includes(this.user.role);
    },

    isCreator: function() {
        return this.user && this.user.role === 'CONTENT_CREATOR';
    },

    updateUIProfileBadge: function() {
        const badgeEl = document.getElementById('user-profile-badge');
        if (!badgeEl) return;

        if (this.user) {
            let roleBadge = `<span class="px-2 py-0.5 text-xs font-medium bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">🎓 Studente</span>`;
            if (this.user.role === 'CONTENT_CREATOR') {
                roleBadge = `<span class="px-2 py-0.5 text-xs font-bold bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">🎨 Creator</span>`;
            } else if (this.user.role === 'MANAGER') {
                roleBadge = `<span class="px-2 py-0.5 text-xs font-bold bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30">💼 Manager</span>`;
            } else if (this.user.role === 'TRAINER') {
                roleBadge = `<span class="px-2 py-0.5 text-xs font-bold bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30">👑 Trainer</span>`;
            }
            
            badgeEl.innerHTML = `
                <div class="flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 rounded-full pl-1.5 pr-3 py-1 text-xs text-slate-200">
                    <img src="${this.user.picture || 'https://www.gstatic.com/images/branding/product/2x/avatar_square_blue_120dp.png'}" class="w-6 h-6 rounded-full border border-slate-600 object-cover" alt="User" />
                    <div class="flex flex-col text-left">
                        <span class="font-semibold text-slate-100 truncate max-w-[120px]">${this.user.name}</span>
                        <span class="text-[10px] text-slate-400 truncate max-w-[120px]">${this.user.email}</span>
                    </div>
                    ${roleBadge}
                    <button onclick="window.luxAuth.logout()" class="ml-1 text-slate-400 hover:text-rose-400 p-1 rounded transition-colors" title="Disconnetti">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    </button>
                </div>
            `;

            // Toggle Visibility of Manager UI elements
            const managerNavBtn = document.getElementById('nav-manager-btn');
            if (managerNavBtn) {
                if (this.isManager()) {
                    managerNavBtn.classList.remove('hidden');
                } else {
                    managerNavBtn.classList.add('hidden');
                }
            }
        } else {
            badgeEl.innerHTML = `
                <div class="google-signin-container"></div>
            `;
            this.renderGoogleButtons();
        }
    },

    logout: function() {
        this.user = null;
        localStorage.removeItem('lux_user');
        this.updateUIProfileBadge();
        if (window.showToast) {
            window.showToast("Disconnesso con successo.", "info");
        }
        location.reload();
    }
};

// Auto-init on DOM load
document.addEventListener('DOMContentLoaded', () => {
    window.luxAuth.init();
});
