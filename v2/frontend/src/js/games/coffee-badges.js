    // -------------------------------------------------------------------------
    // CLASSROOM COMPETITION COFFEE BREAK AWARDS SYSTEM (+50 / +150 PT BONUSES)
    // -------------------------------------------------------------------------
    function awardCoffeeBadge(gameKey, points, badgeTitle) {
      if (!currentStudent || !currentStudent.id) return;
      currentStudent.completedChallenges = currentStudent.completedChallenges || {};
      const challengeKey = `coffee_${gameKey}`;
      
      // Prevent duplicate scoring
      if (currentStudent.completedChallenges[challengeKey]) return;

      currentStudent.completedChallenges[challengeKey] = true;
      currentStudent.score = (currentStudent.score || 0) + points;
      saveStudentProfile();
      applyStudentProfileUI();
      registerStudentInClassroom(currentStudent);
      broadcastScoreUpdate(challengeKey, points);

      // Celebrate award
      fireConfettiAnimation();
      updateCoffeeBadgesUI();
      showToast(currentLang === 'it' 
        ? `🏆 Sfida Coffee Break Vinta! Hai ottenuto "${badgeTitle}" e +${points} pt per ${currentStudent.teamKey ? currentStudent.teamKey.toUpperCase() : 'la tua squadra'}!` 
        : `🏆 Coffee Break Challenge Won! You earned "${badgeTitle}" and +${points} pts!`);
    }

    function updateCoffeeBadgesUI() {
      if (!currentStudent || !currentStudent.completedChallenges) return;
      
      const badges = [
        { key: 'dj', chKey: 'coffee_dj' },
        { key: 'optics', chKey: 'coffee_optics' },
        { key: 'roast', chKey: 'coffee_roast' }
      ];

      badges.forEach(b => {
        const isDone = !!currentStudent.completedChallenges[b.chKey];
        const statusEl = document.getElementById(`coffee-badge-${b.key}-status`);
        const cardEl = document.getElementById(`coffee-badge-card-${b.key}`);
        if (statusEl && isDone) {
          statusEl.innerText = currentLang === 'it' ? "Vinto! +50 pt ✅" : "Won! +50 pt ✅";
          statusEl.className = "inline-block px-2.5 py-1 rounded-lg text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 shadow-xs";
        }
        if (cardEl && isDone) {
          cardEl.classList.add('ring-2', 'ring-emerald-500/50');
        }
      });
    }

    // Initialize games on page ready
    document.addEventListener('DOMContentLoaded', () => {
      if (window.QueryBeats) QueryBeats.init();
      if (window.OpticsLab) OpticsLab.draw();
      updateCoffeeBadgesUI();
    });
