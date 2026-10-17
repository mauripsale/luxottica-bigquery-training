/**
 * Manager Controls Module for IPSALE Engine v3.0
 * Handles Allowlist CRUD and CSV Drag & Drop Import
 */
window.managerControls = {
    allowlistData: null,

    openManagerModal: function() {
        const modal = document.getElementById('manager-admin-modal');
        if (!modal) {
            console.error("[Manager] Modal element #manager-admin-modal missing");
            return;
        }
        modal.showModal();
        this.fetchAllowlist();
    },

    closeManagerModal: function() {
        const modal = document.getElementById('manager-admin-modal');
        if (modal) modal.close();
    },

    fetchAllowlist: async function() {
        try {
            const res = await fetch('/api/v3/admin/allowlist');
            if (res.ok) {
                this.allowlistData = await res.json();
                this.renderAllowlistUI();
            } else {
                console.warn("[Manager] Impossibile recuperare allowlist:", res.statusText);
                if (res.status === 403 && window.showToast) {
                    window.showToast("🚫 Accesso Negato: Richiesto ruolo Manager Admin.", "error");
                }
            }
        } catch (err) {
            console.error("[Manager] Errore fetch allowlist:", err);
        }
    },

    renderAllowlistUI: function() {
        if (!this.allowlistData) return;

        // Stats
        const emailsCount = document.getElementById('mgr-stat-emails-count');
        if (emailsCount) emailsCount.textContent = this.allowlistData.total_allowed_emails || 0;

        const domainsList = document.getElementById('mgr-stat-domains-list');
        if (domainsList) {
            domainsList.textContent = (this.allowlistData.allowed_domains || []).map(d => `@${d}`).join(', ') || 'Nessuno';
        }

        const tableCounter = document.getElementById('mgr-table-counter');
        if (tableCounter) tableCounter.textContent = `${this.allowlistData.total_allowed_emails || 0} email`;

        // Table
        const tbody = document.getElementById('mgr-allowlist-tbody');
        if (!tbody) return;

        const emails = this.allowlistData.allowed_emails || [];
        if (emails.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="3" class="p-6 text-center text-slate-500 italic">Nessun indirizzo email specifico registrato. Gli utenti dei domini autorizzati possono accedere.</td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = emails.map(email => {
            const domain = email.split('@')[1] || '';
            return `
                <tr class="hover:bg-slate-800/60 transition-colors">
                    <td class="p-3 font-mono font-medium text-slate-200">${email}</td>
                    <td class="p-3 text-slate-400">@${domain}</td>
                    <td class="p-3 text-right">
                        <button onclick="window.managerControls.removeEmail('${email}')" class="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors" title="Rimuovi email">
                            🗑️
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    },

    handleEmailKeyDown: function(e) {
        if (e && e.key === 'Enter') {
            e.preventDefault();
            this.addSingleEmail();
        }
    },

    addSingleEmail: async function() {
        const input = document.getElementById('mgr-new-email-input');
        if (!input) return;
        const email = input.value.trim();
        if (!email || !email.includes('@')) {
            if (window.showToast) window.showToast('Inserisci un indirizzo email valido.', 'warning');
            return;
        }

        try {
            const res = await fetch('/api/v3/admin/allowlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email })
            });

            if (res.ok) {
                input.value = '';
                if (window.showToast) window.showToast(`Email ${email} aggiunta con successo!`, 'success');
                this.fetchAllowlist();
            } else {
                const err = await res.json();
                if (window.showToast) window.showToast(err.detail || 'Errore durante l\'aggiunta dell\'email.', 'error');
            }
        } catch (err) {
            console.error('[Manager] Errore add email:', err);
        }
    },

    removeEmail: async function(email) {
        if (!confirm(`Sei sicuro di voler rimuovere ${email} dalla allowlist?`)) return;

        try {
            const res = await fetch(`/api/v3/admin/allowlist/${encodeURIComponent(email)}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                if (window.showToast) window.showToast(`Email ${email} rimossa.`, 'info');
                this.fetchAllowlist();
            }
        } catch (err) {
            console.error('[Manager] Errore remove email:', err);
        }
    },

    // Drag & Drop handlers
    handleDragOver: function(e) {
        e.preventDefault();
        e.stopPropagation();
        const dropzone = document.getElementById('mgr-csv-dropzone');
        if (dropzone) dropzone.classList.add('border-blue-500', 'bg-blue-500/10');
    },

    handleDragLeave: function(e) {
        e.preventDefault();
        e.stopPropagation();
        const dropzone = document.getElementById('mgr-csv-dropzone');
        if (dropzone) dropzone.classList.remove('border-blue-500', 'bg-blue-500/10');
    },

    handleDrop: function(e) {
        e.preventDefault();
        e.stopPropagation();
        const dropzone = document.getElementById('mgr-csv-dropzone');
        if (dropzone) dropzone.classList.remove('border-blue-500', 'bg-blue-500/10');

        const dt = e.dataTransfer;
        const files = dt.files;
        if (files && files.length > 0) {
            this.processCsvFile(files[0]);
        }
    },

    handleFileSelect: function(e) {
        const files = e.target.files;
        if (files && files.length > 0) {
            this.processCsvFile(files[0]);
        }
    },

    processCsvFile: function(file) {
        if (!file) return;
        const fileName = file.name.toLowerCase();
        if (!fileName.endsWith('.csv') && !fileName.endsWith('.txt')) {
            if (window.showToast) {
                window.showToast('Seleziona un file con estensione .csv o .txt', 'warning');
            } else {
                alert('Seleziona un file con estensione .csv o .txt');
            }
            return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            const content = e.target.result;
            try {
                const res = await fetch('/api/v3/admin/allowlist/import-csv', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ csv_content: content })
                });

                const data = await res.json();
                if (res.ok && data.success) {
                    if (window.showToast) {
                        window.showToast(`Importati ${data.added_count} nuovi partecipanti da CSV!`, 'success');
                    }
                    this.fetchAllowlist();
                } else {
                    if (window.showToast) window.showToast(data.detail || 'Errore durante l\'importazione CSV', 'error');
                }
            } catch (err) {
                console.error('[Manager] Errore invio CSV:', err);
            }
        };
        reader.readAsText(file);
    }
};
