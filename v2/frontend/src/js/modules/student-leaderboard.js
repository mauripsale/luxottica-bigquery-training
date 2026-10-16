    // ==========================================
    // STATEFUL STUDENT & LEADERBOARD MANAGEMENT
    // ==========================================
    const TEAMS = [
      { key: 'rayban', name: 'Team Ray-Ban', icon: '🕶️', desc: 'Smart Glasses & Categorie Iconiche', color: 'blue' },
      { key: 'oakley', name: 'Team Oakley', icon: '🕶️', desc: 'Sport Performance & Prizm Lens Tech', color: 'orange' },
      { key: 'persol', name: 'Team Persol', icon: '🕶️', desc: 'Handmade Italian Craftsmanship', color: 'amber' },
      { key: 'oliver', name: 'Team Oliver Peoples', icon: '🕶️', desc: 'Luxury Vintage & Custom Acetates', color: 'purple' }
    ];

    let currentStudent = {
      id: '',
      name: '',
      email: '',
      picture: '',
      googleSub: '',
      teamKey: '',
      score: 0,
      completedChallenges: {
        ch0: false,
        ch1: false,
        ch2: false,
        ch3: false
      }
    };

    let googleClientId = null;
    window.hubClient = window.hubClient || (typeof TrainingHubClient !== 'undefined' ? new TrainingHubClient() : null);

    // CLASSROOM STUDENTS DIRECTORY (STATEFUL IN LOCALSTORAGE + LIVE SSE)
    let classroomStudents = {};

    function getStudentStorageKey() {
      return 'lux_bq_student_profile_v1';
    }

    function getClassroomStorageKey() {
      return 'lux_bq_classroom_students_v1';
    }

    function getRoleStorageKey() {
      return 'lux_bq_user_role_v1';
    }

    function openRoleSelectionModal() {
      showModalDialog('role-selection-modal');
    }

    function closeRoleSelectionModal() {
      closeModalDialog('role-selection-modal');
    }

    function backToRoleSelection() {
      closeOnboardingModal();
      openRoleSelectionModal();
    }

    function selectRoleTrainer() {
      closeRoleSelectionModal();
      // Prompt for trainer PIN
      openTrainerPinModal();
    }

    function selectRoleStudent() {
      // If a student profile already exists in this browser, show the friendly choice modal!
      if (currentStudent && currentStudent.name && currentStudent.id) {
        closeRoleSelectionModal();
        openExistingSessionPromptModal();
      } else {
        closeRoleSelectionModal();
        localStorage.setItem(getRoleStorageKey(), 'student');
        openOnboardingModal(false);
      }
    }

    function openExistingSessionPromptModal() {
      const modal = document.getElementById('student-session-prompt-modal');
      if (!modal) return;

      const tObj = TEAMS.find(t => t.key === currentStudent.teamKey) || TEAMS[0];
      const chDone = Object.values(currentStudent.completedChallenges || {}).filter(Boolean).length;

      setText('session-card-name', currentStudent.name || 'Detective');
      setText('session-card-team', `${tObj.icon} ${tObj.name}`);
      setText('session-card-score', `${currentStudent.score || 0} pt`);
      setText('session-card-challenges', `${chDone}/3 completate`);
      setText('session-btn-name', currentStudent.name || 'Detective');

      showModalDialog('student-session-prompt-modal');
    }

    function closeExistingSessionPromptModal() {
      closeModalDialog('student-session-prompt-modal');
    }

    function resumeExistingLocalSession() {
      closeExistingSessionPromptModal();
      localStorage.setItem(getRoleStorageKey(), 'student');
      applyStudentProfileUI();
      registerStudentInClassroom(currentStudent);
      broadcastStudentCheckin();
      showToast(currentLang === 'it' 
        ? `👋 Bentornato/a, ${currentStudent.name}! Sessione ripristinata.` 
        : `👋 Welcome back, ${currentStudent.name}! Session resumed.`);
    }

    function startAsNewStudent() {
      closeExistingSessionPromptModal();

      // Reset local in-memory student object
      currentStudent = {
        id: '',
        name: '',
        email: '',
        picture: '',
        googleSub: '',
        teamKey: '',
        score: 0,
        completedChallenges: {}
      };

      try {
        localStorage.removeItem(getStudentStorageKey());
      } catch (e) {}

      // Reset challenge badges and score display
      setText('student-display-name', 'Detective');
      setText('student-display-team', 'Team Ray-Ban');
      setText('student-display-score', '0');

      localStorage.setItem(getRoleStorageKey(), 'student');
      openOnboardingModal(false);
    }

    function backToRoleSelectionFromPrompt() {
      closeExistingSessionPromptModal();
      openRoleSelectionModal();
    }

    function loadStudentProfile() {
      try {
        const saved = localStorage.getItem(getStudentStorageKey());
        if (saved) {
          const parsed = JSON.parse(saved);
          currentStudent = { ...currentStudent, ...parsed };
        }
      } catch (e) {
        console.warn("Could not load student profile", e);
      }

      try {
        const savedClass = localStorage.getItem(getClassroomStorageKey());
        if (savedClass) {
          classroomStudents = JSON.parse(savedClass) || {};
        }
      } catch (e) {
        console.warn("Could not load classroom cache", e);
      }

      // Check URL parameters for explicit role
      const urlParams = new URLSearchParams(window.location.search);
      const urlRole = urlParams.get('role');
      const urlTrainer = urlParams.get('trainer');
      const urlPin = urlParams.get('pin');

      if (urlRole === 'trainer' || urlTrainer === 'true' || urlTrainer === '1' || urlPin === '1926') {
        enableTrainerMode();
        closeRoleSelectionModal();
        return;
      }

      // Check saved role in localStorage
      const savedRole = localStorage.getItem(getRoleStorageKey());
      if (savedRole === 'trainer' && isTrainerMode) {
        closeRoleSelectionModal();
      } else if (savedRole === 'student' && currentStudent.name && currentStudent.id) {
        closeRoleSelectionModal();
        applyStudentProfileUI();
        registerStudentInClassroom(currentStudent);
        broadcastStudentCheckin();
      } else {
        // FIRST TIME ACCESS: SHOW ROLE SELECTION COVER!
        openRoleSelectionModal();
      }
    }

    function saveStudentProfile() {
      try {
        localStorage.setItem(getStudentStorageKey(), JSON.stringify(currentStudent));
      } catch (e) {}
    }

    function logoutStudentProfile() {
      const confirmMsg = currentLang === 'it' 
        ? "Sei sicuro di voler effettuare il LOGOUT? Il tuo profilo studente locale verrà resettato e potrai inserire un nuovo nome e riassegnare la squadra."
        : "Are you sure you want to LOG OUT? Your local student profile will be reset, allowing you to enter a new name and get reassigned to a team.";
      
      if (!confirm(confirmMsg)) return;

      // Broadcast student_logout to the classroom so Trainer records logged-out status while preserving score
      if (currentStudent && currentStudent.id) {
        publishBroadcast({
          action: 'student_logout',
          studentId: currentStudent.id,
          name: currentStudent.name,
          teamKey: currentStudent.teamKey,
          score: currentStudent.score || 0,
          completedChallenges: currentStudent.completedChallenges || {}
        });
      }

      try {
        localStorage.removeItem(getStudentStorageKey());
        localStorage.removeItem(getRoleStorageKey());
      } catch (e) {}

      // Disable Google auto-select if GIS is present
      if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
        try {
          google.accounts.id.disableAutoSelect();
        } catch (e) {}
      }

      // Reset in-memory student object
      currentStudent = {
        id: '',
        name: '',
        email: '',
        picture: '',
        googleSub: '',
        teamKey: '',
        score: 0,
        completedChallenges: {}
      };

      // Reset challenge badges and score display
      setText('student-display-name', 'Detective');
      setText('student-display-team', 'Team Ray-Ban');
      setText('student-display-score', '0');
      setText('menu-student-name', 'Detective');
      setText('menu-student-team', 'Team Ray-Ban');
      setText('popover-profile-name', 'Detective');
      setText('popover-profile-team', 'Team Ray-Ban');

      // Reset avatars
      const avatarIcon = document.getElementById('student-avatar-icon');
      const avatarImg = document.getElementById('student-avatar-img');
      const popoverImg = document.getElementById('popover-avatar-img');
      const popoverEmail = document.getElementById('popover-profile-email');
      if (avatarIcon) avatarIcon.classList.remove('hidden');
      if (avatarImg) { avatarImg.src = ''; avatarImg.classList.add('hidden'); }
      if (popoverImg) { popoverImg.src = ''; popoverImg.classList.add('hidden'); }
      if (popoverEmail) { popoverEmail.textContent = ''; popoverEmail.classList.add('hidden'); }

      // Clear input fields
      const input = document.getElementById('student-input-name');
      if (input) input.value = '';

      showToast(currentLang === 'it' ? "👋 Logout completato!" : "👋 Logged out successfully!");

      // Open Role Selection Modal immediately
      openRoleSelectionModal();
    }

    function saveClassroomState() {
      try {
        localStorage.setItem(getClassroomStorageKey(), JSON.stringify(classroomStudents));
      } catch (e) {}
    }

    function openOnboardingModal(allowEdit = false) {
      const modal = document.getElementById('student-onboarding-modal');
      const input = document.getElementById('student-input-name');
      const preview = document.getElementById('ob-team-preview');
      if (!modal) return;

      if (!allowEdit) {
        // Reset draft team for fresh student onboarding so balanced randomizer always triggers
        currentStudent.teamKey = '';
      }

      if (input) {
        input.value = currentStudent.name || '';
      }
      if (allowEdit && currentStudent.teamKey) {
        const tObj = TEAMS.find(t => t.key === currentStudent.teamKey) || TEAMS[0];
        if (preview && tObj) {
          preview.classList.remove('hidden');
          setText('ob-team-badge', `${tObj.icon} ${tObj.name}`);
          setText('ob-team-desc', tObj.desc);
        }
      } else if (preview) {
        preview.classList.add('hidden');
      }

      renderGoogleSignInButton();
      showModalDialog('student-onboarding-modal');
      if (input) setTimeout(() => input.focus(), 100);
    }

    function rerollStudentTeam() {
      const otherTeams = TEAMS.filter(t => t.key !== currentStudent.teamKey);
      const picked = otherTeams[Math.floor(Math.random() * otherTeams.length)] || TEAMS[0];
      currentStudent.teamKey = picked.key;
      const preview = document.getElementById('ob-team-preview');
      if (preview) {
        preview.classList.remove('hidden');
        setText('ob-team-badge', `${picked.icon} ${picked.name}`);
        setText('ob-team-desc', picked.desc);
      }
      showToast(currentLang === 'it' ? `🎲 Nuova squadra assegnata: ${picked.name}!` : `🎲 New team assigned: ${picked.name}!`);
    }

    function closeOnboardingModal() {
      closeModalDialog('student-onboarding-modal');
    }

    function openResumeStudentModal() {
      closeOnboardingModal();
      const modal = document.getElementById('student-resume-modal');
      const select = document.getElementById('resume-select-student');
      const pinInput = document.getElementById('resume-input-pin');
      const errEl = document.getElementById('resume-error-msg');
      if (errEl) errEl.classList.add('hidden');
      if (pinInput) pinInput.value = '';

      if (select) {
        // Populate select with students currently registered in classroom
        const students = Object.values(classroomStudents);
        select.innerHTML = '<option value="">-- Seleziona il tuo nome --</option>' +
          students.map(s => {
            const tObj = TEAMS.find(t => t.key === s.teamKey) || TEAMS[0];
            return `<option value="${s.id}">${s.name} (${tObj.name.replace('Team ', '')} - ${s.score || 0} pt${s.loggedOut ? ' - Logout' : ''})</option>`;
          }).join('');
      }

      showModalDialog('student-resume-modal');
    }

    function closeResumeStudentModal() {
      closeModalDialog('student-resume-modal');
      openOnboardingModal(false);
    }

    function submitStudentResume() {
      const select = document.getElementById('resume-select-student');
      const pinInput = document.getElementById('resume-input-pin');
      const errEl = document.getElementById('resume-error-msg');
      if (errEl) errEl.classList.add('hidden');

      const studentId = select ? select.value : '';
      const enteredPin = (pinInput ? pinInput.value : '').trim();

      if (!studentId) {
        showToast(currentLang === 'it' ? "Seleziona il tuo nome dall'elenco!" : "Select your name from the list!");
        return;
      }

      const expectedPin = getStudentRecoveryPin(studentId);
      if (enteredPin !== expectedPin) {
        if (errEl) errEl.classList.remove('hidden');
        if (pinInput) {
          pinInput.classList.add('ring-2', 'ring-red-500');
          setTimeout(() => pinInput.classList.remove('ring-2', 'ring-red-500'), 1500);
        }
        return;
      }

      // PIN MATCHED! Restore student session
      const target = classroomStudents[studentId];
      if (!target) {
        showToast("Profilo non trovato!");
        return;
      }

      currentStudent = {
        id: target.id,
        name: target.name,
        teamKey: target.teamKey,
        score: target.score || 0,
        completedChallenges: { ...(target.completedChallenges || {}) }
      };

      try {
        localStorage.setItem(getRoleStorageKey(), 'student');
      } catch (e) {}

      saveStudentProfile();
      applyStudentProfileUI();
      registerStudentInClassroom(currentStudent);

      // Broadcast student_resume so trainer console sees student back online
      publishBroadcast({
        action: 'student_resume',
        targetStudentId: target.id
      });
      broadcastStudentCheckin();

      closeModalDialog('student-resume-modal');

      showToast(currentLang === 'it' 
        ? `🎉 Bentornato/a ${target.name}! Profilo e ${target.score || 0} punti ripristinati con successo!` 
        : `🎉 Welcome back ${target.name}! Profile and ${target.score || 0} points restored!`);
    }

    function sanitizeForSql(name) {
      return (name || 'student')
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, "") // remove accents
        .replace(/[^a-z0-9_]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '') || 'student';
    }

    function submitStudentOnboarding() {
      const input = document.getElementById('student-input-name');
      const name = (input ? input.value : '').trim();
      if (!name) {
        if (input) {
          input.classList.add('ring-2', 'ring-red-500', 'bg-red-50');
          setTimeout(() => input.classList.remove('ring-2', 'ring-red-500', 'bg-red-50'), 1500);
        }
        showToast(currentLang === 'it' ? "Inserisci il tuo nome per iniziare!" : "Please enter your name to start!");
        return;
      }

      currentStudent.name = name;
      const isNewStudent = !currentStudent.id || !currentStudent.teamKey;
      if (!currentStudent.id) {
        const randHex = Math.random().toString(36).substring(2, 6);
        currentStudent.id = `${sanitizeForSql(name)}_${randHex}`;
      }

      // 1) BALANCED / RANDOM TEAM SELECTION
      if (isNewStudent) {
        // Count active students per team across classroom to ensure balanced distribution
        const teamCounts = { rayban: 0, oakley: 0, persol: 0, oliver: 0 };
        Object.values(classroomStudents).forEach(s => {
          if (s.teamKey && teamCounts[s.teamKey] !== undefined) {
            teamCounts[s.teamKey]++;
          }
        });
        // Find team(s) with minimum members
        const minCount = Math.min(...Object.values(teamCounts));
        const leastPopulatedTeams = TEAMS.filter(t => teamCounts[t.key] === minCount);
        // Randomly pick among least populated teams
        const pickedTeam = leastPopulatedTeams[Math.floor(Math.random() * leastPopulatedTeams.length)] || TEAMS[Math.floor(Math.random() * TEAMS.length)];
        currentStudent.teamKey = pickedTeam.key;
      }

      saveStudentProfile();
      applyStudentProfileUI();
      registerStudentInClassroom(currentStudent);
      broadcastStudentCheckin();
      closeOnboardingModal();

      const tObj = TEAMS.find(t => t.key === currentStudent.teamKey);
      showToast(currentLang === 'it' 
        ? `🎉 Benvenuto ${name}! Assegnato a ${tObj ? tObj.name : 'Team'}!` 
        : `🎉 Welcome ${name}! Assigned to ${tObj ? tObj.name : 'Team'}!`);
    }

    function decodeJwtResponse(token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
      } catch (e) {
        console.error("Error decoding JWT:", e);
        return null;
      }
    }

    function handleGoogleSignInCallback(response) {
      if (!response || !response.credential) return;
      const payload = decodeJwtResponse(response.credential);
      if (!payload) return;

      const name = payload.name || payload.given_name || 'Detective';
      currentStudent.name = name;
      currentStudent.email = payload.email || '';
      currentStudent.picture = payload.picture || '';
      currentStudent.googleSub = payload.sub || '';

      const isNewStudent = !currentStudent.id || !currentStudent.teamKey;
      if (!currentStudent.id) {
        const subSuffix = (payload.sub || Math.random().toString(36).substring(2, 8)).substring(0, 6);
        currentStudent.id = `${sanitizeForSql(name)}_${subSuffix}`;
      }

      if (isNewStudent) {
        const teamCounts = { rayban: 0, oakley: 0, persol: 0, oliver: 0 };
        Object.values(classroomStudents).forEach(s => {
          if (s.teamKey && teamCounts[s.teamKey] !== undefined) {
            teamCounts[s.teamKey]++;
          }
        });
        const minCount = Math.min(...Object.values(teamCounts));
        const leastPopulatedTeams = TEAMS.filter(t => teamCounts[t.key] === minCount);
        const pickedTeam = leastPopulatedTeams[Math.floor(Math.random() * leastPopulatedTeams.length)] || TEAMS[Math.floor(Math.random() * TEAMS.length)];
        currentStudent.teamKey = pickedTeam.key;
      }

      saveStudentProfile();
      applyStudentProfileUI();
      registerStudentInClassroom(currentStudent);
      broadcastStudentCheckin();
      closeOnboardingModal();

      const tObj = TEAMS.find(t => t.key === currentStudent.teamKey);
      showToast(currentLang === 'it' 
        ? `🎉 Benvenuto ${name}! Connesso con Google a ${tObj ? tObj.name : 'Team'}!` 
        : `🎉 Welcome ${name}! Connected with Google to ${tObj ? tObj.name : 'Team'}!`);
    }

    function initGoogleAuth(clientId) {
      if (!clientId) return;
      googleClientId = clientId;

      const checkGoogleScript = () => {
        if (window.google && window.google.accounts && window.google.accounts.id) {
          try {
            google.accounts.id.initialize({
              client_id: clientId,
              callback: handleGoogleSignInCallback,
              auto_select: false
            });
            renderGoogleSignInButton();
          } catch (err) {
            console.warn("Google Identity Services init error:", err);
          }
        } else {
          setTimeout(checkGoogleScript, 200);
        }
      };
      checkGoogleScript();
    }

    function renderGoogleSignInButton() {
      const container = document.getElementById('g-signin-btn');
      const wrapper = document.getElementById('g-signin-wrapper');
      if (wrapper && googleClientId) {
        wrapper.classList.remove('hidden');
      }
      if (container && window.google && window.google.accounts && window.google.accounts.id && googleClientId) {
        try {
          container.innerHTML = '';
          google.accounts.id.renderButton(container, {
            theme: 'outline',
            size: 'large',
            shape: 'pill',
            text: 'continue_with',
            width: 280
          });
        } catch (e) {
          console.warn("renderButton error:", e);
        }
      }
    }

    function applyStudentProfileUI() {
      const tObj = TEAMS.find(t => t.key === currentStudent.teamKey) || TEAMS[0];
      setText('student-display-name', currentStudent.name || 'Detective');
      setText('student-display-team', tObj.name);
      setText('student-display-score', String(currentStudent.score || 0));
      setText('menu-student-name', currentStudent.name || 'Detective');
      setText('menu-student-team', tObj.name);
      setText('popover-profile-name', currentStudent.name || 'Detective');
      setText('popover-profile-team', tObj.name);

      // Handle Avatar and Email
      const avatarIcon = document.getElementById('student-avatar-icon');
      const avatarImg = document.getElementById('student-avatar-img');
      const popoverImg = document.getElementById('popover-avatar-img');
      const popoverEmail = document.getElementById('popover-profile-email');

      if (currentStudent.picture) {
        if (avatarIcon) avatarIcon.classList.add('hidden');
        if (avatarImg) {
          avatarImg.src = currentStudent.picture;
          avatarImg.classList.remove('hidden');
        }
        if (popoverImg) {
          popoverImg.src = currentStudent.picture;
          popoverImg.classList.remove('hidden');
        }
      } else {
        if (avatarIcon) avatarIcon.classList.remove('hidden');
        if (avatarImg) { avatarImg.src = ''; avatarImg.classList.add('hidden'); }
        if (popoverImg) { popoverImg.src = ''; popoverImg.classList.add('hidden'); }
      }

      if (popoverEmail) {
        if (currentStudent.email) {
          popoverEmail.textContent = currentStudent.email;
          popoverEmail.classList.remove('hidden');
        } else {
          popoverEmail.textContent = '';
          popoverEmail.classList.add('hidden');
        }
      }

      // DYNAMIC VIEW NAME WITH STUDENT NAME + TEAM
      const cleanName = sanitizeForSql(currentStudent.name);
      const studentViewSuffix = `v_clean_marketing_leads_${tObj.key}_${cleanName}`;
      setText('suffix-example', studentViewSuffix);

      if (currentLang === 'it') {
        setText('prompt-view-text', `Crea la vista luxottica_marketing_analytics.${studentViewSuffix} prendendo da lux_raw_marketing_leads_dirty: pulisci email con LOWER e TRIM, estrai brand e converti spesa in numero, filtrando lead VIP con spesa > 200 euro.`);
      } else {
        setText('prompt-view-text', `Create view luxottica_marketing_analytics.${studentViewSuffix} taking from lux_raw_marketing_leads_dirty: clean emails with LOWER and TRIM, extract brand and convert spend to number, filtering VIP leads with spend > 200 euros.`);
      }

      // Update quiz cards completion state
      renderQuizStatus('ch0', currentStudent.completedChallenges && currentStudent.completedChallenges.ch0);
      renderQuizStatus('ch1', currentStudent.completedChallenges && currentStudent.completedChallenges.ch1);
      renderQuizStatus('ch2', currentStudent.completedChallenges && currentStudent.completedChallenges.ch2);
      renderQuizStatus('ch3', currentStudent.completedChallenges && currentStudent.completedChallenges.ch3);
      if (typeof updateCoffeeBadgesUI === 'function') {
        updateCoffeeBadgesUI();
      }
      renderSidebarTeamLeaderboard();
      refreshTrainerStudents();
    }

    function renderQuizStatus(chKey, isCompleted) {
      const card = document.getElementById(`quiz-card-${chKey}`);
      const btn = document.getElementById(`btn-validate-${chKey}`);
      const feedback = document.getElementById(`quiz-feedback-${chKey}`);
      const badge = document.getElementById(`quiz-badge-${chKey}`);

      const pointsMap = { ch0: '+50 pt in palio', ch1: '+100 pt in palio', ch2: '+100 pt in palio', ch3: '+100 pt in palio' };
      const defaultFeedbackMap = {
        ch0: currentLang === 'it' ? "Guadagna i primi 50 punti per te e per la tua squadra!" : "Earn the first 50 points for you and your team!",
        ch1: currentLang === 'it' ? "Rispondi per sbloccare i punti per te e per la squadra" : "Submit answers to unlock points for your team",
        ch2: currentLang === 'it' ? "Dimostra al CMO il rendimento delle campagne adv" : "Prove campaign ROAS performance to the CMO",
        ch3: currentLang === 'it' ? "Verifica la qualità del tuo dataset per Google Ads Customer Match" : "Verify dataset quality for Google Ads Customer Match"
      };

      if (isCompleted) {
        if (card) {
          card.classList.remove('from-slate-900', 'to-slate-950', 'border-slate-800');
          card.classList.add('from-emerald-950', 'to-slate-900', 'border-emerald-700/60');
        }
        if (btn) {
          btn.disabled = true;
          btn.className = "px-5 py-2 rounded-xl font-bold text-xs bg-emerald-600 text-white opacity-90 cursor-default flex items-center space-x-1.5 shadow-xs";
          btn.innerHTML = currentLang === 'it' ? "<span>Completata ✅</span>" : "<span>Completed ✅</span>";
        }
        if (badge) {
          badge.className = "text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40";
          badge.innerText = currentLang === 'it' ? "✅ Punti Assegnati" : "✅ Points Awarded";
        }
        if (feedback) {
          feedback.className = "text-xs font-bold text-emerald-400";
          feedback.innerText = currentLang === 'it' ? "🎉 Sfida superata con successo! Punti registrati." : "🎉 Challenge passed! Points awarded.";
        }
      } else {
        // Reset to initial playable state
        if (card) {
          card.classList.remove('from-emerald-950', 'to-slate-900', 'border-emerald-700/60');
          card.classList.add('from-slate-900', 'to-slate-950', 'border-slate-800');
        }
        if (btn) {
          btn.disabled = false;
          if (chKey === 'ch0') {
            btn.className = "px-5 py-2 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white transition shadow-md cursor-pointer flex items-center space-x-1.5";
          } else {
            btn.className = "px-5 py-2 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 transition shadow-md cursor-pointer flex items-center space-x-1.5";
          }
          btn.innerHTML = currentLang === 'it' ? `<span id="btn-validate-${chKey}-text">Invia Risposte 🚀</span>` : `<span id="btn-validate-${chKey}-text">Submit Answers 🚀</span>`;
        }
        if (badge) {
          if (chKey === 'ch0') {
            badge.className = "text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30";
          } else {
            badge.className = "text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30";
          }
          badge.innerText = pointsMap[chKey] || '+100 pt in palio';
        }
        if (feedback) {
          feedback.className = "text-xs font-medium text-slate-400";
          feedback.innerText = defaultFeedbackMap[chKey] || '';
        }
      }
    }

    function getStudentRecoveryPin(studentId) {
      if (!studentId) return '1111';
      // Deterministic 4-digit PIN based on studentId
      let hash = 0;
      for (let i = 0; i < studentId.length; i++) {
        hash = ((hash << 5) - hash) + studentId.charCodeAt(i);
        hash |= 0;
      }
      const positive = Math.abs(hash);
      const pin = 1000 + (positive % 9000);
      return String(pin);
    }

    function registerStudentInClassroom(student) {
      if (!student.id) return;
      classroomStudents[student.id] = {
        id: student.id,
        name: student.name,
        teamKey: student.teamKey,
        score: student.score || 0,
        completedChallenges: { ...(student.completedChallenges || {}) },
        loggedOut: false,
        recoveryPin: getStudentRecoveryPin(student.id),
        lastActive: Date.now()
      };
      saveClassroomState();
      renderSidebarTeamLeaderboard();
      refreshTrainerStudents();
      renderClassroomLeaderboard();
    }

    // HANDLE AUTHORITATIVE CLASSROOM STATE SYNC (FOR STUDENTS)
    function handleRemoteClassroomStateSync(payload) {
      if (!payload) return;

      // 1) Set block immediately
      if (payload.block) {
        showBlock(payload.block, true);
      }

      // 2) Set lock state
      if (typeof payload.locked === 'boolean') {
        applyLockState(payload.locked);
      }

      // 3) Apply unlocked hints silently without noisy toasts
      if (Array.isArray(payload.unlockedHints)) {
        payload.unlockedHints.forEach(hintId => {
          const lockState = document.getElementById("lock-state-" + hintId);
          const content = document.getElementById("content-" + hintId);
          if (lockState) lockState.classList.add('hidden');
          if (content) content.classList.remove('hidden');
        });
        updateTrainerHintUI();
      }

      // 4) Apply student docs state
      if (typeof payload.studentDocsUnlocked === 'boolean') {
        applyRemoteStudentDocs(payload.studentDocsUnlocked);
      }

      console.log("[Classroom Sync] Synchronized to block:", payload.block);
    }

    // STUDENT ASKS THE TRAINER FOR CURRENT CLASSROOM STATE (LATE-JOINER HANDSHAKE)
    function requestClassroomSync() {
      if (isTrainerMode) return;
      publishBroadcast({
        action: 'request_classroom_sync',
        studentId: (currentStudent ? currentStudent.id : null),
        t: Date.now()
      });
    }


    function handleRemoteStudentLogout(payload) {
      const studentId = payload.studentId || payload.id;
      if (!studentId) return;

      if (classroomStudents[studentId]) {
        classroomStudents[studentId].loggedOut = true;
        if (payload.score !== undefined) {
          classroomStudents[studentId].score = payload.score;
        }
        if (payload.completedChallenges) {
          classroomStudents[studentId].completedChallenges = payload.completedChallenges;
        }
        classroomStudents[studentId].recoveryPin = classroomStudents[studentId].recoveryPin || getStudentRecoveryPin(studentId);
        classroomStudents[studentId].lastActive = Date.now();
      } else if (payload.name) {
        // Even if not seen previously, register as logged-out student with final score
        classroomStudents[studentId] = {
          id: studentId,
          name: payload.name,
          teamKey: payload.teamKey,
          score: payload.score || 0,
          completedChallenges: payload.completedChallenges || {},
          loggedOut: true,
          recoveryPin: getStudentRecoveryPin(studentId),
          lastActive: Date.now()
        };
      }
      saveClassroomState();
      renderSidebarTeamLeaderboard();
      refreshTrainerStudents();
    }

    function handleRemoteStudentKick(payload) {
      const targetId = payload.targetStudentId;
      if (!targetId) return;

      // 1) If this browser IS the target student, force logout
      if (currentStudent && currentStudent.id === targetId) {
        try {
          localStorage.removeItem(getStudentStorageKey());
          localStorage.removeItem(getRoleStorageKey());
        } catch (e) {}
        currentStudent = { id: '', name: '', teamKey: '', score: 0, completedChallenges: {} };
        setText('student-display-name', 'Detective');
        setText('student-display-team', 'Team Ray-Ban');
        setText('student-display-score', '0');
        alert(currentLang === 'it' 
          ? (payload.permanent 
              ? "🗑️ Il tuo profilo è stato eliminato dal docente. Puoi registrarti nuovamente." 
              : "⚠️ Sei stato disconnesso dal docente. Puoi rientrare o recuperare la tua sessione con il PIN.")
          : (payload.permanent
              ? "🗑️ Your profile was deleted by the trainer. You may register afresh."
              : "⚠️ You were logged out by the trainer. You may re-enter or recover your session with a PIN."));
        openRoleSelectionModal();
      }

      // 2) Update local classroom state
      if (payload.permanent) {
        delete classroomStudents[targetId];
      } else if (classroomStudents[targetId]) {
        classroomStudents[targetId].loggedOut = true;
        classroomStudents[targetId].recoveryPin = classroomStudents[targetId].recoveryPin || getStudentRecoveryPin(targetId);
      }
      saveClassroomState();
      renderSidebarTeamLeaderboard();
      refreshTrainerStudents();
    }

    function handleRemoteStudentReset(payload) {
      const targetId = payload.targetStudentId;
      if (!targetId) return;

      // 1) If this browser IS the target student, reset score and quiz cards in real time
      if (currentStudent && currentStudent.id === targetId) {
        currentStudent.score = 0;
        currentStudent.completedChallenges = {};
        saveStudentProfile();
        applyStudentProfileUI();
        showToast(currentLang === 'it' 
          ? "🔄 Il docente ha azzerato il tuo punteggio e le tue sfide. Puoi ricominciare!" 
          : "🔄 The trainer reset your score and challenges. You can start over!");
      }

      // 2) Update classroom cache
      if (classroomStudents[targetId]) {
        classroomStudents[targetId].score = 0;
        classroomStudents[targetId].completedChallenges = {};
        classroomStudents[targetId].lastActive = Date.now();
      }
      saveClassroomState();
      renderSidebarTeamLeaderboard();
      refreshTrainerStudents();
    }

    function handleRemoteStudentResume(payload) {
      const targetId = payload.targetStudentId;
      if (!targetId) return;
      if (classroomStudents[targetId]) {
        classroomStudents[targetId].loggedOut = false;
        classroomStudents[targetId].lastActive = Date.now();
      }
      saveClassroomState();
      renderSidebarTeamLeaderboard();
      refreshTrainerStudents();
    }

    function broadcastStudentCheckin(jitterMs = 0) {
      if (!currentStudent.id) return;
      const send = () => {
        publishBroadcast({
          action: 'student_checkin',
          student: currentStudent
        });
      };

      if (jitterMs > 0) {
        setTimeout(send, jitterMs);
      } else {
        send();
      }
      // Handshake: request current active block and lock status from trainer
      setTimeout(requestClassroomSync, 300);
    }

    function broadcastScoreUpdate(challengeKey, pointsEarned) {
      if (!currentStudent.id) return;
      publishBroadcast({
        action: 'score_update',
        studentId: currentStudent.id,
        name: currentStudent.name,
        teamKey: currentStudent.teamKey,
        score: currentStudent.score,
        completedChallenges: currentStudent.completedChallenges,
        challengeKey: challengeKey,
        pointsEarned: pointsEarned
      });
    }

    function handleRemoteStudentUpdate(payload) {
      const s = payload.student || payload;
      if (!s || !s.id) return;
      registerStudentInClassroom(s);
    }

    function handleTrainerScoreOverride(payload) {
      if (payload.targetStudentId === currentStudent.id) {
        currentStudent.score = Math.max(0, (currentStudent.score || 0) + payload.delta);
        saveStudentProfile();
        applyStudentProfileUI();
        showToast(currentLang === 'it' 
          ? `🎓 Il docente ti ha assegnato un bonus: ${payload.delta > 0 ? '+' : ''}${payload.delta} pt!` 
          : `🎓 Trainer assigned a bonus: ${payload.delta > 0 ? '+' : ''}${payload.delta} pts!`);
      }
      if (classroomStudents[payload.targetStudentId]) {
        classroomStudents[payload.targetStudentId].score = Math.max(0, (classroomStudents[payload.targetStudentId].score || 0) + payload.delta);
        saveClassroomState();
        renderSidebarTeamLeaderboard();
        refreshTrainerStudents();
      }
    }

    function handleRemoteResetScores() {
      currentStudent.score = 0;
      currentStudent.completedChallenges = { ch0: false, ch1: false, ch2: false, ch3: false };
      classroomStudents = {};
      saveStudentProfile();
      saveClassroomState();

      // Clear input fields in quiz cards
      ['quiz-ch0-q1', 'quiz-ch0-q2', 'quiz-ch1-q1', 'quiz-ch1-q2', 'quiz-ch2-q1', 'quiz-ch2-q2', 'quiz-ch3-q1', 'quiz-ch3-q2'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });

      applyStudentProfileUI();
      renderClassroomLeaderboard();
      showToast(currentLang === 'it' ? "🔄 La sessione del workshop è stata azzerata dal docente" : "🔄 Workshop scores reset by trainer");
    }

    // FUZZY NUMERIC EXTRACTOR TO RESIST "352", "352 leads", "circa 352", ETC.
    function extractNumericValue(rawStr) {
      if (rawStr === null || rawStr === undefined) return null;
      let cleaned = String(rawStr)
        .trim()
        .toLowerCase()
        .replace(/,/g, '.')
        .replace(/[^0-9.]/g, ''); // strip non-numeric except dot
      if (!cleaned) return null;
      const num = parseFloat(cleaned);
      return isNaN(num) ? null : num;
    }

    // ==========================================
    // CHALLENGE VALIDATION FUNCTIONS
    // ==========================================
    function validateChallenge0() {
      if (currentStudent.completedChallenges && currentStudent.completedChallenges.ch0) return;

      const q1 = (document.getElementById('quiz-ch0-q1')?.value || '').trim();
      const q2 = (document.getElementById('quiz-ch0-q2')?.value || '').trim();
      const feedback = document.getElementById('quiz-feedback-ch0');

      // Q1: Brand with highest overall sales -> Ray-Ban (also allow Oliver Peoples for dataset variance)
      // Q2: Tables count -> 4
      const isQ1Correct = (q1 === 'Ray-Ban' || q1 === 'Oliver Peoples');
      const isQ2Correct = (q2 === '4');

      if (isQ1Correct && isQ2Correct) {
        if (!currentStudent.completedChallenges) currentStudent.completedChallenges = {};
        currentStudent.completedChallenges.ch0 = true;
        currentStudent.score = (currentStudent.score || 0) + 50;
        saveStudentProfile();
        applyStudentProfileUI();
        registerStudentInClassroom(currentStudent);
        broadcastScoreUpdate('ch0', 50);
        showToast(currentLang === 'it' ? "🎯 Warm-Up Convalidato! +50 Punti!" : "🎯 Warm-Up Validated! +50 Points!");
      } else {
        if (feedback) {
          feedback.className = "text-xs font-bold text-red-400";
          if (!isQ1Correct && !isQ2Correct) {
            feedback.innerText = currentLang === 'it' ? "❌ Rivedi il grafico in Data Canvas e conta le tabelle nell'Explorer!" : "❌ Check the Data Canvas chart and table count!";
          } else if (!isQ1Correct) {
            feedback.innerText = currentLang === 'it' ? "❌ Brand errato: cerca il brand leader per vendite complessive (Ray-Ban)" : "❌ Wrong brand: search the leader brand by overall sales (Ray-Ban)";
          } else {
            feedback.innerText = currentLang === 'it' ? "❌ Ricorda: le tabelle nel dataset sono 4 (Orders, Spend, CRM, Leads)" : "❌ Remember: there are 4 tables in the dataset";
          }
        }
      }
    }

    function validateChallenge1() {
      if (currentStudent.completedChallenges && currentStudent.completedChallenges.ch1) return;

      const q1 = (document.getElementById('quiz-ch1-q1')?.value || '').trim();
      const q2Raw = document.getElementById('quiz-ch1-q2')?.value || '';
      const feedback = document.getElementById('quiz-feedback-ch1');
      const q2Num = extractNumericValue(q2Raw);

      // Q1: Brand with highest AOV -> Oliver Peoples
      // Q2: Wholesale Vogue discount -> 28.50 (accept 28 to 29)
      const isQ1Correct = (q1 === 'Oliver Peoples');
      const isQ2Correct = (q2Num !== null && q2Num >= 28.0 && q2Num <= 29.0);

      if (isQ1Correct && isQ2Correct) {
        currentStudent.completedChallenges.ch1 = true;
        currentStudent.score = (currentStudent.score || 0) + 100;
        saveStudentProfile();
        applyStudentProfileUI();
        registerStudentInClassroom(currentStudent);
        broadcastScoreUpdate('ch1', 100);
        showToast(currentLang === 'it' ? "🎉 Sfida #1 Convalidata! +100 Punti!" : "🎉 Challenge #1 Validated! +100 Points!");
      } else {
        if (feedback) {
          feedback.className = "text-xs font-bold text-red-400";
          if (!isQ1Correct && !isQ2Correct) {
            feedback.innerText = currentLang === 'it' ? "❌ Entrambe le risposte non tornano. Rivedi la query in BigQuery!" : "❌ Both answers are incorrect. Review your SQL query!";
          } else if (!isQ1Correct) {
            feedback.innerText = currentLang === 'it' ? "❌ Verifica quale brand ha l'AOV più alto (> 300€)" : "❌ Check which brand has the highest AOV (> €300)";
          } else {
            feedback.innerText = currentLang === 'it' ? "❌ Lo sconto medio di Vogue wholesale non corrisponde al risultato della query" : "❌ Wholesale Vogue discount does not match your query calculation";
          }
        }
      }
    }

    function validateChallenge2() {
      if (currentStudent.completedChallenges.ch2) return;

      const q1 = (document.getElementById('quiz-ch2-q1')?.value || '').trim();
      const q2Raw = document.getElementById('quiz-ch2-q2')?.value || '';
      const feedback = document.getElementById('quiz-feedback-ch2');
      const q2Num = extractNumericValue(q2Raw);

      // Q1: Channel with worst ROAS -> TikTok Ads
      // Q2: Google Ads ROAS -> 7.08 (accept 7.0 to 7.15)
      const isQ1Correct = (q1 === 'TikTok Ads');
      const isQ2Correct = (q2Num !== null && q2Num >= 7.0 && q2Num <= 7.15);

      if (isQ1Correct && isQ2Correct) {
        currentStudent.completedChallenges.ch2 = true;
        currentStudent.score = (currentStudent.score || 0) + 100;
        saveStudentProfile();
        applyStudentProfileUI();
        registerStudentInClassroom(currentStudent);
        broadcastScoreUpdate('ch2', 100);
        showToast(currentLang === 'it' ? "🚀 Sfida #2 Convalidata! +100 Punti!" : "🚀 Challenge #2 Validated! +100 Points!");
      } else {
        if (feedback) {
          feedback.className = "text-xs font-bold text-red-400";
          if (!isQ1Correct && !isQ2Correct) {
            feedback.innerText = currentLang === 'it' ? "❌ Valori non corretti. Ricontrolla i risultati della query con CTE!" : "❌ Incorrect values. Check your CTE query results!";
          } else if (!isQ1Correct) {
            feedback.innerText = currentLang === 'it' ? "❌ Canale pubblicitario errato: cerca quello con ROAS < 1.0x" : "❌ Wrong ad channel: search the one with ROAS < 1.0x";
          } else {
            feedback.innerText = currentLang === 'it' ? "❌ Il valore di ROAS per Google Ads non corrisponde al risultato della query" : "❌ The ROAS value for Google Ads does not match your query calculation";
          }
        }
      }
    }

    function validateChallenge3() {
      if (currentStudent.completedChallenges.ch3) return;

      // Optional v2 Cloud Backend validation for view creation
      if (window.hubClient) {
        const studentViewName = `v_clean_marketing_leads_${currentStudent.teamKey || "team"}`;
        window.hubClient.validateChallenge("b4", null, studentViewName).then(res => {
          if (res && res.success) {
            console.log("[HubClient v2] BigQuery View automatically verified by Cloud backend:", res);
          }
        }).catch(() => {});
      }

      const q1Raw = document.getElementById('quiz-ch3-q1')?.value || '';
      const q2 = (document.getElementById('quiz-ch3-q2')?.value || '').trim();
      const feedback = document.getElementById('quiz-feedback-ch3');
      const q1Num = extractNumericValue(q1Raw);

      // Q1: Count of VIP leads -> 350 to 355
      // Q2: SQL function -> TRIM
      const isQ1Correct = (q1Num !== null && q1Num >= 345 && q1Num <= 360);
      const isQ2Correct = (q2 === 'TRIM');

      if (isQ1Correct && isQ2Correct) {
        currentStudent.completedChallenges.ch3 = true;
        currentStudent.score = (currentStudent.score || 0) + 100;
        saveStudentProfile();
        applyStudentProfileUI();
        registerStudentInClassroom(currentStudent);
        broadcastScoreUpdate('ch3', 100);
        showToast(currentLang === 'it' ? "🏆 Sfida #3 Convalidata! Vista Pulita Creata (+100 Punti)!" : "🏆 Challenge #3 Validated! Clean View Created (+100 Points)!");
      } else {
        if (feedback) {
          feedback.className = "text-xs font-bold text-red-400";
          if (!isQ1Correct && !isQ2Correct) {
            feedback.innerText = currentLang === 'it' ? "❌ Rivedi il conteggio dei lead nella vista creata e la funzione SQL!" : "❌ Review the lead count in the created view and the SQL function!";
          } else if (!isQ1Correct) {
            feedback.innerText = currentLang === 'it' ? "❌ Il conteggio dei lead VIP non corrisponde al totale di righe della vista creata" : "❌ VIP lead count does not match the total rows in your created view";
          } else {
            feedback.innerText = currentLang === 'it' ? "❌ La funzione corretta per rimuovere spazi è TRIM()" : "❌ The correct function to remove whitespace is TRIM()";
          }
        }
      }
    }

    // ==========================================
    // LEADERBOARD RENDERING
    // ==========================================
    function calculateTeamScores() {
      const teamTotals = {
        rayban: { total: 0, count: 0 },
        oakley: { total: 0, count: 0 },
        persol: { total: 0, count: 0 },
        oliver: { total: 0, count: 0 }
      };

      // Aggregate all active students
      Object.values(classroomStudents).forEach(s => {
        if (teamTotals[s.teamKey]) {
          teamTotals[s.teamKey].total += (s.score || 0);
          teamTotals[s.teamKey].count += 1;
        }
      });

      // Default baseline points so scoreboard looks lively even with 1 user
      const baselines = { rayban: 150, oakley: 100, persol: 100, oliver: 100 };
      Object.keys(teamTotals).forEach(k => {
        if (teamTotals[k].count === 0) {
          teamTotals[k].total = baselines[k];
        }
      });

      return teamTotals;
    }

    function renderSidebarTeamLeaderboard() {
      const scores = calculateTeamScores();
      setText('score-rayban', `${scores.rayban.total} pts`);
      setText('score-oakley', `${scores.oakley.total} pts`);
      setText('score-persol', `${scores.persol.total} pts`);
      setText('score-oliver', `${scores.oliver.total} pts`);
    }

    function openLeaderboardModal() {
      renderClassroomLeaderboard();
      showModalDialog('leaderboard-modal');
    }

    function closeLeaderboardModal() {
      closeModalDialog('leaderboard-modal');
    }

    function renderClassroomLeaderboard() {
      const teamsContainer = document.getElementById('lb-teams-list');
      const studentsContainer = document.getElementById('lb-students-list');
      if (!teamsContainer || !studentsContainer) return;

      const teamScores = calculateTeamScores();
      const sortedTeams = TEAMS.map(t => ({
        ...t,
        total: teamScores[t.key] ? teamScores[t.key].total : 0,
        count: teamScores[t.key] ? teamScores[t.key].count : 0
      })).sort((a, b) => b.total - a.total);

      // Render Teams
      teamsContainer.innerHTML = sortedTeams.map((t, idx) => {
        const medals = ['🥇', '🥈', '🥉', '4°'];
        const isLeading = idx === 0;
        return `
          <div class="flex items-center justify-between p-3 rounded-xl border ${isLeading ? 'bg-amber-500/10 border-amber-500/40 text-amber-300' : 'bg-slate-800/60 border-slate-700/60 text-slate-200'}">
            <div class="flex items-center space-x-2.5">
              <span class="text-base font-bold">${medals[idx]}</span>
              <div>
                <div class="font-bold text-sm">${t.name}</div>
                <div class="text-[10px] text-slate-400">${t.count} detective registrati</div>
              </div>
            </div>
            <div class="font-mono font-bold text-base text-amber-400">${t.total} <span class="text-xs font-sans text-slate-400">pt</span></div>
          </div>
        `;
      }).join('');

      // Render Students
      const rawStudents = Object.values(classroomStudents);
      const studentList = [...rawStudents].sort((a, b) => {
        if (!!a.loggedOut !== !!b.loggedOut) {
          return a.loggedOut ? 1 : -1;
        }
        return (b.score || 0) - (a.score || 0);
      });

      if (studentList.length === 0) {
        studentsContainer.innerHTML = `<div class="text-xs text-slate-500 italic p-4 text-center">Nessun detective in classifica. Inserisci il tuo nome per iniziare!</div>`;
      } else {
        studentsContainer.innerHTML = studentList.slice(0, 10).map((s, idx) => {
          const tObj = TEAMS.find(t => t.key === s.teamKey) || TEAMS[0];
          const isMe = (s.id === currentStudent.id);
          const isLoggedOut = !!s.loggedOut;
          return `
            <div class="flex items-center justify-between p-2.5 rounded-xl border ${isMe ? 'bg-blue-600/20 border-blue-500 text-blue-200 font-bold' : isLoggedOut ? 'bg-slate-900/50 border-slate-800 text-slate-400 opacity-60' : 'bg-slate-800/40 border-slate-700/50 text-slate-300'} text-xs">
              <div class="flex items-center space-x-2">
                <span class="w-5 text-center font-mono font-bold text-slate-400">${idx + 1}.</span>
                <div>
                  <div class="font-semibold text-slate-100 flex items-center space-x-1">
                    <span>${s.name}</span>
                    ${isMe ? '<span class="text-[9px] bg-blue-500 text-white px-1.5 py-0.2 rounded-full">TU</span>' : ''}
                    ${isLoggedOut ? '<span class="text-[9px] bg-slate-800 text-slate-400 px-1 py-0.2 rounded font-normal font-sans">Logout</span>' : ''}
                  </div>
                  <div class="text-[10px] text-slate-400">${tObj.name}</div>
                </div>
              </div>
              <div class="font-mono font-bold text-amber-400">${s.score || 0} pt</div>
            </div>
          `;
        }).join('');
      }
    }

    // TRAINER LIVE CLASSROOM MONITORING (FULL-SCREEN TABLE IN COMMAND CENTER)
    function refreshTrainerStudents() {
      const tbody = document.getElementById('tcc-table-body');
      const countEl = document.getElementById('trainer-student-count');
      const totalCountEl = document.getElementById('trainer-student-count-total');
      const batchDeleteBtn = document.getElementById('tcc-btn-batch-delete');
      const selectedCountEl = document.getElementById('tcc-selected-count');
      const headerCb = document.getElementById('tcc-header-cb');

      const rawList = Object.values(classroomStudents);
      const activeCount = rawList.filter(s => !s.loggedOut).length;
      if (countEl) countEl.innerText = `${activeCount}/${rawList.length}`;
      if (totalCountEl) totalCountEl.innerText = currentLang === 'it' 
        ? `${activeCount} online / ${rawList.length} totali` 
        : `${activeCount} online / ${rawList.length} total`;
      if (selectedCountEl) selectedCountEl.innerText = selectedStudentIds.size;
      if (batchDeleteBtn) batchDeleteBtn.disabled = (selectedStudentIds.size === 0);

      // Also refresh student manager modal if actually open
      const smmModal = document.getElementById('student-manager-modal');
      if (smmModal && smmModal.open) {
        refreshStudentManagerTable();
      }

      if (!tbody) return;

      if (rawList.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="7" class="p-12 text-center text-slate-500 italic">
              <div class="text-3xl mb-2">👥</div>
              <div class="font-bold text-slate-400 text-sm">${currentLang === 'it' ? "Nessuno studente ancora connesso a quest'aula." : "No students connected to this classroom yet."}</div>
              <div class="text-xs text-slate-500 mt-1">${currentLang === 'it' ? "Gli studenti appariranno qui in tempo reale non appena effettuano il login." : "Students will appear here in real time as soon as they sign in."}</div>
            </td>
          </tr>
        `;
        if (headerCb) headerCb.checked = false;
        return;
      }

      // Check filter if any
      const searchInput = document.getElementById('tcc-search-input');
      const filterText = (searchInput?.value || '').toLowerCase().trim();

      const list = rawList.filter(s => {
        if (!filterText) return true;
        const nameMatch = (s.name || '').toLowerCase().includes(filterText);
        const emailMatch = (s.email || '').toLowerCase().includes(filterText);
        const teamMatch = (s.teamKey || '').toLowerCase().includes(filterText);
        return nameMatch || emailMatch || teamMatch;
      }).sort((a, b) => {
        if (!!a.loggedOut !== !!b.loggedOut) {
          return a.loggedOut ? 1 : -1;
        }
        return (b.score || 0) - (a.score || 0);
      });

      const allSelected = list.length > 0 && list.every(s => selectedStudentIds.has(s.id));
      if (headerCb) headerCb.checked = allSelected;

      tbody.innerHTML = list.map(s => {
        const isSelected = selectedStudentIds.has(s.id);
        const tObj = TEAMS.find(t => t.key === s.teamKey) || TEAMS[0];
        const chDone = Object.values(s.completedChallenges || {}).filter(Boolean).length;
        const isLoggedOut = !!s.loggedOut;
        const safeName = (s.name || '').replace(/'/g, "\\'");

        const tipBonus50 = currentLang === 'it' ? 'Assegna +50 pt' : 'Award +50 pts';
        const tipBonus100 = currentLang === 'it' ? 'Assegna +100 pt' : 'Award +100 pts';
        const tipPin = currentLang === 'it' ? 'Vedi PIN di recupero' : 'View recovery PIN';
        const tipReset = currentLang === 'it' ? 'Azzera punteggio' : 'Reset score';
        const tipKick = currentLang === 'it' ? 'Disconnetti da remoto' : 'Disconnect remotely';
        const tipDelete = currentLang === 'it' ? 'Elimina definitivamente da Firestore' : 'Permanently delete from Firestore';
        const btnDeleteText = currentLang === 'it' ? 'Elimina' : 'Delete';

        return `
          <tr class="hover:bg-slate-100/60 dark:hover:bg-slate-800/50 transition border-b border-slate-200 dark:border-slate-800/60 ${isSelected ? 'bg-blue-50/70 dark:bg-blue-950/25' : ''} ${isLoggedOut ? 'opacity-65' : ''}">
            <td class="p-3 text-center">
              <input type="checkbox" ${isSelected ? 'checked' : ''} onchange="toggleSelectStudent('${s.id}', this.checked)" class="rounded text-blue-600 focus:ring-0 cursor-pointer">
            </td>
            <td class="p-3">
              <div class="flex items-center space-x-3">
                <div class="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 shadow-2xs shrink-0">
                  ${s.picture ? `<img src="${s.picture}" class="w-full h-full rounded-full object-cover">` : (s.name || 'D').charAt(0).toUpperCase()}
                </div>
                <div class="min-w-0">
                  <div class="font-bold text-slate-900 dark:text-white text-sm truncate flex items-center space-x-2">
                    <span>${s.name}</span>
                    ${s.email ? `<span class="text-[11px] text-slate-500 dark:text-slate-400 font-normal truncate">(${s.email})</span>` : ''}
                  </div>
                  <div class="text-[10px] text-slate-400 dark:text-slate-500 font-mono">ID: ${s.id}</div>
                </div>
              </div>
            </td>
            <td class="p-3">
              <select onchange="trainerChangeStudentTeam('${s.id}', this.value)" class="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300 focus:outline-none cursor-pointer shadow-2xs">
                ${TEAMS.map(t => `<option value="${t.key}" ${s.teamKey === t.key ? 'selected' : ''}>${t.name.replace('Team ', '')}</option>`).join('')}
              </select>
            </td>
            <td class="p-3 text-center font-mono font-bold text-amber-600 dark:text-amber-400 text-sm">
              ${s.score || 0} pt
            </td>
            <td class="p-3 text-center">
              <span class="px-2.5 py-0.5 rounded-full text-xs font-bold ${chDone > 0 ? 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}">
                ${chDone}/3
              </span>
            </td>
            <td class="p-3 text-center">
              <span class="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${isLoggedOut ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400' : 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'}">
                <span class="w-1.5 h-1.5 rounded-full ${isLoggedOut ? 'bg-slate-400 dark:bg-slate-500' : 'bg-emerald-500 dark:bg-emerald-400 animate-pulse'}"></span>
                <span>${isLoggedOut ? 'Offline' : 'Online'}</span>
              </span>
            </td>
            <td class="p-3 text-right">
              <div class="flex items-center justify-end space-x-1.5">
                <button onclick="trainerAwardBonus('${s.id}', 50)" class="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-amber-700 dark:text-amber-300 border border-slate-200 dark:border-slate-700 text-xs font-bold transition shadow-2xs cursor-pointer" title="${tipBonus50}">+50</button>
                <button onclick="trainerAwardBonus('${s.id}', 100)" class="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-emerald-700 dark:text-emerald-300 border border-slate-200 dark:border-slate-700 text-xs font-bold transition shadow-2xs cursor-pointer" title="${tipBonus100}">+100</button>
                <button onclick="trainerShowRecoveryPin('${s.id}')" class="p-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 transition text-xs font-mono font-bold cursor-pointer border border-amber-500/30" title="${tipPin}">🔑</button>
                <button onclick="trainerResetSingleStudent('${s.id}', '${safeName}'); refreshTrainerStudents();" class="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-cyan-700 dark:text-cyan-300 border border-slate-200 dark:border-slate-700 transition text-xs cursor-pointer" title="${tipReset}">🔄</button>
                <button onclick="trainerKickStudent('${s.id}', '${safeName}'); refreshTrainerStudents();" class="p-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/60 dark:hover:bg-amber-800 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 transition text-xs cursor-pointer" title="${tipKick}">⛔</button>
                <button onclick="trainerDestroyStudent('${s.id}', '${safeName}'); refreshTrainerStudents();" class="py-1 px-2.5 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-950/80 dark:hover:bg-red-800 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-white transition text-xs font-bold flex items-center space-x-1 cursor-pointer" title="${tipDelete}">
                  <span>🗑️</span>
                  <span>${btnDeleteText}</span>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    function trainerShowRecoveryPin(studentId) {
      const s = classroomStudents[studentId];
      if (!s) return;
      const pin = s.recoveryPin || getStudentRecoveryPin(studentId);
      const msg = currentLang === 'it'
        ? `🔑 PIN di Recupero per lo studente "${s.name}":\n\nDì questo codice di 4 cifre allo studente per fargli riprendere il profilo:`
        : `🔑 Recovery PIN for student "${s.name}":\n\nShare this 4-digit code with the student to resume their profile:`;
      prompt(msg, pin);
    }

    function trainerResumeStudent(studentId) {
      const s = classroomStudents[studentId];
      if (!s) return;

      publishBroadcast({
        action: 'student_resume',
        targetStudentId: studentId
      });
      handleRemoteStudentResume({ targetStudentId: studentId });
      showToast(currentLang === 'it' 
        ? `🟢 Studente "${s.name}" riattivato in aula!` 
        : `🟢 Student "${s.name}" resumed in classroom!`);
    }

    function trainerResetSingleStudent(studentId, studentName) {
      const confirmMsg = currentLang === 'it'
        ? `Vuoi AZZERARE il punteggio e le sfide dello studente "${studentName}"?\n\nIl profilo rimarrà registrato, ma ripartirà da 0 punti e potrà rieseguire le challenge.`
        : `Do you want to RESET score and challenges for student "${studentName}"?\n\nThe profile remains registered, but resets to 0 points to redo challenges.`;
      const ok = confirm(confirmMsg);
      if (!ok) return;

      publishBroadcast({
        action: 'student_reset',
        targetStudentId: studentId
      });
      handleRemoteStudentReset({ targetStudentId: studentId });
      showToast(currentLang === 'it'
        ? `🔄 Punteggio di "${studentName}" azzerato con successo!`
        : `🔄 Score for "${studentName}" successfully reset!`);
    }

    async function trainerDestroyStudent(studentId, studentName) {
      const confirmMsg = currentLang === 'it'
        ? `⚠️ ATTENZIONE: Vuoi ELIMINARE DEFINITIVAMENTE lo studente "${studentName}" dall'aula?\n\n- Il browser dello studente verrà resettato.\n- Il suo profilo verrà rimosso da Firestore.\n- Questa azione è irreversibile.`
        : `⚠️ WARNING: Permanently DELETE student "${studentName}" from classroom?\n\n- The student's browser will be reset.\n- Their profile will be deleted from Firestore.\n- This action cannot be undone.`;
      const ok = confirm(confirmMsg);
      if (!ok) return;

      // 1) Delete from Firestore backend
      if (window.hubClient && window.hubClient.deleteStudent) {
        await window.hubClient.deleteStudent(studentId);
      }

      // 2) Broadcast kick
      publishBroadcast({
        action: 'student_kick',
        targetStudentId: studentId,
        permanent: true
      });
      handleRemoteStudentKick({ targetStudentId: studentId, permanent: true });
      refreshStudentManagerTable();
      showToast(currentLang === 'it'
        ? `🗑️ Studente "${studentName}" eliminato definitivamente!`
        : `🗑️ Student "${studentName}" permanently deleted!`);
    }

    // DEDICATED STUDENT MANAGEMENT SCREEN FUNCTIONS
    let selectedStudentIds = new Set();

    function openStudentManagerModal() {
      if (!isTrainerMode) {
        showToast(currentLang === 'it' ? "⚠️ Questa funzione è riservata al Trainer" : "⚠️ This feature is reserved for Trainers");
        return;
      }
      selectedStudentIds.clear();
      showModalDialog('student-manager-modal');
      refreshStudentManagerTable();
    }

    function closeStudentManagerModal() {
      closeModalDialog('student-manager-modal');
    }

    function refreshStudentManagerTable() {
      const tbody = document.getElementById('smm-table-body');
      if (!tbody) return;

      const filterText = (document.getElementById('smm-search-input')?.value || '').toLowerCase().trim();
      const allStudents = Object.values(classroomStudents);

      const totalCountEl = document.getElementById('smm-metric-total');
      const activeCountEl = document.getElementById('smm-metric-active');
      const selectedCountEl = document.getElementById('smm-selected-count');
      const batchDeleteBtn = document.getElementById('smm-btn-batch-delete');
      const headerCb = document.getElementById('smm-header-cb');
      const selectAllCb = document.getElementById('smm-select-all-cb');

      const onlineCount = allStudents.filter(s => !s.loggedOut).length;
      if (totalCountEl) totalCountEl.innerText = allStudents.length;
      if (activeCountEl) activeCountEl.innerText = currentLang === 'it' ? `${onlineCount} online` : `${onlineCount} online`;
      if (selectedCountEl) selectedCountEl.innerText = selectedStudentIds.size;
      if (batchDeleteBtn) {
        batchDeleteBtn.disabled = (selectedStudentIds.size === 0);
      }

      const filtered = allStudents.filter(s => {
        if (!filterText) return true;
        const nameMatch = (s.name || '').toLowerCase().includes(filterText);
        const emailMatch = (s.email || '').toLowerCase().includes(filterText);
        const teamMatch = (s.teamKey || '').toLowerCase().includes(filterText);
        return nameMatch || emailMatch || teamMatch;
      }).sort((a, b) => (b.score || 0) - (a.score || 0));

      if (filtered.length === 0) {
        const noStudentsMsg = currentLang === 'it'
          ? (filterText ? 'Nessuno studente trovato per i criteri di ricerca correnti.' : 'Nessuno studente trovato nell\'aula.')
          : (filterText ? 'No students found matching current search criteria.' : 'No students found in classroom.');
        tbody.innerHTML = `
          <tr>
            <td colspan="7" class="p-8 text-center text-slate-500 italic">
              ${noStudentsMsg}
            </td>
          </tr>
        `;
        if (headerCb) headerCb.checked = false;
        if (selectAllCb) selectAllCb.checked = false;
        return;
      }

      // Check if all filtered are selected
      const allSelected = filtered.length > 0 && filtered.every(s => selectedStudentIds.has(s.id));
      if (headerCb) headerCb.checked = allSelected;
      if (selectAllCb) selectAllCb.checked = allSelected;

      tbody.innerHTML = filtered.map(s => {
        const isSelected = selectedStudentIds.has(s.id);
        const tObj = TEAMS.find(t => t.key === s.teamKey) || TEAMS[0];
        const isLoggedOut = !!s.loggedOut;
        const chDone = Object.values(s.completedChallenges || {}).filter(Boolean).length;
        const safeName = (s.name || '').replace(/'/g, "\\'");

        const tipPin = currentLang === 'it' ? 'Vedi PIN di recupero' : 'View recovery PIN';
        const tipReset = currentLang === 'it' ? 'Azzera punteggio' : 'Reset score';
        const tipKick = currentLang === 'it' ? 'Disconnetti da remoto' : 'Disconnect remotely';
        const tipDelete = currentLang === 'it' ? 'Elimina definitivamente da Firestore' : 'Permanently delete from Firestore';
        const btnDeleteText = currentLang === 'it' ? 'Elimina' : 'Delete';

        return `
          <tr class="hover:bg-slate-800/40 transition ${isSelected ? 'bg-blue-950/20' : ''}">
            <td class="p-3 text-center">
              <input type="checkbox" ${isSelected ? 'checked' : ''} onchange="toggleSelectStudent('${s.id}', this.checked)" class="rounded text-blue-600 focus:ring-0 cursor-pointer">
            </td>
            <td class="p-3">
              <div class="flex items-center space-x-2.5">
                <div class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-300 border border-slate-700">
                  ${s.picture ? `<img src="${s.picture}" class="w-full h-full rounded-full object-cover">` : (s.name || 'D').charAt(0).toUpperCase()}
                </div>
                <div class="min-w-0">
                  <div class="font-bold text-white truncate flex items-center space-x-1.5">
                    <span>${s.name}</span>
                    ${s.email ? `<span class="text-[10px] text-slate-400 font-normal truncate">(${s.email})</span>` : ''}
                  </div>
                  <div class="text-[10px] text-slate-500 font-mono">ID: ${s.id}</div>
                </div>
              </div>
            </td>
            <td class="p-3">
              <select onchange="trainerChangeStudentTeam('${s.id}', this.value); refreshStudentManagerTable();" class="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs font-semibold text-amber-300 focus:outline-none cursor-pointer">
                ${TEAMS.map(t => `<option value="${t.key}" ${s.teamKey === t.key ? 'selected' : ''}>${t.name.replace('Team ', '')}</option>`).join('')}
              </select>
            </td>
            <td class="p-3 text-center font-mono font-bold text-amber-400">
              ${s.score || 0} pt
            </td>
            <td class="p-3 text-center">
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${chDone > 0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'}">
                ${chDone}/3
              </span>
            </td>
            <td class="p-3 text-center">
              <span class="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${isLoggedOut ? 'bg-slate-800 text-slate-400' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}">
                <span class="w-1.5 h-1.5 rounded-full ${isLoggedOut ? 'bg-slate-500' : 'bg-emerald-400 animate-pulse'}"></span>
                <span>${isLoggedOut ? 'Offline' : 'Online'}</span>
              </span>
            </td>
            <td class="p-3 text-right">
              <div class="flex items-center justify-end space-x-1.5">
                <button onclick="trainerShowRecoveryPin('${s.id}')" class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 transition text-[11px] cursor-pointer" title="${tipPin}">
                  🔑
                </button>
                <button onclick="trainerResetSingleStudent('${s.id}', '${safeName}'); refreshStudentManagerTable();" class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 transition text-[11px] cursor-pointer" title="${tipReset}">
                  🔄
                </button>
                <button onclick="trainerKickStudent('${s.id}', '${safeName}'); refreshStudentManagerTable();" class="p-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-800 text-amber-400 transition text-[11px] cursor-pointer" title="${tipKick}">
                  ⛔
                </button>
                <button onclick="trainerDestroyStudent('${s.id}', '${safeName}');" class="py-1 px-2 rounded-lg bg-red-950/80 hover:bg-red-800 border border-red-800 text-red-300 hover:text-white transition text-xs font-bold flex items-center space-x-1 cursor-pointer" title="${tipDelete}">
                  <span>🗑️</span>
                  <span>${btnDeleteText}</span>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    function filterStudentManagerTable() {
      refreshStudentManagerTable();
    }

    function toggleSelectStudent(studentId, checked) {
      if (checked) {
        selectedStudentIds.add(studentId);
      } else {
        selectedStudentIds.delete(studentId);
      }
      refreshStudentManagerTable();
    }

    function toggleSelectAllStudents(checked) {
      const allStudents = Object.values(classroomStudents);
      if (checked) {
        allStudents.forEach(s => selectedStudentIds.add(s.id));
      } else {
        selectedStudentIds.clear();
      }
      refreshStudentManagerTable();
    }

    async function executeBatchDeleteSelected() {
      const ids = Array.from(selectedStudentIds);
      if (ids.length === 0) return;

      const confirmMsg = currentLang === 'it'
        ? `⚠️ Confermi l'eliminazione definitiva di ${ids.length} studenti selezionati?\n\nI profili verranno cancellati da Firestore e i loro browser verranno disconnessi.`
        : `⚠️ Confirm permanent deletion of ${ids.length} selected students?\n\nProfiles will be deleted from Firestore and their browsers will be disconnected.`;
      const ok = confirm(confirmMsg);
      if (!ok) return;

      // Call Firestore batch delete API
      if (window.hubClient && window.hubClient.deleteStudentsBatch) {
        await window.hubClient.deleteStudentsBatch(ids);
      }

      ids.forEach(sid => {
        publishBroadcast({
          action: 'student_kick',
          targetStudentId: sid,
          permanent: true
        });
        handleRemoteStudentKick({ targetStudentId: sid, permanent: true });
      });

      selectedStudentIds.clear();
      refreshStudentManagerTable();
      showToast(currentLang === 'it' 
        ? `🗑️ ${ids.length} studenti eliminati con successo!` 
        : `🗑️ ${ids.length} students deleted successfully!`);
    }

    async function executeBatchDeleteAll() {
      const allStudents = Object.values(classroomStudents);
      if (allStudents.length === 0) {
        showToast(currentLang === 'it' ? "L'aula è già vuota." : "The classroom is already empty.");
        return;
      }

      const confirmMsg = currentLang === 'it'
        ? `💥 ATTENZIONE: Sei sicuro di voler SVUOTARE COMPLETAMENTE L'AULA?\n\n- Verranno eliminati TUTTI i ${allStudents.length} studenti registrati.\n- I punteggi e le sfide verranno rimossi da Firestore.\n- Tutti i partecipanti collegati verranno riportati alla schermata iniziale.`
        : `💥 WARNING: Are you sure you want to COMPLETELY CLEAR THE CLASSROOM?\n\n- ALL ${allStudents.length} registered students will be deleted.\n- Scores and challenges will be purged from Firestore.\n- All connected participants will be returned to the start screen.`;
      const ok = confirm(confirmMsg);
      if (!ok) return;

      // Call Firestore batch delete API with __ALL__ flag
      if (window.hubClient && window.hubClient.deleteStudentsBatch) {
        await window.hubClient.deleteStudentsBatch(["__ALL__"]);
      }

      allStudents.forEach(s => {
        publishBroadcast({
          action: 'student_kick',
          targetStudentId: s.id,
          permanent: true
        });
        handleRemoteStudentKick({ targetStudentId: s.id, permanent: true });
      });

      selectedStudentIds.clear();
      refreshStudentManagerTable();
      showToast(currentLang === 'it' ? "💥 Aula svuotata completamente con successo!" : "💥 Classroom completely cleared!");
    }

    function handleRemoteTrainerChangeTeam(payload) {
      const targetId = payload.targetStudentId;
      const newTeamKey = payload.newTeamKey;
      if (!targetId || !newTeamKey) return;

      // Update in classroom directory
      if (classroomStudents[targetId]) {
        classroomStudents[targetId].teamKey = newTeamKey;
        saveClassroomState();
        renderSidebarTeamLeaderboard();
        refreshTrainerStudents();
        const smmModal = document.getElementById('student-manager-modal');
        if (smmModal && smmModal.open) {
          refreshStudentManagerTable();
        }
        renderClassroomLeaderboard();
      }

      // If this browser is the target student, update local profile immediately
      if (currentStudent && currentStudent.id === targetId) {
        currentStudent.teamKey = newTeamKey;
        saveStudentProfile();
        applyStudentProfileUI();
        const tObj = TEAMS.find(t => t.key === newTeamKey) || TEAMS[0];
        showToast(currentLang === "it" 
          ? ("📢 Il docente ti ha riassegnato a: " + tObj.name + "!") 
          : ("📢 The trainer reassigned you to: " + tObj.name + "!"));
      }
    }

    function trainerChangeStudentTeam(studentId, newTeamKey) {
      if (!classroomStudents[studentId]) return;
      const tObj = TEAMS.find(t => t.key === newTeamKey) || TEAMS[0];
      
      // Update local classroom directory first so any subsequent sync sees the new team
      handleRemoteTrainerChangeTeam({
        targetStudentId: studentId,
        newTeamKey: newTeamKey
      });

      publishBroadcast({
        action: "trainer_change_team",
        targetStudentId: studentId,
        newTeamKey: newTeamKey
      });

      showToast(currentLang === 'it' ? `🔄 Squadra aggiornata a ${tObj.name}!` : `🔄 Team updated to ${tObj.name}!`);
    }


    function trainerKickStudent(studentId, studentName) {
      const s = classroomStudents[studentId];
      if (!s) return;

      const confirmMsg = currentLang === 'it'
        ? `Vuoi DISCONNETTERE lo studente "${studentName}"?\n\nLo studente verrà sloggato da remoto, ma manterrà i suoi punti e potrà rientrare con il PIN fornito dal docente.`
        : `Do you want to DISCONNECT student "${studentName}"?\n\nThe student will be logged out remotely, retaining points and able to re-enter using their recovery PIN.`;
      const choice = confirm(confirmMsg);
      if (!choice) return;

      // Broadcast kick to student's browser and to the classroom
      publishBroadcast({
        action: 'student_kick',
        targetStudentId: studentId,
        permanent: false
      });

      handleRemoteStudentKick({ targetStudentId: studentId, permanent: false });
      showToast(currentLang === 'it' 
        ? `⛔ Studente "${studentName}" disconnesso da remoto!` 
        : `⛔ Student "${studentName}" remotely disconnected!`);
    }

    function trainerAwardBonus(studentId, delta) {
      handleTrainerScoreOverride({ targetStudentId: studentId, delta: delta });
      publishBroadcast({
        action: 'trainer_override',
        targetStudentId: studentId,
        delta: delta
      });
      showToast(currentLang === 'it' ? `🎓 Bonus ${delta} pt inviato allo studente!` : `🎓 Bonus ${delta} pts sent!`);
    }

    async function resetClassroomLeaderboard() {
      const confirmMsg = currentLang === 'it'
        ? "Sei sicuro di voler azzerare i punteggi e la classifica dell'intera classe?"
        : "Are you sure you want to reset scores and leaderboard for the whole classroom?";
      if (!confirm(confirmMsg)) return;
      handleRemoteResetScores();
      publishBroadcast({ action: 'reset_scores' });
      showToast(currentLang === 'it' ? "🗑️ Classifica aula azzerata con successo!" : "🗑️ Classroom leaderboard reset successfully!");
    }


    // TRAINER SECURE ROOM MANAGEMENT
    function trainerChangeRoomCode() {
      const suggested = `lux-oct12-${Math.random().toString(36).substring(2, 6)}`;
      const current = CURRENT_ROOM;
      const promptMsg = currentLang === 'it'
        ? `🛡️ IMPOSTA STANZA / CANALE AULA SEGRETA:\n\nInserisci un identificativo univoco per isolare l'aula di oggi da interferenze esterne (solo lettere minuscole, numeri e trattini):`
        : `🛡️ SET SECRET CLASSROOM ROOM / CHANNEL:\n\nEnter a unique identifier to isolate today's room from external interference (lowercase letters, numbers, hyphens):`;
      const entered = prompt(promptMsg, current);
      if (entered === null) return;
      const clean = (entered.trim() || suggested).toLowerCase().replace(/[^a-z0-9_-]/g, '');
      if (!clean) return;

      updateRoomTopics(clean);
      showToast(currentLang === 'it' 
        ? `🛡️ Stanza aula impostata su: "${clean}"! Riconnessione in corso...` 
        : `🛡️ Room set to: "${clean}"! Reconnecting...`);
      // Notify students connected in current room before moving
      publishBroadcast({
        action: 'trainer_override',
        delta: 0
      });
      // Update browser URL without reload
      try {
        const url = new URL(window.location);
        url.searchParams.set('room', clean);
        window.history.replaceState({}, '', url);
      } catch(e) {}
    }

    function trainerCopyShareLink() {
      const url = new URL(window.location);
      url.searchParams.set('room', CURRENT_ROOM);
      // Remove trainer-specific parameters from student link
      url.searchParams.delete('trainer');
      url.searchParams.delete('pin');
      url.searchParams.delete('role');
      const shareUrl = url.toString();
      copyToClipboard(shareUrl);
      const promptMsg = currentLang === 'it'
        ? `🔗 LINK DA CONDIVIDERE CON GLI STUDENTI:\n(Gli studenti entreranno direttamente nella stanza segreta "${CURRENT_ROOM}" senza configurare nulla):`
        : `🔗 LINK TO SHARE WITH STUDENTS:\n(Students will join secret room "${CURRENT_ROOM}" directly without setup):`;
      prompt(promptMsg, shareUrl);
    }

    // TEAM SELECTOR SWITCH (FALLBACK FOR MANUAL OVERRIDE)
    function switchTeam(teamKey) {
      currentStudent.teamKey = teamKey;
      saveStudentProfile();
      applyStudentProfileUI();
      registerStudentInClassroom(currentStudent);
      broadcastStudentCheckin();
    }
