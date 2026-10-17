
    // FULLSCREEN PROJECTOR MODE FOR LEADERBOARD
    function toggleLeaderboardFullscreen() {
      const modal = document.getElementById('leaderboard-modal');
      const btn = document.getElementById('btn-lb-fullscreen');
      if (!document.fullscreenElement) {
        if (modal && modal.requestFullscreen) {
          modal.requestFullscreen();
          if (btn) btn.innerHTML = "<span>⛶ Esci Fullscreen</span>";
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
          if (btn) btn.innerHTML = "<span>⛶ Schermo Intero</span>";
        }
      }
    }

    document.addEventListener('fullscreenchange', () => {
      const btn = document.getElementById('btn-lb-fullscreen');
      if (!document.fullscreenElement && btn) {
        btn.innerHTML = "<span>⛶ Schermo Intero</span>";
      }
    });

    // TRAINER BROADCAST BLOCK ACTION
    function broadcastBlock(blockId) {
      publishBroadcast({ action: 'change_block', block: blockId });
      showBlock(blockId, false);
    }

    // TRAINER TOGGLE LOCK STATE
    function toggleLockState() {
      isStrictLocked = !isStrictLocked;
      applyLockState(isStrictLocked); // IMMEDIATELY UPDATE LOCAL UI
      publishBroadcast({ action: 'set_lock', locked: isStrictLocked });
      showToast(isStrictLocked 
        ? (currentLang === 'it' ? "🔒 Navigazione Studenti BLOCCATA" : "🔒 Student Navigation LOCKED")
        : (currentLang === 'it' ? "🔓 Esplorazione Libera SBLOCCATA" : "🔓 Free Exploration UNLOCKED"));
    }

    function updateLockControlButton() {
      const btn = document.getElementById('btn-lock-control');
      const text = document.getElementById('btn-lock-text');
      const t = translations[currentLang];

      if (btn && text && t) {
        if (isStrictLocked) {
          btn.className = "w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black transition flex items-center justify-center space-x-2 shadow-lg text-xs sm:text-sm cursor-pointer";
          text.innerText = t.btnLockLocked;
        } else {
          btn.className = "w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black transition flex items-center justify-center space-x-2 shadow-lg text-xs sm:text-sm cursor-pointer";
          text.innerText = t.btnLockUnlocked;
        }
      }
    }

    // GET CURRENT STATE OF THE CLASSROOM MANAGED BY TRAINER
    function getActiveClassroomState() {
      let currentBlock = 'cover';
      const visibleBlock = Array.from(document.querySelectorAll('.block-section')).find(el => !el.classList.contains('hidden'));
      if (visibleBlock) {
        currentBlock = visibleBlock.id.replace('block-', '');
      } else {
        try {
          currentBlock = localStorage.getItem('lux_bq_active_block_v1') || 'cover';
        } catch(e) {}
      }

      // Collect currently unlocked hints
      const allHintIds = ['b1-s1', 'b1-s2', 'b2-s1', 'b2-s2', 'b3', 'b4'];
      const unlockedHints = allHintIds.filter(id => {
        const content = document.getElementById('content-' + id);
        return content && !content.classList.contains('hidden');
      });

      return {
        block: currentBlock,
        locked: isStrictLocked,
        unlockedHints: unlockedHints,
        studentDocsUnlocked: areStudentDocsUnlocked
      };
    }

    // TRAINER FORCES COMPLETE STATE TO ALL CONNECTED CLIENTS
    function trainerForceSyncAll() {
      const state = getActiveClassroomState();
      publishBroadcast({
        action: 'classroom_state_sync',
        block: state.block,
        locked: state.locked,
        unlockedHints: state.unlockedHints,
        studentDocsUnlocked: state.studentDocsUnlocked,
        forced: true
      });
      showToast(currentLang === 'it' 
        ? ("⚡ Sincronizzazione forzata inviata a tutta l'aula! Blocco: " + state.block) 
        : ("⚡ Forced sync broadcast to entire room! Block: " + state.block));
    }


    function applyLockState(locked) {
      isStrictLocked = locked;
      const tabs = document.querySelectorAll('.tab-btn');
      tabs.forEach(tab => {
        if (locked && !isTrainerMode) {
          tab.classList.add('tab-disabled');
        } else {
          tab.classList.remove('tab-disabled');
        }
      });
      updateSyncBadge(locked);
      updateLockControlButton();

      const tccLockBadge = document.getElementById('tcc-lock-status-badge');
      if (tccLockBadge) {
        if (locked) {
          tccLockBadge.innerText = currentLang === 'it' ? '🔒 Bloccata' : '🔒 Locked';
          tccLockBadge.className = 'font-bold text-red-400';
        } else {
          tccLockBadge.innerText = currentLang === 'it' ? '🔓 Libera' : '🔓 Free';
          tccLockBadge.className = 'font-bold text-emerald-400';
        }
      }
    }

    // USER MANUAL TAB CLICK (ALLOWED ONLY WHEN UNLOCKED OR IN TRAINER MODE)
    function userSelectBlock(blockId) {
      if (isStrictLocked && !isTrainerMode) {
        showToast(currentLang === 'it' ? "🔒 Navigazione bloccata dal docente" : "🔒 Navigation is locked by trainer");
        return;
      }
      showBlock(blockId, false);
    }

    function updateSyncBadge(locked) {
      const badge = document.getElementById('sync-status-badge');
      const text = document.getElementById('sync-status-text');

      if (badge && text) {
        if (locked) {
          badge.className = "flex items-center space-x-2 bg-red-50 text-red-700 text-xs font-semibold px-3 py-1 rounded-full border border-red-200";
          text.innerText = currentLang === 'it' ? "🔒 Navigazione Bloccata dal Docente" : "🔒 Navigation Locked by Trainer";
        } else {
          badge.className = "flex items-center space-x-2 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-200";
          text.innerText = currentLang === 'it' ? "🔓 Esplorazione Libera Sbloccata" : "🔓 Free Exploration Unlocked";
        }
      }
    }

    function announceToScreenReader(message) {
      const el = document.getElementById('sr-live-announcer');
      if (el) {
        el.textContent = '';
        setTimeout(() => { el.textContent = message; }, 50);
      }
    }

    function showToast(msg, type = 'info') {
      announceToScreenReader(msg);
      const container = document.getElementById('toast-container');
      if (!container) return;

      try {
        if (!container.matches(':popover-open')) {
          container.showPopover();
        }
      } catch (e) {
        // Fallback for browsers not supporting showPopover
      }

      const toast = document.createElement('div');
      toast.className = "flex items-center space-x-3 bg-slate-900/95 backdrop-blur-md text-white text-xs px-4 py-3 rounded-xl shadow-2xl border border-slate-700/60 pointer-events-auto transform transition-all duration-300 opacity-0 translate-y-2";
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      const dotColor = type === 'error' ? 'bg-red-400 animate-pulse' : (type === 'success' ? 'bg-emerald-400' : 'bg-blue-400 animate-ping');
      toast.innerHTML = `<span class="w-2 h-2 rounded-full ${dotColor}"></span><span class="font-medium">${msg}</span>`;

      container.appendChild(toast);

      requestAnimationFrame(() => {
        toast.classList.remove('opacity-0', 'translate-y-2');
        toast.classList.add('opacity-100', 'translate-y-0');
      });

      setTimeout(() => {
        toast.classList.remove('opacity-100', 'translate-y-0');
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => {
          toast.remove();
          if (container.children.length === 0) {
            try {
              if (container.matches(':popover-open')) {
                container.hidePopover();
              }
            } catch (e) {}
          }
        }, 300);
      }, 3000);
    }

    /* =========================================================================
       MODERN WEB GUIDANCE & ANTIGRAVITY DESIGN: THEME MANAGEMENT SYSTEM
       (Strict Default: Light, Smooth Circular Reveal Transition, Full Localization)
       ========================================================================= */
    function initTheme() {
      try {
        const savedTheme = localStorage.getItem('lux_theme');
        const theme = savedTheme === 'dark' ? 'dark' : 'light';
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        updateThemeUI(theme);
      } catch (e) {
        document.documentElement.classList.remove('dark');
        updateThemeUI('light');
      }
    }

    function updateThemeUI(theme) {
      const isDark = theme === 'dark';
      const t = (translations && translations[currentLang]) ? translations[currentLang] : {
        themeDark: "Tema Scuro",
        themeLight: "Tema Chiaro",
        themeTitle: "Passa a Tema Scuro / Chiaro"
      };

      // 1. Student Header Toggle Button
      const stdToggleBtn = document.getElementById('theme-toggle-btn');
      const stdToggleIcon = document.getElementById('theme-toggle-icon');
      if (stdToggleBtn) {
        stdToggleBtn.title = t.themeTitle;
        if (isDark) {
          stdToggleBtn.className = "p-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-amber-300 transition flex items-center justify-center cursor-pointer shadow-2xs";
          if (stdToggleIcon) stdToggleIcon.textContent = "☀️";
        } else {
          stdToggleBtn.className = "p-2 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center justify-center cursor-pointer shadow-2xs";
          if (stdToggleIcon) stdToggleIcon.textContent = "🌙";
        }
      }

      // 2. Trainer Command Center Toggle Button
      const tccToggleBtn = document.getElementById('tcc-theme-toggle-btn');
      const tccToggleIcon = document.getElementById('tcc-theme-toggle-icon');
      if (tccToggleBtn) {
        tccToggleBtn.title = t.themeTitle;
        if (isDark) {
          tccToggleBtn.className = "p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 hover:text-white transition flex items-center justify-center cursor-pointer shadow-2xs";
          if (tccToggleIcon) tccToggleIcon.textContent = "☀️";
        } else {
          tccToggleBtn.className = "p-2 rounded-xl bg-slate-200 hover:bg-slate-300 border border-slate-300 text-slate-700 hover:text-slate-900 transition flex items-center justify-center cursor-pointer shadow-2xs";
          if (tccToggleIcon) tccToggleIcon.textContent = "🌙";
        }
      }

      // 3. Hamburger Menu Theme Button
      const menuThemeCurrentIcon = document.getElementById('menu-theme-current-icon');
      const menuThemeCurrentText = document.getElementById('menu-theme-current-text');
      if (menuThemeCurrentIcon) {
        menuThemeCurrentIcon.textContent = isDark ? "☀️" : "🌙";
      }
      if (menuThemeCurrentText) {
        menuThemeCurrentText.textContent = isDark ? t.themeLight : t.themeDark;
      }

      // 4. Role Selection Welcome Modal Theme Button
      const roleToggleBtn = document.getElementById('role-theme-toggle-btn');
      const roleToggleIcon = document.getElementById('role-theme-toggle-icon');
      if (roleToggleBtn) {
        roleToggleBtn.title = t.themeTitle;
        if (isDark) {
          roleToggleBtn.className = "p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-amber-300 hover:bg-slate-700 transition flex items-center justify-center cursor-pointer shadow-2xs text-xs";
          if (roleToggleIcon) roleToggleIcon.textContent = "☀️";
        } else {
          roleToggleBtn.className = "p-1.5 rounded-lg border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 transition flex items-center justify-center cursor-pointer shadow-2xs text-xs";
          if (roleToggleIcon) roleToggleIcon.textContent = "🌙";
        }
      }
    }

    function toggleTheme(event) {
      const isCurrentlyDark = document.documentElement.classList.contains('dark');
      const newTheme = isCurrentlyDark ? 'light' : 'dark';

      const applyTheme = () => {
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        try { localStorage.setItem('lux_theme', newTheme); } catch (e) {}
        updateThemeUI(newTheme);
      };

      if (event && document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        try {
          const x = (event && typeof event.clientX === 'number') ? event.clientX : window.innerWidth / 2;
          const y = (event && typeof event.clientY === 'number') ? event.clientY : window.innerHeight / 2;
          const endRadius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
          );

          const transition = document.startViewTransition(() => {
            applyTheme();
          });

          if (transition && transition.ready) {
            transition.ready.then(() => {
              try {
                document.documentElement.animate(
                  {
                    clipPath: [
                      `circle(0px at ${x}px ${y}px)`,
                      `circle(${endRadius}px at ${x}px ${y}px)`
                    ]
                  },
                  {
                    duration: 320,
                    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                    pseudoElement: '::view-transition-new(root)'
                  }
                );
              } catch (animErr) {}
            }).catch(() => {
              applyTheme();
            });
          }
        } catch (vtErr) {
          applyTheme();
        }
      } else {
        applyTheme();
      }
    }

    function setLanguage(lang) {
      currentLang = lang;
      const t = translations[lang];
      if (!t) return;

      const btnIt = document.getElementById('lang-btn-it');
      const btnEn = document.getElementById('lang-btn-en');
      if (btnIt) btnIt.className = lang === 'it' ? "px-3 py-1 text-xs font-bold rounded-md bg-blue-600 text-white shadow-xs transition" : "px-3 py-1 text-xs font-bold rounded-md text-slate-600 hover:text-slate-900 transition";
      if (btnEn) btnEn.className = lang === 'en' ? "px-3 py-1 text-xs font-bold rounded-md bg-blue-600 text-white shadow-xs transition" : "px-3 py-1 text-xs font-bold rounded-md text-slate-600 hover:text-slate-900 transition";

      const tccBtnIt = document.getElementById('tcc-lang-btn-it');
      const tccBtnEn = document.getElementById('tcc-lang-btn-en');
      if (tccBtnIt) tccBtnIt.className = lang === 'it' ? "px-3 py-1 text-xs font-bold rounded-md bg-blue-600 text-white shadow-xs transition" : "px-3 py-1 text-xs font-bold rounded-md text-slate-400 hover:text-white transition";
      if (tccBtnEn) tccBtnEn.className = lang === 'en' ? "px-3 py-1 text-xs font-bold rounded-md bg-blue-600 text-white shadow-xs transition" : "px-3 py-1 text-xs font-bold rounded-md text-slate-400 hover:text-white transition";

      try { localStorage.setItem('lux_bq_lang', lang); } catch (e) {}

      // Update Theme UI strings with current language
      const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      updateThemeUI(currentTheme);

      setText('lbl-clock', t.lblClock);
      setText('lbl-team', t.lblTeam);
      setText('hdr-env-specs', t.hdrEnvSpecs);
      setText('btn-copy-project', t.btnCopyProject);
      setText('hdr-student-docs', t.hdrStudentDocs);
      setText('student-docs-lock-badge', areStudentDocsUnlocked ? t.studentDocsLockBadgeUnlocked : t.studentDocsLockBadgeLocked);
      setText('student-docs-locked-title', t.studentDocsLockedTitle);
      setText('student-docs-locked-desc', t.studentDocsLockedDesc);
      setText('student-docs-unlocked-desc', t.studentDocsUnlockedDesc);
      setText('hdr-shortcuts', t.hdrShortcuts);
      setText('sc-gemini-title', t.scGeminiTitle);
      setText('sc-gemini-desc', t.scGeminiDesc);
      setText('sc-run-title', t.scRunTitle);
      setText('sc-run-desc', t.scRunDesc);
      setText('hdr-leaderboard', t.hdrLeaderboard);
      setText('badge-challenges', t.badgeChallenges);
      setText('hero-title', t.heroTitle);
      setText('hero-subtitle', t.heroSubtitle);
      setText('btn-open-bq', t.btnOpenBQ);

      setText('tab-cover', t.tabCover);
      setText('tab-b1', t.tabB1);
      setText('tab-b2', t.tabB2);
      setText('tab-break', t.tabBreak);
      setText('tab-b3', t.tabB3);
      setText('tab-b4', t.tabB4);
      setText('tab-b5', t.tabB5);

      // COVER PAGE ELEMENTS
      setText('cover-badge', t.coverBadge);
      setText('cover-title', t.coverTitle);
      setText('cover-subtitle', t.coverSubtitle);
      setText('cover-waiting-status', t.coverWaitingStatus);
      setText('cover-agenda-hdr', t.coverAgendaHdr);
      setText('agenda-b1-lbl', t.agendaB1Lbl);
      setText('agenda-b1-tag', t.agendaB1Tag);
      setText('cover-b1-title', t.coverB1Title);
      setText('cover-b1-desc', t.coverB1Desc);
      setText('agenda-b2-lbl', t.agendaB2Lbl);
      setText('agenda-b2-tag', t.agendaB2Tag);
      setText('cover-b2-title', t.coverB2Title);
      setText('cover-b2-desc', t.coverB2Desc);
      setText('agenda-break-lbl', t.agendaBreakLbl);
      setText('agenda-break-tag', t.agendaBreakTag);
      setText('cover-break-title', t.coverBreakTitle);
      setText('cover-break-desc', t.coverBreakDesc);
      setText('agenda-b3-lbl', t.agendaB3Lbl);
      setText('agenda-b3-tag', t.agendaB3Tag);
      setText('cover-b3-title', t.coverB3Title);
      setText('cover-b3-desc', t.coverB3Desc);
      setText('agenda-b4-lbl', t.agendaB4Lbl);
      setText('agenda-b4-tag', t.agendaB4Tag);
      setText('cover-b4-title', t.coverB4Title);
      setText('cover-b4-desc', t.coverB4Desc);
      setText('agenda-b5-lbl', t.agendaB5Lbl);
      setText('agenda-b5-tag', t.agendaB5Tag);
      setText('cover-b5-title', t.coverB5Title);
      setText('cover-b5-desc', t.coverB5Desc);
      setText('cover-ready-hdr', t.coverReadyHdr);
      setText('cover-step1', t.coverStep1);
      setText('cover-step2', t.coverStep2);
      setText('cover-step3', t.coverStep3);

      setText('b1-title', t.b1Title);
      setText('b1-detective-tag', t.b1DetectiveTag);
      setText('b1-detective-title', t.b1DetectiveTitle);
      setHTML('b1-detective-desc', t.b1DetectiveDesc);
      setText('b1-step1-title', t.b1Step1Title);
      setText('b1-s1-brief-title', t.b1S1BriefTitle);
      setHTML('b1-s1-brief-desc', t.b1S1BriefDesc);
      setText('b1-s1-toggle-lbl', t.b1S1ToggleLbl);
      setText('p-b1-s1', t.pB1S1);
      setText('b1-step2-title', t.b1Step2Title);
      setText('b1-s2-brief-title', t.b1S2BriefTitle);
      setHTML('b1-s2-brief-desc', t.b1S2BriefDesc);
      setText('b1-s2-toggle-lbl', t.b1S2ToggleLbl);
      setText('p-b1-s2', t.pB1S2);

      setText('b2-title', t.b2Title);
      setText('b2-detective-tag', t.b2DetectiveTag);
      setText('b2-detective-title', t.b2DetectiveTitle);
      setHTML('b2-detective-desc', t.b2DetectiveDesc);
      setText('b2-prompt-title', t.b2PromptTitle);
      setText('b2-s1-brief-title', t.b2S1BriefTitle);
      setHTML('b2-s1-brief-desc', t.b2S1BriefDesc);
      setText('b2-s1-toggle-lbl', t.b2S1ToggleLbl);
      setText('p-b2-s1', t.pB2S1);
      setText('b2-prompt2-title', t.b2Prompt2Title);
      setText('b2-s2-brief-title', t.b2S2BriefTitle);
      setHTML('b2-s2-brief-desc', t.b2S2BriefDesc);
      setText('b2-s2-toggle-lbl', t.b2S2ToggleLbl);
      setText('p-b2-s2', t.pB2S2);
      setText('b2-discovery-title', t.b2DiscoveryTitle);
      setHTML('b2-discovery-desc', t.b2DiscoveryDesc);

      setText('break-title', t.breakTitle);
      setText('break-desc', t.breakDesc);

      setText('b3-title', t.b3Title);
      setText('b3-detective-tag', t.b3DetectiveTag);
      setText('b3-detective-title', t.b3DetectiveTitle);
      setHTML('b3-detective-desc', t.b3DetectiveDesc);
      setText('b3-brief-title', t.b3BriefTitle);
      setHTML('b3-desc', t.b3Desc);
      setText('b3-toggle-lbl', t.b3ToggleLbl);
      setText('b3-roas-title', t.b3RoasTitle);
      setHTML('b3-roas-desc', t.b3RoasDesc);

      setText('b4-title', t.b4Title);
      setText('b4-detective-tag', t.b4DetectiveTag);
      setText('b4-detective-title', t.b4DetectiveTitle);
      setHTML('b4-detective-desc', t.b4DetectiveDesc);
      setHTML('b4-team-rule', t.b4TeamRule);
      setText('b4-prompt-title', t.b4PromptTitle);
      setText('b4-brief-title', t.b4BriefTitle);
      setHTML('b4-brief-desc', t.b4BriefDesc);
      setText('b4-toggle-lbl', t.b4ToggleLbl);

      setText('b5-title', t.b5Title);
      setText('b5-badge', t.b5Badge);
      setText('b5-p1-title', t.b5P1Title);
      setText('b5-p1-desc', t.b5P1Desc);
      setText('b5-p2-title', t.b5P2Title);
      setText('b5-p2-desc', t.b5P2Desc);
      setText('b5-p3-title', t.b5P3Title);
      setText('b5-p3-desc', t.b5P3Desc);

      // STORY BRIEFING TRANSLATIONS BINDINGS
      setText('story-brief-badge', t.storyBriefBadge);
      setText('story-target-dataset', t.storyTargetDataset);
      setText('story-brief-headline', t.storyBriefHeadline);
      setHTML('story-brief-narrative', t.storyBriefNarrative);
      setText('story-step1-num', t.storyStep1Num);
      setText('story-step1-title', t.storyStep1Title);
      setText('story-step1-desc', t.storyStep1Desc);
      setText('story-step2-num', t.storyStep2Num);
      setText('story-step2-title', t.storyStep2Title);
      setText('story-step2-desc', t.storyStep2Desc);
      setText('story-step3-num', t.storyStep3Num);
      setText('story-step3-title', t.storyStep3Title);
      setText('story-step3-desc', t.storyStep3Desc);
      setText('story-step4-num', t.storyStep4Num);
      setText('story-step4-title', t.storyStep4Title);
      setText('story-step4-desc', t.storyStep4Desc);

      setText('hdr-rosetta', t.hdrRosetta);
      const searchInput = document.getElementById('rosetta-search');
      if (searchInput) searchInput.placeholder = t.searchPlaceholder;
      setText('th-excel', t.thExcel);
      setText('th-sql', t.thSql);
      setText('th-example', t.thExample);
      setText('rs-row1-excel', t.rsRow1Excel);
      setText('rs-row1-sql', t.rsRow1Sql);
      setText('rs-row2-excel', t.rsRow2Excel);
      setText('rs-row2-sql', t.rsRow2Sql);
      setText('rs-row3-excel', t.rsRow3Excel);
      setText('rs-row3-sql', t.rsRow3Sql);
      setText('rs-row4-excel', t.rsRow4Excel);
      setText('rs-row4-sql', t.rsRow4Sql);
      setText('rs-row5-excel', t.rsRow5Excel);
      setText('rs-row5-sql', t.rsRow5Sql);
      setText('rs-row6-excel', t.rsRow6Excel);
      setText('rs-row6-sql', t.rsRow6Sql);
      setText('rs-row7-excel', t.rsRow7Excel);
      setText('rs-row7-sql', t.rsRow7Sql);
      setText('rs-row8-excel', t.rsRow8Excel);
      setText('rs-row8-sql', t.rsRow8Sql);
      setText('rs-row9-excel', t.rsRow9Excel);
      setText('rs-row9-sql', t.rsRow9Sql);
      setText('rs-row10-excel', t.rsRow10Excel);
      setText('rs-row10-sql', t.rsRow10Sql);
      setText('rs-row11-excel', t.rsRow11Excel);
      setText('rs-row11-sql', t.rsRow11Sql);

      // ROSETTA STONE MODAL TRANSLATIONS
      setText('hdr-rosetta-modal', t.hdrRosetta);
      const searchModalInput = document.getElementById('rosetta-modal-search');
      if (searchModalInput) searchModalInput.placeholder = t.searchPlaceholder;
      setText('th-excel-modal', t.thExcel);
      setText('th-sql-modal', t.thSql);
      setText('th-example-modal', t.thExample);
      setText('rs-m-row1-excel', t.rsRow1Excel);
      setText('rs-m-row1-sql', t.rsRow1Sql);
      setText('rs-m-row2-excel', t.rsRow2Excel);
      setText('rs-m-row2-sql', t.rsRow2Sql);
      setText('rs-m-row3-excel', t.rsRow3Excel);
      setText('rs-m-row3-sql', t.rsRow3Sql);
      setText('rs-m-row4-excel', t.rsRow4Excel);
      setText('rs-m-row4-sql', t.rsRow4Sql);
      setText('rs-m-row5-excel', t.rsRow5Excel);
      setText('rs-m-row5-sql', t.rsRow5Sql);
      setText('rs-m-row6-excel', t.rsRow6Excel);
      setText('rs-m-row6-sql', t.rsRow6Sql);
      setText('rs-m-row7-excel', t.rsRow7Excel);
      setText('rs-m-row7-sql', t.rsRow7Sql);
      setText('rs-m-row8-excel', t.rsRow8Excel);
      setText('rs-m-row8-sql', t.rsRow8Sql);
      setText('rs-m-row9-excel', t.rsRow9Excel);
      setText('rs-m-row9-sql', t.rsRow9Sql);
      setText('rs-m-row10-excel', t.rsRow10Excel);
      setText('rs-m-row10-sql', t.rsRow10Sql);
      setText('rs-m-row11-excel', t.rsRow11Excel);
      setText('rs-m-row11-sql', t.rsRow11Sql);

      // PIN LOCKED HINTS TRANSLATIONS
      setText('lbl-hint-locked-b1s1', t.lblHintLocked);
      setText('btn-unlock-b1s1', t.btnUnlock);
      setText('lbl-hint-locked-b1s2', t.lblHintLocked);
      setText('btn-unlock-b1s2', t.btnUnlock);
      setText('lbl-hint-locked-b2s1', t.lblHintLocked);
      setText('btn-unlock-b2s1', t.btnUnlock);
      setText('lbl-hint-locked-b2s2', t.lblHintLocked);
      setText('btn-unlock-b2s2', t.btnUnlock);
      setText('lbl-hint-locked-b3', t.lblHintLockedQuery);
      setText('btn-unlock-b3', t.btnUnlock);
      setText('lbl-hint-locked-b4', t.lblHintLocked);
      setText('btn-unlock-b4', t.btnUnlock);

      setText('toast-text', t.toastText);

      // TRAINER COMMAND CENTER & PREVIEW BANNER LOCALIZATION
      setText('tcc-preview-banner-text', t.tccPreviewBannerText);
      setText('tcc-preview-banner-btn-text', t.tccPreviewBannerBtnText);
      setText('tb-badge', lang === 'it' ? 'Cabina di Regia Docente' : 'Trainer Command Center');
      setText('tcc-live-regia-badge', t.tccLiveRegiaBadge);
      setText('tb-subtitle', t.tbSubtitle);
      setText('tb-lbl-room-channel', lang === 'it' ? 'Stanza:' : 'Room:');
      const btnChgRoom = document.getElementById('tcc-btn-change-room');
      if (btnChgRoom) btnChgRoom.title = t.tccBtnChangeRoomTitle;
      const btnShareLink = document.getElementById('tcc-btn-share-link');
      if (btnShareLink) btnShareLink.title = t.tccBtnShareLinkTitle;
      setText('tcc-lbl-classroom', t.tccLblClassroom);
      setText('tcc-lbl-block', t.tccLblBlock);
      const btnPreview = document.getElementById('tcc-btn-preview');
      if (btnPreview) btnPreview.title = t.tccBtnPreviewTitle;
      setText('tcc-btn-preview-text', t.tccBtnPreviewText);
      setText('tcc-btn-preview-short', t.tccBtnPreviewShort);
      const btnExitTrainer = document.getElementById('btn-exit-trainer');
      if (btnExitTrainer) btnExitTrainer.title = t.btnExitTrainerTitle;
      setText('btn-exit-trainer-text', t.btnExitTrainerText);

      // TCC CARD 1: LOCK & SYNC
      setText('tb-lbl-student-control-text', t.tbLblStudentControlText);
      setText('tcc-lbl-global-sync', t.tccLblGlobalSync);
      setText('tb-desc-student-control', t.tbDescStudentControl);
      const btnForceSyncAll = document.getElementById('btn-force-sync-all');
      if (btnForceSyncAll) btnForceSyncAll.title = t.btnForceSyncAllTitle;
      setText('btn-force-sync-text', t.btnForceSyncText);

      // TCC CARD 2: TIMELINE & BLOCKS
      setText('tb-lbl-broadcast-hdr-text', t.tbLblBroadcastHdrText);
      setText('tcc-desc-broadcast', t.tccDescBroadcast);
      setText('tb-b-cover-title', t.tbBCoverTitle);
      setText('tb-b-cover-desc', t.tbBCoverDesc);
      setText('tb-b-b1-title', t.tbBB1Title);
      setText('tb-b-b1-desc', t.tbBB1Desc);
      setText('tb-b-b2-title', t.tbBB2Title);
      setText('tb-b-b2-desc', t.tbBB2Desc);
      setText('tb-b-break-title', t.tbBBreakTitle);
      setText('tb-b-break-desc', t.tbBBreakDesc);
      setText('tb-b-b3-title', t.tbBB3Title);
      setText('tb-b-b3-desc', t.tbBB3Desc);
      setText('tb-b-b4-title', t.tbBB4Title);
      setText('tb-b-b4-desc', t.tbBB4Desc);
      setText('tb-b-b5-title', t.tbBB5Title);
      setText('tb-b-b5-desc', t.tbBB5Desc);

      // TCC CARD 3: TIMER
      setText('tb-lbl-timer-hdr-text', t.tbLblTimerHdrText);
      setText('tb-desc-timer', t.tbDescTimer);
      if (!classroomTimerInterval) {
        setText('trainer-timer-quick-status', t.trainerTimerQuickOptional);
        setText('trainer-timer-status', lang === 'it' ? 'Spento' : 'Off');
      }
      setText('btn-timer-15-text', t.btnTimer15Text);
      setText('btn-timer-10-text', t.btnTimer10Text);
      setText('btn-timer-5-text', t.btnTimer5Text);
      setText('btn-timer-stop-text', t.btnTimerStopText);

      // TCC CARD 4: CHEATSHEET & HINTS
      setText('tb-cs-title-text', t.tbCsTitleText);
      setText('tb-cs-btn-open', t.tbCsBtnOpen);
      setText('tb-lbl-hints', t.tbLblHints);
      const btnTogglePinVis = document.getElementById('btn-toggle-pin-visibility');
      if (btnTogglePinVis) btnTogglePinVis.title = t.btnTogglePinVisTitle;
      setText('tb-lbl-docs-hdr', t.tbLblDocsHdr);

      // TCC RIGHT COLUMN: ROSTER & METRICS
      setText('tcc-roster-title', t.tccRosterTitle);
      setText('tcc-roster-subtitle', t.tccRosterSubtitle);
      const btnPing = document.getElementById('tcc-btn-ping');
      if (btnPing) btnPing.title = t.tccBtnPingTitle;
      setText('tcc-btn-ping-text', t.tccBtnPingText);
      setText('btn-tb-project-lb-text', t.btnTbProjectLbText);
      const btnResetLb = document.getElementById('btn-tb-reset-lb');
      if (btnResetLb) btnResetLb.title = t.btnTbResetLbTitle;
      setText('tcc-m-total-lbl', t.tccMTotalLbl);
      setText('tcc-m-total-sub', t.tccMTotalSub);
      setText('tcc-m-online-lbl', t.tccMOnlineLbl);
      setText('tcc-m-online-sub', t.tccMOnlineSub);
      setText('tcc-m-sel-lbl', t.tccMSelLbl);
      setText('tcc-m-sel-sub', t.tccMSelSub);
      setText('tcc-btn-batch-delete-text', t.tccBtnBatchDeleteText);
      const btnBatchDelAll = document.getElementById('tcc-btn-batch-delete-all');
      if (btnBatchDelAll) btnBatchDelAll.title = t.tccBtnBatchDeleteAllTitle;
      const tccSearch = document.getElementById('tcc-search-input');
      if (tccSearch) tccSearch.placeholder = t.tccSearchPlaceholder;
      setText('tcc-select-all-lbl', t.tccSelectAllLbl);
      setText('tcc-th-student', t.tccThStudent);
      setText('tcc-th-team', t.tccThTeam);
      setText('tcc-th-score', t.tccThScore);
      setText('tcc-th-challenges', t.tccThChallenges);
      setText('tcc-th-status', t.tccThStatus);
      setText('tcc-th-actions', t.tccThActions);
      setText('tcc-footer-master-pin-lbl', t.tccFooterMasterPinLbl);
      setHTML('tcc-footer-max-score', t.tccFooterMaxScore);

      // STUDENT MANAGER MODAL (SMM)
      setText('smm-modal-subtitle', t.smmModalSubtitle);
      setText('smm-btn-reload-text', t.smmBtnReloadText);
      setText('smm-m-total-lbl', t.smmMTotalLbl);
      setText('smm-m-sel-lbl', t.smmMSelLbl);
      setText('smm-m-sel-sub', t.smmMSelSub);
      setText('smm-btn-batch-delete-text', t.smmBtnBatchDeleteText);
      const smmBatchAll = document.getElementById('smm-btn-batch-all');
      if (smmBatchAll) smmBatchAll.title = t.smmBtnBatchAllTitle;
      setText('smm-btn-batch-all-text', t.smmBtnBatchAllText);
      const smmSearch = document.getElementById('smm-search-input');
      if (smmSearch) smmSearch.placeholder = t.smmSearchPlaceholder;
      setText('smm-select-all-lbl', t.smmSelectAllLbl);
      setText('smm-th-student', t.smmThStudent);
      setText('smm-th-team', t.smmThTeam);
      setText('smm-th-score', t.smmThScore);
      setText('smm-th-challenges', t.smmThChallenges);
      setText('smm-th-status', t.smmThStatus);
      setText('smm-th-actions', t.smmThActions);
      setText('smm-footer-text', t.smmFooterText);
      setText('smm-btn-close-text', t.smmBtnCloseText);

      // TRAINER PIN MODAL
      setText('t-modal-title', t.tModalTitle);
      setText('t-modal-desc', t.tModalDesc);
      setText('trainer-modal-error', t.trainerModalError);
      setText('btn-trainer-pin-cancel', t.btnTrainerPinCancel);
      setText('btn-trainer-pin-submit', t.btnTrainerPinSubmit);

      // TRAINER MODAL SOLUTIONS
      setText('ts-modal-title', t.tsModalTitle);
      setText('ts-modal-subtitle', t.tsModalSubtitle);
      setHTML('ts-modal-footer', t.tsModalFooter);
      setText('btn-ts-modal-close', t.btnTsModalClose);

      // TRAINER DIRECT NAVBAR LANGUAGE BUTTONS
      const tccLangIt = document.getElementById('tcc-lang-btn-it');
      const tccLangEn = document.getElementById('tcc-lang-btn-en');
      if (tccLangIt) tccLangIt.className = lang === 'it' ? "px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-600 text-white shadow-xs transition" : "px-2.5 py-1 text-xs font-bold rounded-lg text-slate-300 hover:text-white transition";
      if (tccLangEn) tccLangEn.className = lang === 'en' ? "px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-600 text-white shadow-xs transition" : "px-2.5 py-1 text-xs font-bold rounded-lg text-slate-300 hover:text-white transition";

      // Student docs badge & button text
      const trainerBadge = document.getElementById('trainer-student-guides-badge');
      const trainerBtnText = document.getElementById('btn-toggle-student-docs-text');
      if (trainerBadge) {
        trainerBadge.innerText = areStudentDocsUnlocked
          ? (lang === 'it' ? '🔓 Sbloccate' : '🔓 Unlocked')
          : (lang === 'it' ? '🔒 Bloccate' : '🔒 Locked');
      }
      if (trainerBtnText) {
        trainerBtnText.innerText = areStudentDocsUnlocked
          ? t.btnToggleStudentDocsLock
          : t.btnToggleStudentDocsUnlock;
      }

      // Lock control button text
      const btnLockText = document.getElementById('btn-lock-text');
      if (btnLockText) {
        btnLockText.innerText = isStrictLocked ? t.btnLockLocked : t.btnLockUnlocked;
      }

      // Unlock all hints button text
      const allHintsBtnText = document.getElementById('btn-hint-all-toggle-text');
      if (allHintsBtnText) {
        const areAllUnlocked = ['b1-s1', 'b1-s2', 'b2-s1', 'b2-s2', 'b3', 'b4'].every(id => {
          const content = document.getElementById('content-' + id);
          return content && !content.classList.contains('hidden');
        });
        allHintsBtnText.innerText = areAllUnlocked ? t.btnHintAllToggleLock : t.btnHintAllToggleUnlock;
      }


      const pinVisText = document.getElementById('pin-vis-text');
      if (pinVisText) {
        pinVisText.innerText = trainerPinsRevealed
          ? (lang === 'it' ? 'Nascondi PIN' : 'Hide PINs')
          : (lang === 'it' ? 'Mostra PIN' : 'Show PINs');
      }

      updateTrainerHintUI();

      const trainerBtn = document.getElementById('btn-trainer-toggle');
      if (trainerBtn) {
        trainerBtn.innerText = isTrainerMode ? t.btnTrainerActive : t.btnTrainerInactive;
      }

      // ROLE SELECTION MODAL TRANSLATIONS
      setText('role-modal-title', t.roleModalTitle);
      setText('role-modal-subtitle', t.roleModalSubtitle);
      setText('role-trainer-title', t.roleTrainerTitle);
      setText('role-trainer-badge', t.roleTrainerBadge);
      setText('role-trainer-desc', t.roleTrainerDesc);
      setText('role-trainer-action', t.roleTrainerAction);
      setText('role-student-title', t.roleStudentTitle);
      setText('role-student-badge', t.roleStudentBadge);
      setText('role-student-desc', t.roleStudentDesc);
      setText('role-student-action', t.roleStudentAction);
      setText('btn-leaderboard-text', lang === 'it' ? 'Classifica Live' : 'Live Leaderboard');
      setText('btn-switch-role-text', lang === 'it' ? 'Cambia Ruolo' : 'Switch Role');
      setText('btn-logout-text', lang === 'it' ? 'Logout Profilo Studente' : 'Logout Student Profile');
      setText('popover-hdr-title', lang === 'it' ? 'Account Studente' : 'Student Account');
      setText('popover-btn-profile-text', lang === 'it' ? 'Profilo' : 'Profile');
      setText('popover-btn-logout-text', lang === 'it' ? 'Logout' : 'Log out');
      setText('menu-hdr-title', lang === 'it' ? 'Pannello Rapido' : 'Quick Panel');
      setText('menu-lang-title', lang === 'it' ? 'Lingua / Language' : 'Language / Lingua');
      setText('menu-nav-heading', lang === 'it' ? 'Salta al Modulo' : 'Jump to Module');
      setText('menu-jump-intro', lang === 'it' ? 'Introduzione & Setup' : 'Introduction & Setup');
      setText('menu-jump-b1', lang === 'it' ? 'Blocco 1: BQ Studio' : 'Block 1: BQ Studio');
      setText('menu-jump-b2', lang === 'it' ? 'Blocco 2: Gemini SQL' : 'Block 2: Gemini SQL');
      setText('menu-jump-pausa', lang === 'it' ? 'Pausa Caffè & Quiz' : 'Coffee Break & Quiz');
      setText('menu-jump-b3', lang === 'it' ? 'Blocco 3: AI Functions' : 'Block 3: AI Functions');
      setText('menu-jump-b4', lang === 'it' ? 'Blocco 4: Forensic Challenge' : 'Block 4: Forensic Challenge');
      setText('menu-jump-finale', lang === 'it' ? 'Conclusioni & Feedback' : 'Summary & Feedback');
      setText('ob-btn-reroll', lang === 'it' ? "Riassegna a un'altra squadra casuale" : "Re-assign to another random team");
      setText('ob-lbl-or-manual', lang === 'it' ? 'oppure accedi con nickname' : 'or sign in with nickname');

      // QUIZ CARDS TRANSLATIONS BINDINGS
      // CH0
      setText('quiz-title-ch0', t.quizTitleCh0);
      setText('quiz-badge-ch0', t.quizBadgeCh0);
      setText('lbl-quiz-ch0-q1', t.lblQuizCh0Q1);
      setText('opt-quiz-ch0-q1-default', t.optQuizCh0Q1Default);
      setText('lbl-quiz-ch0-q2', t.lblQuizCh0Q2);
      setText('opt-quiz-ch0-q2-default', t.optQuizCh0Q2Default);
      setText('opt-quiz-ch0-q2-2', t.optQuizCh0Q2_2);
      setText('opt-quiz-ch0-q2-3', t.optQuizCh0Q2_3);
      setText('opt-quiz-ch0-q2-4', t.optQuizCh0Q2_4);
      setText('opt-quiz-ch0-q2-5', t.optQuizCh0Q2_5);
      setText('hint-quiz-ch0-q2', t.hintQuizCh0Q2);
      if (document.getElementById('quiz-feedback-ch0') && !currentStudent?.completedChallenges?.ch0) {
        setText('quiz-feedback-ch0', t.quizFeedbackCh0);
      }
      setText('btn-validate-ch0-text', t.btnValidateCh0Text);

      // CH1
      setText('quiz-title-ch1', t.quizTitleCh1);
      setText('quiz-badge-ch1', t.quizBadgeCh1);
      setText('lbl-quiz-ch1-q1', t.lblQuizCh1Q1);
      setText('opt-quiz-ch1-q1-default', t.optQuizCh1Q1Default);
      setText('lbl-quiz-ch1-q2', t.lblQuizCh1Q2);
      const ch1Q2Input = document.getElementById('quiz-ch1-q2');
      if (ch1Q2Input) ch1Q2Input.placeholder = t.phQuizCh1Q2;
      setText('hint-quiz-ch1-q2', t.hintQuizCh1Q2);
      if (document.getElementById('quiz-feedback-ch1') && !currentStudent?.completedChallenges?.ch1) {
        setText('quiz-feedback-ch1', t.quizFeedbackCh1);
      }
      setText('btn-validate-ch1-text', t.btnValidateCh1Text);

      // CH2
      setText('quiz-title-ch2', t.quizTitleCh2);
      setText('quiz-badge-ch2', t.quizBadgeCh2);
      setText('lbl-quiz-ch2-q1', t.lblQuizCh2Q1);
      setText('opt-quiz-ch2-q1-default', t.optQuizCh2Q1Default);
      setText('lbl-quiz-ch2-q2', t.lblQuizCh2Q2);
      const ch2Q2Input = document.getElementById('quiz-ch2-q2');
      if (ch2Q2Input) ch2Q2Input.placeholder = t.phQuizCh2Q2;
      setText('hint-quiz-ch2-q2', t.hintQuizCh2Q2);
      if (document.getElementById('quiz-feedback-ch2') && !currentStudent?.completedChallenges?.ch2) {
        setText('quiz-feedback-ch2', t.quizFeedbackCh2);
      }
      setText('btn-validate-ch2-text', t.btnValidateCh2Text);

      // CH3
      setText('quiz-title-ch3', t.quizTitleCh3);
      setText('quiz-badge-ch3', t.quizBadgeCh3);
      setText('lbl-quiz-ch3-q1', t.lblQuizCh3Q1);
      const ch3Q1Input = document.getElementById('quiz-ch3-q1');
      if (ch3Q1Input) ch3Q1Input.placeholder = t.phQuizCh3Q1;
      setText('hint-quiz-ch3-q1', t.hintQuizCh3Q1);
      setText('lbl-quiz-ch3-q2', t.lblQuizCh3Q2);
      setText('opt-quiz-ch3-q2-default', t.optQuizCh3Q2Default);
      if (document.getElementById('quiz-feedback-ch3') && !currentStudent?.completedChallenges?.ch3) {
        setText('quiz-feedback-ch3', t.quizFeedbackCh3);
      }
      setText('btn-validate-ch3-text', t.btnValidateCh3Text);

      const roleLangIt = document.getElementById('role-lang-btn-it');
      const roleLangEn = document.getElementById('role-lang-btn-en');
      if (roleLangIt) roleLangIt.className = lang === 'it' ? "px-2.5 py-1 text-xs font-bold rounded-md bg-blue-600 text-white shadow-xs transition" : "px-2.5 py-1 text-xs font-bold rounded-md text-slate-600 hover:text-slate-900 transition";
      if (roleLangEn) roleLangEn.className = lang === 'en' ? "px-2.5 py-1 text-xs font-bold rounded-md bg-blue-600 text-white shadow-xs transition" : "px-2.5 py-1 text-xs font-bold rounded-md text-slate-600 hover:text-slate-900 transition";

      applyLockState(isStrictLocked);
      const activeState = getActiveClassroomState();
      updateTrainerBlockUI(activeState.block);
      if (typeof refreshTrainerStudents === 'function') {
        refreshTrainerStudents();
      }
      const teamSelect = document.getElementById('team-select');
      if (teamSelect) switchTeam(teamSelect.value);
    }

    // COPY TO CLIPBOARD FUNCTION
    function copyToClipboard(text) {
      navigator.clipboard.writeText(text);
      showToast(currentLang === 'it' ? "✅ Copiato negli Appunti!" : "✅ Copied to Clipboard!");
    }

    // MODERN WEB GUIDANCE: TAB SWITCHER HELPER FOR HAMBURGER MENU & QUICK JUMP
    function switchTab(key) {
      const map = {
        'intro': 'cover',
        'cover': 'cover',
        'blocco1': 1,
        '1': 1,
        'blocco2': 2,
        '2': 2,
        'pausa': 'break',
        'break': 'break',
        'blocco3': 3,
        '3': 3,
        'blocco4': 4,
        '4': 4,
        'finale': 5,
        'blocco5': 5,
        '5': 5
      };
      const target = map[key] !== undefined ? map[key] : key;
      userSelectBlock(target);
    }

    // SWITCH BLOCK TABS WITH VIEW TRANSITIONS API
    function showBlock(rawBlockId, isBroadcast) {
      // Normalize blockId and aliases (e.g. legacy 'bq' -> 1, 'gemini' -> 1, 'retail' -> 2)
      let blockId = String(rawBlockId || 'cover').trim();
      if (blockId === 'bq' || blockId === 'gemini') blockId = '1';
      else if (blockId === 'retail') blockId = '2';

      // Fallback: if section doesn't exist, default to 'cover'
      if (!document.getElementById(`block-${blockId}`)) {
        blockId = 'cover';
      }

      const updateDOM = () => {
        // Mutually exclusive toggle: explicitly hide all and show only target
        document.querySelectorAll('.block-section').forEach(el => {
          if (el.id === `block-${blockId}`) {
            el.classList.remove('hidden');
          } else {
            el.classList.add('hidden');
          }
        });

        document.querySelectorAll('.tab-btn').forEach(el => {
          el.classList.remove('bg-blue-600', 'text-white');
          el.classList.add('text-slate-600', 'hover:bg-slate-100');
        });

        const activeTab = document.getElementById(`tab-b${blockId}`) || document.getElementById(`tab-${blockId}`);
        if (activeTab) {
          activeTab.classList.remove('text-slate-600', 'hover:bg-slate-100');
          activeTab.classList.add('bg-blue-600', 'text-white');
        }
      };

      if (typeof document.startViewTransition === 'function') {
        document.startViewTransition(() => {
          updateDOM();
        });
      } else {
        updateDOM();
      }

      // Persist active block to shared storage so refreshing / joining students land on current block
      try {
        localStorage.setItem('lux_bq_active_block_v1', String(blockId));
      } catch (e) {}

      // Synchronize SQL file badges in sidebar based on current active block
      updateSidebarChallengeLocks(blockId);

      // Sync active state on Trainer Command Bar
      updateTrainerBlockUI(blockId);
    }

    function updateSidebarChallengeLocks(activeBlockId) {
      const bid = String(activeBlockId);
      // Map challenge number to its corresponding block
      // Ch 1: Block 2 (or later: break, 3, 4, 5)
      // Ch 2: Block 3 (or later: 4, 5)
      // Ch 3: Block 4 (or later: 5)
      const bOrder = ['cover', '1', '2', 'break', '3', '4', '5'];
      const currentIndex = bOrder.indexOf(bid);

      const chConfig = [
        { num: 1, minBlockIndex: bOrder.indexOf('2'), btnId: 'sb-ch-btn-1', lockId: 'sb-ch-lock-1', lblId: 'sb-ch-lbl-1', fileId: 'sb-ch-file-1', activeColor: 'amber' },
        { num: 2, minBlockIndex: bOrder.indexOf('3'), btnId: 'sb-ch-btn-2', lockId: 'sb-ch-lock-2', lblId: 'sb-ch-lbl-2', fileId: 'sb-ch-file-2', activeColor: 'indigo' },
        { num: 3, minBlockIndex: bOrder.indexOf('4'), btnId: 'sb-ch-btn-3', lockId: 'sb-ch-lock-3', lblId: 'sb-ch-lbl-3', fileId: 'sb-ch-file-3', activeColor: 'emerald' }
      ];

      chConfig.forEach(ch => {
        const btn = document.getElementById(ch.btnId);
        const lock = document.getElementById(ch.lockId);
        const lbl = document.getElementById(ch.lblId);
        const file = document.getElementById(ch.fileId);
        if (!btn) return;

        // An SQL challenge file is unlocked if the student docs are unlocked OR the active block has reached or passed that challenge's block
        const isUnlocked = areStudentDocsUnlocked || (currentIndex >= ch.minBlockIndex);

        if (isUnlocked) {
          btn.className = `w-full p-2 rounded-xl bg-${ch.activeColor}-50/80 hover:bg-${ch.activeColor}-100 border border-${ch.activeColor}-300 text-${ch.activeColor}-950 font-mono flex items-center justify-between transition cursor-pointer text-left shadow-2xs`;
          if (lock) {
            lock.innerText = "🔓";
            lock.className = `text-xs ml-1 text-${ch.activeColor}-600 font-bold`;
          }
          if (lbl) lbl.className = `text-[10px] uppercase font-bold text-${ch.activeColor}-700`;
          if (file) file.className = `font-bold text-${ch.activeColor}-950 truncate`;
          btn.onclick = () => openChallengeModal(ch.num);
        } else {
          btn.className = "w-full p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-400 font-mono flex items-center justify-between transition cursor-not-allowed opacity-60 text-left";
          if (lock) {
            lock.innerText = "🔒";
            lock.className = "text-xs ml-1 text-slate-400";
          }
          if (lbl) lbl.className = "text-[10px] uppercase font-bold text-slate-400";
          if (file) file.className = "font-bold text-slate-500 truncate";
          btn.onclick = () => showToast(currentLang === 'it' 
            ? `🔒 Questo file SQL verrà sbloccato nel Blocco ${ch.num === 1 ? '2' : (ch.num === 2 ? '3' : '4')}!` 
            : `🔒 This SQL file unlocks in Block ${ch.num === 1 ? '2' : (ch.num === 2 ? '3' : '4')}!`);
        }
      });
    }

