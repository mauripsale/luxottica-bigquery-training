    // =========================================================================
    // LOAD BALANCED MULTI-CHANNEL & MULTI-RELAY CLUSTER (STRADA B)
    // WITH DYNAMIC SECURE ROOM ISOLATION
    // =========================================================================
    function getRoomCode() {
      // 1) URL parameter ?room=xxx or ?r=xxx has highest priority
      const params = new URLSearchParams(window.location.search);
      const urlRoom = params.get('room') || params.get('r');
      if (urlRoom && urlRoom.trim()) {
        const cleaned = urlRoom.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
        if (cleaned) {
          try { localStorage.setItem('lux_bq_room_code_v1', cleaned); } catch(e) {}
          return cleaned;
        }
      }
      // 2) Saved room in localStorage
      try {
        const saved = localStorage.getItem('lux_bq_room_code_v1');
        if (saved && saved.trim()) return saved.trim();
      } catch(e) {}
      // 3) Default base room
      return 'lux-bq-2026';
    }

    let CURRENT_ROOM = getRoomCode();

    function updateRoomTopics(newRoom) {
      if (!newRoom) return;
      CURRENT_ROOM = newRoom.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '') || 'lux-bq-2026';
      try { localStorage.setItem('lux_bq_room_code_v1', CURRENT_ROOM); } catch(e) {}
      setText('trainer-room-code-badge', CURRENT_ROOM);
    }

    // LOCAL CROSS-TAB BUS FOR INSTANT ZERO-LATENCY SYNCHRONIZATION (SAME BROWSER PROFILE)
    let localBroadcastBus = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        localBroadcastBus = new BroadcastChannel('lux_classroom_sync_bus_v1');
      }
    } catch (e) {
      console.warn("BroadcastChannel not available:", e);
    }

    // AUTHORITATIVE GOOGLE CLOUD RUN + FIRESTORE SYNC (ZERO THIRD-PARTY RELAYS)
    async function publishBroadcast(payload) {
      if (!payload || !payload.action) return;

      // 1) INSTANT LOCAL CROSS-TAB SYNC (for tabs on same browser/device)
      try {
        if (localBroadcastBus) {
          localBroadcastBus.postMessage(payload);
        }
      } catch (e) {
        console.warn("[LocalBus] postMessage error:", e);
      }
      try {
        localStorage.setItem('lux_cross_tab_sync_msg', JSON.stringify({ payload, t: Date.now() }));
      } catch (e) {}

      // 2) AUTHORITATIVE CLOUD RUN + FIRESTORE NATIVE PERSISTENCE
      if (!window.hubClient) return;

      try {
        if (payload.action === 'change_block') {
          await window.hubClient.setBlock(payload.block);
        } else if (payload.action === 'set_lock') {
          await window.hubClient.setLock(payload.locked);
        } else if (payload.action === 'student_checkin' || payload.action === 'score_update') {
          const st = payload.student || currentStudent;
          if (st && (st.id || st.student_id)) {
            await window.hubClient.checkinStudent(st);
          }
        } else if (payload.action === 'trainer_change_team') {
          const st = classroomStudents[payload.targetStudentId];
          if (st) {
            await window.hubClient.checkinStudent(st);
          }
        } else if (payload.action === 'unlock_hint' || payload.action === 'hide_hint') {
          const state = getActiveClassroomState();
          await window.hubClient.setHints(state.unlockedHints || []);
        } else if (payload.action === 'timer_sync') {
          await window.hubClient.setTimer({
            is_active: !!payload.active,
            label: payload.label || '',
            end_timestamp: payload.active ? (Date.now() + (payload.remainingSec * 1000)) : null
          });
        }
      } catch (err) {
        console.warn("[CloudSync] publishBroadcast error:", err);
      }
    }

    // SAFE DOM HELPERS TO PREVENT SCRIPT CRASHES
    function setText(id, text) {
      const el = document.getElementById(id);
      if (el && text !== undefined) el.innerText = text;
    }

    function setHTML(id, html) {
      const el = document.getElementById(id);
      if (el && html !== undefined) el.innerHTML = html;
    }

    // MODERN WEB GUIDANCE: NATIVE DIALOG MODAL HELPERS
    function showModalDialog(idOrEl) {
      const dlg = typeof idOrEl === 'string' ? document.getElementById(idOrEl) : idOrEl;
      if (!dlg) return;
      dlg.classList.remove('hidden');
      if (typeof dlg.showModal === 'function') {
        if (!dlg.open) dlg.showModal();
      } else {
        dlg.setAttribute('open', '');
      }
    }

    function closeModalDialog(idOrEl) {
      const dlg = typeof idOrEl === 'string' ? document.getElementById(idOrEl) : idOrEl;
      if (!dlg) return;
      if (typeof dlg.close === 'function') {
        if (dlg.open) dlg.close();
      } else {
        dlg.removeAttribute('open');
        dlg.classList.add('hidden');
      }
    }

    function closeHamburgerMenu() {
      const menu = document.getElementById('app-hamburger-menu');
      if (menu && typeof menu.hidePopover === 'function') {
        try {
          if (menu.matches(':popover-open')) {
            menu.hidePopover();
          }
        } catch (e) {
          try { menu.hidePopover(); } catch (err) {}
        }
      }
    }

    function closeProfilePopover() {
      const pop = document.getElementById('student-profile-popover');
      if (pop && typeof pop.hidePopover === 'function') {
        try {
          if (pop.matches(':popover-open')) {
            pop.hidePopover();
          }
        } catch (e) {
          try { pop.hidePopover(); } catch (err) {}
        }
      }
    }

    // ENABLE TRAINER MODE FUNCTION (OPENS FULL-SCREEN TRAINER COMMAND CENTER)
    function enableTrainerMode() {
      isTrainerMode = true;
      closeRoleSelectionModal();

      const tcc = document.getElementById('trainer-command-center');
      if (tcc) tcc.classList.remove('hidden');
      const studentHdr = document.getElementById('student-main-header');
      if (studentHdr) studentHdr.classList.add('hidden');
      const mainLayout = document.getElementById('app-main-layout');
      if (mainLayout) mainLayout.classList.add('hidden');
      const banner = document.getElementById('trainer-preview-banner');
      if (banner) banner.classList.add('hidden');

      document.body.classList.add('trainer-mode-active');

      applyLockState(isStrictLocked);
      updateTrainerHintUI();
      const visibleBlock = Array.from(document.querySelectorAll('.block-section')).find(el => !el.classList.contains('hidden'));
      if (visibleBlock) {
        const bId = visibleBlock.id.replace('block-', '');
        updateTrainerBlockUI(bId);
      }
      refreshTrainerStudents();
      setText('trainer-room-code-badge', CURRENT_ROOM);
      setText('tcc-room-code', CURRENT_ROOM);
      pingStudentsFromTrainer(); // PING ALL EXISTING STUDENTS TO REPORT THEIR PRESENCE & SCORE
      showToast(currentLang === 'it' ? "🎓 Cabina di Regia Docente Attivata" : "🎓 Trainer Command Center Activated");
    }

    function switchToStudentPreview() {
      if (!isTrainerMode) return;
      const tcc = document.getElementById('trainer-command-center');
      if (tcc) tcc.classList.add('hidden');
      const studentHdr = document.getElementById('student-main-header');
      if (studentHdr) studentHdr.classList.remove('hidden');
      const mainLayout = document.getElementById('app-main-layout');
      if (mainLayout) mainLayout.classList.remove('hidden');
      const banner = document.getElementById('trainer-preview-banner');
      if (banner) banner.classList.remove('hidden');
      showToast(currentLang === 'it' ? "👁️ Modalità Anteprima Studente (Full-width)" : "👁️ Student Preview Mode");
    }

    function switchToTrainerCommandCenter() {
      if (!isTrainerMode) return;
      const banner = document.getElementById('trainer-preview-banner');
      if (banner) banner.classList.add('hidden');
      const studentHdr = document.getElementById('student-main-header');
      if (studentHdr) studentHdr.classList.add('hidden');
      const mainLayout = document.getElementById('app-main-layout');
      if (mainLayout) mainLayout.classList.add('hidden');
      const tcc = document.getElementById('trainer-command-center');
      if (tcc) tcc.classList.remove('hidden');
      refreshTrainerStudents();
    }

    function pingStudentsFromTrainer() {
      publishBroadcast({ action: 'ping_students' });
    }

    // DISABLE / EXIT TRAINER MODE FUNCTION (RETURNS TO REAL STUDENT VIEW)
    function disableTrainerMode() {
      isTrainerMode = false;
      const tcc = document.getElementById('trainer-command-center');
      if (tcc) tcc.classList.add('hidden');
      const banner = document.getElementById('trainer-preview-banner');
      if (banner) banner.classList.add('hidden');
      const studentHdr = document.getElementById('student-main-header');
      if (studentHdr) studentHdr.classList.remove('hidden');
      const mainLayout = document.getElementById('app-main-layout');
      if (mainLayout) mainLayout.classList.remove('hidden');
      document.body.classList.remove('trainer-mode-active');


      // Clear trainer query params from URL without page reload
      try {
        localStorage.removeItem('lux_bq_user_role_v1');
        const url = new URL(window.location.href);
        url.searchParams.delete('role');
        url.searchParams.delete('pin');
        url.searchParams.delete('trainer');
        window.history.replaceState({}, '', url.pathname + (url.search ? url.search : ''));
      } catch(e) {}

      applyLockState(isStrictLocked);
      showToast(currentLang === 'it' ? "🔒 Modalità Docente Disattivata (Vista Studente)" : "🔒 Trainer Mode Disabled (Student View)");
    }

    function toggleTrainerMode() {
      if (isTrainerMode) {
        disableTrainerMode();
      } else {
        enableTrainerMode();
      }
    }

    // TRAINER PIN CUSTOM MODAL CONTROLS (REPLACES BROWSER PROMPT SO PIN IS MASKED)
    function openTrainerPinModal() {
      const modal = document.getElementById('trainer-pin-modal');
      const input = document.getElementById('trainer-modal-pin');
      const errorMsg = document.getElementById('trainer-modal-error');
      if (!modal || !input) return;

      if (errorMsg) errorMsg.classList.add('hidden');
      input.value = '';
      showModalDialog(modal);
      setTimeout(() => input.focus(), 50);
    }

    function closeTrainerPinModal() {
      closeModalDialog('trainer-pin-modal');
    }

    function submitTrainerPinModal() {
      const input = document.getElementById('trainer-modal-pin');
      const errorMsg = document.getElementById('trainer-modal-error');
      if (!input) return;

      const entered = input.value.trim();
      if (entered === "1926" || entered === "2026" || entered === "1234" || entered === "trainer") {
        try {
          localStorage.setItem('lux_bq_user_role_v1', 'trainer');
        } catch(e) {}
        enableTrainerMode();
        closeTrainerPinModal();
        closeRoleSelectionModal();
        showToast(currentLang === 'it' ? "🎓 Modalità Docente Attivata!" : "🎓 Trainer Mode Activated!");
      } else {
        if (errorMsg) errorMsg.classList.remove('hidden');
        input.classList.add('ring-2', 'ring-red-500', 'bg-red-950');
        setTimeout(() => {
          input.classList.remove('ring-2', 'ring-red-500', 'bg-red-950');
        }, 1200);
      }
    }

    // SECRET LOGO TRIPLE-CLICK FOR TRAINER ACCESS
    function handleLogoClick() {
      logoClickCount++;
      clearTimeout(logoClickTimer);
      logoClickTimer = setTimeout(() => { logoClickCount = 0; }, 1000);

      if (logoClickCount >= 3) {
        logoClickCount = 0;
        openTrainerPinModal();
      }
    }

    // KEYBOARD SHORTCUT (Ctrl + Alt + T) TO TOGGLE TRAINER MODE
    window.addEventListener('keydown', (e) => {
      // Enter or Escape inside Trainer PIN modal
      const modal = document.getElementById('trainer-pin-modal');
      if (modal && (modal.open || !modal.classList.contains('hidden'))) {
        if (e.key === 'Enter') {
          e.preventDefault();
          submitTrainerPinModal();
          return;
        }
        if (e.key === 'Escape') {
          e.preventDefault();
          closeTrainerPinModal();
          return;
        }
      }

      if (e.ctrlKey && e.altKey && (e.key === 't' || e.key === 'T')) {
        e.preventDefault();
        if (isTrainerMode) {
          disableTrainerMode();
        } else {
          openTrainerPinModal();
        }
      }
    });

    // CENTRAL EVENT DISPATCHER FOR BOTH REMOTE SSE & LOCAL CROSS-TAB MESSAGES
    function dispatchIncomingEvent(payload) {
      if (!payload || !payload.action) return;
      try {
        if (payload.action === 'request_classroom_sync') {
          // If I am the trainer, respond immediately with the authoritative classroom state
          if (isTrainerMode) {
            const state = getActiveClassroomState();
            publishBroadcast({
              action: 'classroom_state_sync',
              block: state.block,
              locked: state.locked,
              unlockedHints: state.unlockedHints,
              studentDocsUnlocked: state.studentDocsUnlocked,
              targetStudentId: payload.studentId || null
            });
          }
        } else if (payload.action === 'classroom_state_sync') {
          // Apply authoritative state received from trainer
          if (!isTrainerMode) {
            if (!payload.targetStudentId || (currentStudent && currentStudent.id === payload.targetStudentId)) {
              handleRemoteClassroomStateSync(payload);
            }
          }
        } else if (payload.action === 'change_block') {
          showBlock(payload.block, true);
        } else if (payload.action === 'set_lock') {
          applyLockState(payload.locked);
        } else if (payload.action === 'unlock_hint') {
          applyRemoteHintUnlock(payload.hintId);
        } else if (payload.action === 'hide_hint') {
          applyRemoteHintHide(payload.hintId);
        } else if (payload.action === 'toggle_student_docs') {
          applyRemoteStudentDocs(payload.unlocked);
        } else if (payload.action === 'score_update' || payload.action === 'student_checkin') {
          handleRemoteStudentUpdate(payload);
        } else if (payload.action === 'student_logout') {
          handleRemoteStudentLogout(payload);
        } else if (payload.action === 'student_kick') {
          handleRemoteStudentKick(payload);
        } else if (payload.action === 'student_reset') {
          handleRemoteStudentReset(payload);
        } else if (payload.action === 'student_resume') {
          handleRemoteStudentResume(payload);
        } else if (payload.action === 'ping_students') {
          // Trainer asked all connected students to report their profile & scores
          // Use randomized jitter (0 to 2800ms) to spread requests across 3 seconds and avoid 429 bursts
          if (currentStudent && currentStudent.id && currentStudent.name && !isTrainerMode) {
            const randomJitter = Math.floor(Math.random() * 2800);
            broadcastStudentCheckin(randomJitter);
          }
        } else if (payload.action === 'trainer_change_team') {
          handleRemoteTrainerChangeTeam(payload);
        } else if (payload.action === 'trainer_override') {
          handleTrainerScoreOverride(payload);
        } else if (payload.action === 'reset_scores') {
          handleRemoteResetScores();
        } else if (payload.action === 'timer_start') {
          handleRemoteTimerStart(payload.durationMinutes, payload.label, payload.endTime);
        } else if (payload.action === 'timer_stop') {
          handleRemoteTimerStop();
        } else if (payload.action === 'celebrate_confetti') {
          fireConfettiAnimation();
        } else if (payload.action === 'set_break_game') {
          handleRemoteBreakGameSync(payload.game);
        }
      } catch (err) {
        console.warn("[Cluster Dispatcher] Error processing action:", payload.action, err);
      }
    }

    // Connect Local Cross-Tab Broadcast Channel (Same browser/device 0ms sync)
    if (localBroadcastBus) {
      localBroadcastBus.onmessage = function(event) {
        if (event && event.data) {
          dispatchIncomingEvent(event.data);
        }
      };
    }

    // Connect Cross-Tab storage event fallback
    window.addEventListener('storage', (e) => {
      if (e.key === 'lux_cross_tab_sync_msg' && e.newValue) {
        try {
          const item = JSON.parse(e.newValue);
          if (item && item.payload) {
            dispatchIncomingEvent(item.payload);
          }
        } catch (err) {}
      }
    });

    // INITIALIZE REAL-TIME CLOUD RUN + FIRESTORE STATE SYNCHRONIZATION
    let syncEngineActive = false;

    function initClusterEventListener() {
      if (syncEngineActive) return;
      if (!window.hubClient) {
        setTimeout(initClusterEventListener, 200);
        return;
      }
      syncEngineActive = true;

      const dot = document.getElementById('net-status-dot');
      const text = document.getElementById('net-status-text');

      window.hubClient.onStateChange((state) => {
        if (!state) return;
        if (dot) dot.className = "w-1.5 h-1.5 rounded-full bg-emerald-500";
        if (text) text.innerText = "Cloud Run Live";

        // 1) Active Block sync (students follow trainer)
        if (state.active_block !== undefined && state.active_block !== null) {
          if (!isTrainerMode) {
            showBlock(state.active_block, true);
          }
        }

        // 2) Lock state sync
        if (state.is_locked !== undefined && state.is_locked !== null) {
          if (!isTrainerMode) {
            applyLockState(state.is_locked);
          }
        }

        // 3) Unlocked hints sync
        if (Array.isArray(state.unlocked_hints)) {
          state.unlocked_hints.forEach(hId => {
            if (typeof applyRemoteHintUnlock === 'function') {
              applyRemoteHintUnlock(hId, true);
            }
          });
        }

        // 4) Timer sync
        if (state.timer) {
          if (state.timer.is_active && state.timer.end_timestamp) {
            const remSec = Math.max(0, Math.floor((state.timer.end_timestamp - Date.now()) / 1000));
            if (remSec > 0 && typeof applyRemoteTimerSync === 'function') {
              applyRemoteTimerSync({
                active: true,
                label: state.timer.label || 'TIMER',
                remainingSec: remSec
              });
            }
          } else if (typeof stopClassroomTimer === 'function') {
            stopClassroomTimer();
          }
        }

        // 4.5) Break game sync from Trainer
        if (state.break_game && !isTrainerMode && typeof handleRemoteBreakGameSync === 'function') {
          handleRemoteBreakGameSync(state.break_game);
        }

        // 5) Students roster sync from Firestore
        if (Array.isArray(state.students)) {
          state.students.forEach(st => {
            const sid = st.student_id || st.id;
            if (sid) {
              classroomStudents[sid] = {
                id: sid,
                name: st.name || 'Detective',
                teamKey: st.team_key || st.teamKey || 'rayban',
                email: st.email || '',
                picture: st.picture || '',
                score: st.score || 0,
                completedChallenges: st.completed_challenges || {},
                lastActive: Date.now(),
                loggedOut: false
              };
            }
          });
          if (typeof refreshTrainerStudents === 'function') {
            refreshTrainerStudents();
          }
          if (typeof renderLeaderboardUI === 'function') {
            renderLeaderboardUI();
          }
        }
      });

      // Poll Cloud Run + Firestore every 2000ms
      window.hubClient.startPolling(2000);
    }

    initClusterEventListener();

    // UPDATE VISUAL ACTIVE STATE OF TRAINER BLOCK BUTTONS IN SIDEBAR
    function updateTrainerBlockUI(activeBlockId) {
      const blockButtonMap = {
        'cover': 'tb-btn-cover',
        '1': 'tb-btn-b1',
        '2': 'tb-btn-b2',
        'break': 'tb-btn-break',
        '3': 'tb-btn-b3',
        '4': 'tb-btn-b4',
        '5': 'tb-btn-b5'
      };

      const blockBadgeNames = {
        'cover': { it: 'Intro', en: 'Intro' },
        '1': { it: 'Blocco 1', en: 'Block 1' },
        '2': { it: 'Blocco 2', en: 'Block 2' },
        'break': { it: 'Pausa Caffè', en: 'Coffee Break' },
        '3': { it: 'Blocco 3', en: 'Block 3' },
        '4': { it: 'Blocco 4', en: 'Block 4' },
        '5': { it: 'Finale', en: 'Summary' }
      };

      const activeBadgeEl = document.getElementById('tcc-active-block-badge');
      if (activeBadgeEl) {
        const key = String(activeBlockId || 'cover');
        const badgeInfo = blockBadgeNames[key] || { it: key, en: key };
        activeBadgeEl.innerText = currentLang === 'it' ? badgeInfo.it : badgeInfo.en;
      }

      Object.entries(blockButtonMap).forEach(([bId, btnId]) => {
        const btn = document.getElementById(btnId);
        if (!btn) return;
        const isActive = (String(bId) === String(activeBlockId));
        if (isActive) {
          btn.className = "w-full text-left p-3 rounded-xl font-bold text-white bg-blue-600 shadow-md ring-2 ring-amber-400 ring-offset-1 ring-offset-slate-900 transition flex items-center justify-between";
        } else {
          btn.className = "w-full text-left p-3 rounded-xl font-medium text-slate-300 hover:text-white bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 transition flex items-center justify-between group cursor-pointer";
        }

        const tagEl = document.getElementById(`tb-live-tag-${bId}`);
        if (tagEl) {
          if (isActive) {
            tagEl.innerHTML = '<span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-400 text-slate-950 animate-pulse">LIVE</span>';
          } else {
            const inactiveText = currentLang === 'it' ? 'Inattivo' : 'Inactive';
            tagEl.innerHTML = `<span class="text-[10px] text-slate-500 font-mono">${inactiveText}</span>`;
          }
        }
      });
    }

    // UPDATE REAL-TIME STATUS OF INDIVIDUAL HINT BUTTONS
    function updateTrainerHintUI() {
      const allHintKeys = [
        { id: 'b1-s1', code: '1.1', label: 'Step 1.1 (Data Canvas)' },
        { id: 'b1-s2', code: '1.2', label: 'Step 1.2 (Macro Sales)' },
        { id: 'b2-s1', code: '2.1', label: 'Step 2.1 (AOV > 300€)' },
        { id: 'b2-s2', code: '2.2', label: 'Step 2.2 (Discounts)' },
        { id: 'b3',    code: 'B3',  label: 'Block 3 (ROAS Query)' },
        { id: 'b4',    code: 'B4',  label: 'Block 4 (VIP Leads)' }
      ];

      let anyUnlocked = false;

      allHintKeys.forEach(item => {
        const content = document.getElementById(`content-${item.id}`);
        const isUnlocked = content && !content.classList.contains('hidden');
        if (isUnlocked) anyUnlocked = true;

        const btn = document.getElementById(`btn-hint-${item.id}`);
        if (btn) {
          if (isUnlocked) {
            btn.className = "px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400 shadow-md ring-2 ring-emerald-400/60 transition cursor-pointer flex items-center space-x-1";
            btn.innerHTML = `<span>${item.code}</span> <span>🔓</span>`;
            btn.title = `${item.label}: SBLOCCATO! Clicca per RI-BLOCCARE`;
          } else {
            btn.className = "px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer flex items-center space-x-1";
            btn.innerHTML = `<span>${item.code}</span> <span>🔒</span>`;
            btn.title = `${item.label}: BLOCCATO. Clicca per SBLOCCARE`;
          }
        }
      });

      // Update the "✨ Tutti" button
      const allBtn = document.getElementById('btn-hint-all-toggle');
      if (allBtn) {
        if (anyUnlocked) {
          allBtn.className = "px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-700 hover:bg-emerald-600 text-white border border-emerald-500 transition cursor-pointer";
          allBtn.innerText = currentLang === 'it' ? "🔒 Nascondi Tutti" : "🔒 Hide All";
          allBtn.title = currentLang === 'it' ? "Clicca per bloccare nuovamente tutti gli aiuti" : "Click to re-lock all hints";
        } else {
          allBtn.className = "px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-600 hover:bg-amber-500 text-white border border-amber-500 transition cursor-pointer shadow";
          allBtn.innerText = currentLang === 'it' ? "✨ Sblocca Tutti" : "✨ Unlock All";
          allBtn.title = currentLang === 'it' ? "Clicca per sbloccare tutti gli aiuti per tutta l'aula" : "Click to unlock all hints for students";
        }
      }
    }

    // TRAINER PIN VISIBILITY TOGGLE (PROTECTS PROJECTION FROM ACCIDENTAL STUDENT SNOOPING)
    let trainerPinsRevealed = false;

    function toggleTrainerPinsVisibility() {
      trainerPinsRevealed = !trainerPinsRevealed;
      const allPins = document.querySelectorAll('.trainer-secret-pin');
      allPins.forEach(el => {
        const pinValue = el.getAttribute('data-pin');
        if (trainerPinsRevealed) {
          el.innerText = pinValue;
          el.classList.remove('bg-slate-800');
          el.classList.add('bg-amber-950/80', 'text-amber-200', 'border', 'border-amber-500/40');
        } else {
          el.innerText = '••••';
          el.classList.remove('bg-amber-950/80', 'text-amber-200', 'border', 'border-amber-500/40');
          el.classList.add('bg-slate-800');
        }
      });

      const iconEl = document.getElementById('pin-vis-icon');
      const textEl = document.getElementById('pin-vis-text');
      if (iconEl) iconEl.innerText = trainerPinsRevealed ? '🙈' : '👁️';
      if (textEl) textEl.innerText = trainerPinsRevealed 
        ? (currentLang === 'it' ? 'Nascondi PIN' : 'Hide PINs')
        : (currentLang === 'it' ? 'Mostra PIN' : 'Show PINs');
    }

    function toggleSinglePin(el) {
      if (!el) return;
      const pinValue = el.getAttribute('data-pin');
      if (el.innerText === '••••') {
        el.innerText = pinValue;
        el.classList.remove('bg-slate-800');
        el.classList.add('bg-amber-950/80', 'text-amber-200', 'border', 'border-amber-500/40');
      } else {
        el.innerText = '••••';
        el.classList.remove('bg-amber-950/80', 'text-amber-200', 'border', 'border-amber-500/40');
        el.classList.add('bg-slate-800');
      }
    }

    function toggleTrainerSolutionsCheatSheet() {
      const sheet = document.getElementById('trainer-solutions-cheatsheet');
      const btn = document.getElementById('btn-toggle-solutions-cheatsheet');
      if (!sheet || !btn) return;
      if (sheet.classList.contains('hidden')) {
        sheet.classList.remove('hidden');
        btn.innerText = currentLang === 'it' ? 'Nascondi 🙈' : 'Hide 🙈';
      } else {
        sheet.classList.add('hidden');
        btn.innerText = currentLang === 'it' ? 'Mostra 👁️' : 'Show 👁️';
      }
    }

    function openTrainerSolutionsModal() {
      showModalDialog('trainer-solutions-modal');
    }

    function closeTrainerSolutionsModal() {
      closeModalDialog('trainer-solutions-modal');
    }

    function switchBoardSlide(slideIdx) {
      const totalSlides = 3;
      for (let i = 0; i < totalSlides; i++) {
        const slide = document.getElementById(`board-slide-${i}`);
        const btn = document.getElementById(`btn-slide-${i}`);
        if (slide) {
          if (i === slideIdx) {
            slide.classList.remove('hidden');
          } else {
            slide.classList.add('hidden');
          }
        }
        if (btn) {
          if (i === slideIdx) {
            btn.className = "px-2.5 py-1 rounded-lg font-bold bg-blue-600 text-white shadow-xs";
          } else {
            btn.className = "px-2.5 py-1 rounded-lg font-bold bg-slate-100 hover:bg-slate-200 text-slate-600";
          }
        }
      }
    }

    // REMOTE UNLOCK HINT DISPATCHER (APPLIES TO LOCAL DOM)
    const notifiedUnlockedHints = new Set();
    const notifiedLockedHints = new Set();

    function applyRemoteHintUnlock(hintId, silent = false) {
      const allHintIds = ['b1-s1', 'b1-s2', 'b2-s1', 'b2-s2', 'b3', 'b4'];
      const targets = (hintId === 'all') ? allHintIds : [hintId];
      let anyWasLocked = false;

      targets.forEach(id => {
        const lockState = document.getElementById(`lock-state-${id}`);
        const content = document.getElementById(`content-${id}`);
        if (lockState && !lockState.classList.contains('hidden')) {
          anyWasLocked = true;
        }
        if (lockState) lockState.classList.add('hidden');
        if (content) content.classList.remove('hidden');
        notifiedLockedHints.delete(id);
      });

      updateTrainerHintUI();

      if (!silent && anyWasLocked) {
        const toastKey = hintId === 'all' ? 'all' : hintId;
        if (!notifiedUnlockedHints.has(toastKey)) {
          notifiedUnlockedHints.add(toastKey);
          const msg = (hintId === 'all')
            ? (currentLang === 'it' ? "📢 Il Docente ha sbloccato TUTTI gli aiuti!" : "📢 The Trainer unlocked ALL hints!")
            : (currentLang === 'it' ? `📢 Il Docente ha sbloccato l'aiuto (${hintId})!` : `📢 The Trainer unlocked hint (${hintId})!`);
          showToast(msg);
        }
      }
    }

    // REMOTE HIDE HINT DISPATCHER (LOCKS HINT BACK BEHIND PIN)
    function applyRemoteHintHide(hintId, silent = false) {
      const allHintIds = ['b1-s1', 'b1-s2', 'b2-s1', 'b2-s2', 'b3', 'b4'];
      const targets = (hintId === 'all') ? allHintIds : [hintId];
      let anyWasUnlocked = false;

      targets.forEach(id => {
        const lockState = document.getElementById(`lock-state-${id}`);
        const content = document.getElementById(`content-${id}`);
        const pinInput = document.getElementById(`pin-${id}`);
        if (content && !content.classList.contains('hidden')) {
          anyWasUnlocked = true;
        }
        if (content) content.classList.add('hidden');
        if (lockState) lockState.classList.remove('hidden');
        if (pinInput) pinInput.value = '';
        notifiedUnlockedHints.delete(id);
      });

      updateTrainerHintUI();

      if (!silent && anyWasUnlocked) {
        const toastKey = hintId === 'all' ? 'all' : hintId;
        if (!notifiedLockedHints.has(toastKey)) {
          notifiedLockedHints.add(toastKey);
          const msg = (hintId === 'all')
            ? (currentLang === 'it' ? "🔒 Il Docente ha ri-bloccato TUTTI gli aiuti!" : "🔒 The Trainer re-locked ALL hints!")
            : (currentLang === 'it' ? `🔒 Il Docente ha ri-bloccato l'aiuto (${hintId})!` : `🔒 The Trainer re-locked hint (${hintId})!`);
          showToast(msg);
        }
      }
    }

    // ONE-CLICK TRAINER TOGGLE FOR INDIVIDUAL HINT
    function trainerToggleHint(hintId) {
      const content = document.getElementById(`content-${hintId}`);
      const isCurrentlyUnlocked = content && !content.classList.contains('hidden');

      if (isCurrentlyUnlocked) {
        // Was unlocked -> Hide / lock it
        applyRemoteHintHide(hintId);
        publishBroadcast({ action: 'hide_hint', hintId: hintId });
        showToast(currentLang === 'it' ? `🔒 Aiuto ${hintId} ri-nascosto per tutta l'aula!` : `🔒 Hint ${hintId} hidden again for all students!`);
      } else {
        // Was locked -> Unlock it
        applyRemoteHintUnlock(hintId);
        publishBroadcast({ action: 'unlock_hint', hintId: hintId });
        showToast(currentLang === 'it' ? `📡 Aiuto ${hintId} sbloccato per tutta l'aula!` : `📡 Hint ${hintId} unlocked for all students!`);
      }
    }

    // ONE-CLICK TRAINER TOGGLE FOR ALL HINTS TOGETHER
    function trainerToggleAllHints() {
      const allHintIds = ['b1-s1', 'b1-s2', 'b2-s1', 'b2-s2', 'b3', 'b4'];
      const anyUnlocked = allHintIds.some(id => {
        const content = document.getElementById(`content-${id}`);
        return content && !content.classList.contains('hidden');
      });

      if (anyUnlocked) {
        // If some or all are unlocked -> Hide all
        applyRemoteHintHide('all');
        publishBroadcast({ action: 'hide_hint', hintId: 'all' });
        showToast(currentLang === 'it' ? "🔒 Tutti gli aiuti ri-nascosti per tutta l'aula!" : "🔒 All hints hidden again for all students!");
      } else {
        // All are locked -> Unlock all
        applyRemoteHintUnlock('all');
        publishBroadcast({ action: 'unlock_hint', hintId: 'all' });
        showToast(currentLang === 'it' ? "📡 Tutti gli aiuti sbloccati per tutta l'aula!" : "📡 All hints unlocked for all students!");
      }
    }

    // TRAINER TOGGLE STUDENT GUIDES ACCESS
    let areStudentDocsUnlocked = false;

    function applyRemoteStudentDocs(unlocked) {
      areStudentDocsUnlocked = !!unlocked;
      const lockedState = document.getElementById('student-docs-locked-state');
      const unlockedState = document.getElementById('student-docs-unlocked-state');
      const lockBadge = document.getElementById('student-docs-lock-badge');
      const trainerBadge = document.getElementById('trainer-student-guides-badge');
      const trainerBtnText = document.getElementById('btn-toggle-student-docs-text');
      const trainerBtn = document.getElementById('btn-toggle-student-docs');

      if (areStudentDocsUnlocked) {
        if (lockedState) lockedState.classList.add('hidden');
        if (unlockedState) unlockedState.classList.remove('hidden');
        if (lockBadge) {
          lockBadge.className = "text-[10px] bg-emerald-100 text-emerald-700 font-mono font-bold px-2 py-0.5 rounded-full border border-emerald-200";
          lockBadge.innerText = currentLang === 'it' ? "🔓 Sbloccata" : "🔓 Unlocked";
        }
        if (trainerBadge) {
          trainerBadge.className = "text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.2 rounded font-mono font-bold";
          trainerBadge.innerText = currentLang === "it" ? "🔓 Sbloccate" : "🔓 Unlocked";
        }
        if (trainerBtnText) {
          trainerBtnText.innerText = currentLang === "it" ? "🔒 Blocca Guide per gli Studenti" : "🔒 Lock Guides for Students";
        }
        if (trainerBtn) {
          trainerBtn.className = "w-full py-1.5 px-2 rounded-lg bg-red-950/80 hover:bg-red-800 border border-red-700/60 text-red-200 hover:text-white text-[10px] font-bold transition flex items-center justify-center space-x-1 cursor-pointer";
        }
      } else {
        if (unlockedState) unlockedState.classList.add('hidden');
        if (lockedState) lockedState.classList.remove('hidden');
        if (lockBadge) {
          lockBadge.className = "text-[10px] bg-slate-100 text-slate-500 font-mono font-bold px-2 py-0.5 rounded-full border border-slate-200";
          lockBadge.innerText = currentLang === 'it' ? "🔒 Bloccata" : "🔒 Locked";
        }
        if (trainerBadge) {
          trainerBadge.className = "text-[9px] bg-red-950 text-red-300 border border-red-800 px-1.5 py-0.2 rounded font-mono font-bold";
          trainerBadge.innerText = currentLang === "it" ? "🔒 Bloccate" : "🔒 Locked";
        }
        if (trainerBtnText) {
          trainerBtnText.innerText = currentLang === "it" ? "🔓 Sblocca Guide per gli Studenti" : "🔓 Unlock Guides for Students";
        }
        if (trainerBtn) {
          trainerBtn.className = "w-full py-1.5 px-2 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 border border-emerald-500/40 text-emerald-300 hover:text-white text-[10px] font-bold transition flex items-center justify-center space-x-1 cursor-pointer";
        }
      }

      // Re-evaluate sidebar challenge file buttons
      try {
        const curBlock = localStorage.getItem('lux_bq_active_block_v1') || '1';
        updateSidebarChallengeLocks(curBlock);
      } catch(e) {}
    }

    function trainerToggleStudentDocs() {
      const targetState = !areStudentDocsUnlocked;
      applyRemoteStudentDocs(targetState);
      publishBroadcast({ action: 'toggle_student_docs', unlocked: targetState });
      showToast(targetState 
        ? (currentLang === 'it' ? "📢 Guide Studenti SBLOCCATE per tutta l'aula!" : "📢 Student Guides UNLOCKED for classroom!")
        : (currentLang === 'it' ? "🔒 Guide Studenti BLOCCATE per tutta l'aula!" : "🔒 Student Guides LOCKED for classroom!"));
    }

    // TRAINER OPTIONAL COUNTDOWN TIMER & CONFETTI CELEBRATION
    let classroomTimerInterval = null;
    let classroomTimerEndTime = null;

    function handleRemoteTimerStart(minutes, label, endTime) {
      if (classroomTimerInterval) clearInterval(classroomTimerInterval);
      classroomTimerEndTime = endTime || (Date.now() + (minutes * 60 * 1000));
      
      const badge = document.getElementById('classroom-timer-badge');
      const labelEl = document.getElementById('classroom-timer-label');
      const clockEl = document.getElementById('classroom-timer-clock');
      const trainerStatus = document.getElementById('trainer-timer-status');

      if (badge) badge.classList.remove('hidden');
      if (labelEl) labelEl.innerText = (label || 'Timer') + ':';
      if (trainerStatus) {
        trainerStatus.innerText = `${minutes}m ${label || ''}`.trim();
        trainerStatus.className = "text-[9px] font-mono font-bold text-amber-400";
      }

      function tick() {
        const remainingMs = classroomTimerEndTime - Date.now();
        if (remainingMs <= 0) {
          clearInterval(classroomTimerInterval);
          classroomTimerInterval = null;
          if (clockEl) clockEl.innerText = "00:00";
          if (badge) badge.className = "flex items-center space-x-2 bg-red-100 text-red-900 border border-red-300 text-xs font-mono font-bold px-3 py-1 rounded-full shadow-xs animate-bounce";
          if (trainerStatus) {
            trainerStatus.innerText = currentLang === 'it' ? "Tempo Scaduto!" : "Time's up!";
            trainerStatus.className = "text-[9px] font-mono font-bold text-red-400";
          }
          showToast(currentLang === 'it' ? "⏰ Tempo scaduto per l'attività!" : "⏰ Time is up for current activity!");
          return;
        }
        const totalSec = Math.floor(remainingMs / 1000);
        const m = Math.floor(totalSec / 60);
        const s = totalSec % 60;
        if (clockEl) clockEl.innerText = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      }

      tick();
      classroomTimerInterval = setInterval(tick, 1000);
    }

    function handleRemoteTimerStop() {
      if (classroomTimerInterval) {
        clearInterval(classroomTimerInterval);
        classroomTimerInterval = null;
      }
      classroomTimerEndTime = null;
      const badge = document.getElementById('classroom-timer-badge');
      const trainerStatus = document.getElementById('trainer-timer-status');
      if (badge) badge.classList.add('hidden');
      if (trainerStatus) {
        trainerStatus.innerText = currentLang === 'it' ? "Spento" : "Off";
        trainerStatus.className = "text-[9px] font-mono font-bold text-slate-500";
      }
    }

    function trainerStartTimer(minutes, label) {
      const endTime = Date.now() + (minutes * 60 * 1000);
      handleRemoteTimerStart(minutes, label, endTime);
      publishBroadcast({
        action: 'timer_start',
        durationMinutes: minutes,
        label: label,
        endTime: endTime
      });
      showToast(currentLang === 'it' ? `⏱️ Timer di ${minutes} min avviato per l'aula!` : `⏱️ ${minutes} min timer started for classroom!`);
    }

    function trainerStopTimer() {
      handleRemoteTimerStop();
      publishBroadcast({ action: 'timer_stop' });
      showToast(currentLang === 'it' ? "⏹️ Timer aula fermato." : "⏹️ Classroom timer stopped.");
    }

    // CONFETTI CELEBRATION
    function fireConfettiAnimation() {
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        setTimeout(() => {
          confetti({
            particleCount: 60,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
          });
          confetti({
            particleCount: 60,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
          });
        }, 300);
      }
    }

    function triggerClassroomConfetti() {
      fireConfettiAnimation();
      publishBroadcast({ action: 'celebrate_confetti' });
      showToast("🎉 Pioggia di coriandoli lanciata per tutta l'aula!");
    }

