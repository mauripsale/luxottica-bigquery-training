    // =========================================================================
    // COFFEE BREAK GAMES REGIA CONTROLLER & ENGINES (DJ, OPTICS LAB, ROAST)
    // =========================================================================
    let currentBreakGame = 'free'; // 'free' | 'dj' | 'optics' | 'roast'

    function switchBreakGame(gameId, isRemote = false) {
      const tabs = ['dj', 'optics', 'roast'];
      tabs.forEach(t => {
        const btn = document.getElementById(`btn-tab-game-${t}`);
        const panel = document.getElementById(`game-container-${t}`);
        if (panel) {
          if (t === gameId) {
            panel.classList.remove('hidden');
          } else {
            panel.classList.add('hidden');
          }
        }
        if (btn) {
          if (t === gameId) {
            btn.className = "flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm cursor-pointer";
          } else {
            btn.className = "flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer";
          }
        }
      });

      // Special init triggers when switching
      if (gameId === 'optics') {
        requestAnimationFrame(() => {
          if (typeof OpticsLab !== 'undefined' && OpticsLab.draw) OpticsLab.draw();
          else if (window.OpticsLab && window.OpticsLab.draw) window.OpticsLab.draw();
        });
      }
    }

    function handleRemoteBreakGameSync(gameId) {
      currentBreakGame = gameId || 'free';
      const statusText = document.getElementById('break-mode-status-text');
      const lang = (typeof currentLang !== 'undefined' && currentLang) ? currentLang : 'it';
      if (statusText) {
        if (gameId === 'free') {
          statusText.innerText = lang === 'it' ? 'Libera Scelta Studente' : 'Student Free Choice';
          statusText.className = 'text-xs font-black text-amber-600 dark:text-amber-400';
        } else if (gameId === 'dj') {
          statusText.innerText = lang === 'it' ? 'Regia: Query Beats DJ 🎛️' : 'Host: Query Beats DJ 🎛️';
          statusText.className = 'text-xs font-black text-blue-600 dark:text-blue-400';
        } else if (gameId === 'optics') {
          statusText.innerText = lang === 'it' ? 'Regia: Virtual Optics Lab 🔬' : 'Host: Virtual Optics Lab 🔬';
          statusText.className = 'text-xs font-black text-cyan-600 dark:text-cyan-400';
        } else if (gameId === 'roast') {
          statusText.innerText = lang === 'it' ? 'Regia: AI Turing Roast 🌶️' : 'Host: AI Turing Roast 🌶️';
          statusText.className = 'text-xs font-black text-rose-600 dark:text-rose-400';
        }
      }

      if (gameId !== 'free') {
        switchBreakGame(gameId, true);
        showToast(lang === 'it' 
          ? `☕ Il Trainer ha sincronizzato il gioco di pausa: ${gameId.toUpperCase()}!` 
          : `☕ Trainer synced break game: ${gameId.toUpperCase()}!`);
      }
    }

    function trainerSetBreakGame(gameId) {
      currentBreakGame = gameId;
      publishBroadcast({
        action: 'set_break_game',
        game: gameId
      });

      // Update trainer regia UI badges and buttons
      const badge = document.getElementById('trainer-break-game-active-badge');
      if (badge) {
        const labels = {
          'free': 'Libera Scelta',
          'dj': 'Forzato: Beats DJ',
          'optics': 'Forzato: Optics Lab',
          'roast': 'Forzato: Turing Roast'
        };
        badge.innerText = labels[gameId] || gameId;
      }

      const btns = ['free', 'dj', 'optics', 'roast'];
      btns.forEach(b => {
        const el = document.getElementById(`btn-tb-game-${b}`);
        if (!el) return;
        if (b === gameId) {
          el.className = "p-2.5 rounded-xl bg-amber-500/15 border-2 border-amber-500 text-amber-900 dark:text-amber-200 text-xs font-bold transition flex flex-col items-center cursor-pointer text-center";
        } else {
          el.className = "p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex flex-col items-center cursor-pointer text-center";
        }
      });

      showToast(currentLang === 'it' 
        ? `☕ Regia giochi aggiornata: ${gameId.toUpperCase()}` 
        : `☕ Break game broadcasted: ${gameId.toUpperCase()}`);
    }

