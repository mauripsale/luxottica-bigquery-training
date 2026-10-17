const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const TARGET_URL = 'http://127.0.0.1:8000';

async function runDetailedE2E() {
  console.log('🚀 Executing Live E2E User Journey Audit on:', TARGET_URL);

  const auditLog = {
    url: TARGET_URL,
    timestamp: new Date().toISOString(),
    consoleErrors: [],
    pageErrors: [],
    networkErrors: [],
    steps: []
  };

  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      auditLog.consoleErrors.push(msg.text());
      console.error('❌ [Console Error]', msg.text());
    }
  });

  page.on('pageerror', err => {
    auditLog.pageErrors.push(err.message);
    console.error('💥 [Page Error]', err.message);
  });

  page.on('response', res => {
    if (res.status() >= 400) {
      auditLog.networkErrors.push({ url: res.url(), status: res.status() });
      console.warn(`⚠️ [HTTP ${res.status()}]`, res.url());
    }
  });

  try {
    await page.goto(TARGET_URL, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1000));

    // =========================================================================
    // 1. FLUSSO ONBOARDING & STUDENTE
    // =========================================================================
    console.log('\n========================================');
    console.log('🎓 FLUSSO 1: Onboarding & Studente');
    console.log('========================================');

    const onboardingStep = await page.evaluate(async () => {
      // Check onboarding modal or trigger
      if (typeof openOnboardingModal === 'function') {
        openOnboardingModal(true);
      } else {
        const modal = document.getElementById('student-onboarding-modal');
        if (modal && typeof modal.showModal === 'function') modal.showModal();
      }

      const modal = document.getElementById('student-onboarding-modal');
      const isOpened = modal ? modal.open : false;

      const nameInput = document.getElementById('student-input-name');
      const emailInput = document.getElementById('student-input-email');
      const teamSelect = document.getElementById('student-input-team');
      const roleSelect = document.getElementById('student-input-role');

      if (nameInput) {
        nameInput.value = 'Giulia Rossi';
        nameInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      if (emailInput) {
        emailInput.value = 'giulia.rossi@luxottica.com';
        emailInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      if (teamSelect && teamSelect.options.length > 0) {
        teamSelect.selectedIndex = 1; // Oakley
        teamSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }
      if (roleSelect && roleSelect.options.length > 0) {
        roleSelect.selectedIndex = 1;
        roleSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }

      // Submit
      if (typeof submitStudentOnboarding === 'function') {
        submitStudentOnboarding();
      } else {
        const btn = document.getElementById('btn-submit-onboarding');
        if (btn) btn.click();
      }

      await new Promise(r => setTimeout(r, 500));

      const profileBadge = document.getElementById('student-display-name')?.innerText || document.getElementById('student-profile-trigger')?.innerText || '';
      const savedProfile = localStorage.getItem('lux_student_profile');

      return {
        modalOpened: isOpened,
        profileBadge,
        savedProfile: savedProfile ? JSON.parse(savedProfile) : null
      };
    });

    console.log('Onboarding step:', onboardingStep);
    auditLog.steps.push({ name: 'Onboarding Check-in', result: onboardingStep });

    // Test Educational Blocks 1-4 & SQL Challenges UI
    console.log('\n--- Testing Educational Blocks 1-4 & SQL Challenges ---');
    const tabsToTest = [
      { key: 'intro', title: 'Introduzione' },
      { key: 'blocco1', title: 'Blocco 1: BigQuery Studio' },
      { key: 'blocco2', title: 'Blocco 2: Gemini SQL' },
      { key: 'blocco3', title: 'Blocco 3: AI Functions' },
      { key: 'blocco4', title: 'Blocco 4: Forensic Challenge' }
    ];

    const blockResults = [];
    for (const t of tabsToTest) {
      const res = await page.evaluate(async (tabKey) => {
        if (typeof switchTab === 'function') switchTab(tabKey);
        await new Promise(r => setTimeout(r, 300));

        // Find visible section
        const main = document.querySelector('main') || document.body;
        const visibleSection = Array.from(main.querySelectorAll('section, div[id*="block"], div[id*="tab"]'))
          .find(el => !el.classList.contains('hidden') && el.offsetHeight > 0);

        const heading = document.querySelector('h1, h2, h3')?.innerText || '';
        const sqlBlocks = document.querySelectorAll('pre, code, textarea').length;
        const buttons = document.querySelectorAll('button').length;

        // Find quiz cards or sql challenge components
        const quizCards = Array.from(document.querySelectorAll('.quiz-card, [id*="quiz"], [id*="challenge"]'))
          .filter(el => el.offsetHeight > 0)
          .map(el => ({ id: el.id, class: el.className, text: el.innerText.substring(0, 100) }));

        return {
          tabKey,
          hasVisibleSection: !!visibleSection,
          heading,
          sqlBlocksCount: sqlBlocks,
          buttonsCount: buttons,
          activeQuizCards: quizCards
        };
      }, t.key);

      console.log(`Tab [${t.key}] (${t.title}):`, res);
      blockResults.push(res);
    }
    auditLog.steps.push({ name: 'Educational Blocks 1-4', result: blockResults });

    // Test Coffee Break Lounge
    console.log('\n--- Testing Coffee Break Lounge ---');
    const coffeeRes = await page.evaluate(async () => {
      if (typeof switchTab === 'function') switchTab('pausa');
      await new Promise(r => setTimeout(r, 500));

      // 1. DJ
      if (typeof switchBreakGame === 'function') switchBreakGame('dj');
      await new Promise(r => setTimeout(r, 300));
      const djEl = document.getElementById('break-game-dj') || document.querySelector('[id*="dj"]');
      const djPlayBtn = document.getElementById('btn-dj-play') || document.querySelector('button[onclick*="toggleSequencer"], button[onclick*="Play"], button[onclick*="play"]');
      let djClick = false;
      if (djPlayBtn) { djPlayBtn.click(); djClick = true; }

      // 2. Optics
      if (typeof switchBreakGame === 'function') switchBreakGame('optics');
      await new Promise(r => setTimeout(r, 300));
      const opticsEl = document.getElementById('break-game-optics') || document.querySelector('[id*="optics"]');
      const opticsCanvas = document.querySelector('canvas, svg, #optics-canvas');
      const opticsSlider = document.querySelector('input[type="range"]');

      // 3. Turing Roast
      if (typeof switchBreakGame === 'function') switchBreakGame('roast');
      await new Promise(r => setTimeout(r, 300));
      const roastEl = document.getElementById('break-game-roast') || document.querySelector('[id*="roast"]');
      const roastTextarea = document.querySelector('#break-game-roast textarea, textarea[id*="roast"]');
      const roastSubmit = document.querySelector('#break-game-roast button, button[onclick*="roast"], button[onclick*="Roast"]');

      let roastSubmitClicked = false;
      if (roastTextarea && roastSubmit) {
        roastTextarea.value = "SELECT * FROM `luxottica.sales` WHERE year = 2026;";
        roastTextarea.dispatchEvent(new Event('input', { bubbles: true }));
        roastSubmit.click();
        roastSubmitClicked = true;
      }

      return {
        dj: { visible: djEl ? !djEl.classList.contains('hidden') : false, playClicked: djClick },
        optics: { visible: opticsEl ? !opticsEl.classList.contains('hidden') : false, hasCanvas: !!opticsCanvas, hasSlider: !!opticsSlider },
        roast: { visible: roastEl ? !roastEl.classList.contains('hidden') : false, submitted: roastSubmitClicked }
      };
    });
    console.log('Coffee Break Lounge result:', coffeeRes);
    auditLog.steps.push({ name: 'Coffee Break Lounge', result: coffeeRes });

    // =========================================================================
    // 2. FLUSSO MANAGER ADMIN (#manager-admin-modal)
    // =========================================================================
    console.log('\n========================================');
    console.log('👔 FLUSSO 2: Manager Admin (#manager-admin-modal)');
    console.log('========================================');

    const managerAdminStep = await page.evaluate(async () => {
      const modal = document.getElementById('manager-admin-modal');
      
      // Open modal
      let opened = false;
      if (window.managerControls && typeof window.managerControls.openManagerModal === 'function') {
        window.managerControls.openManagerModal();
        opened = true;
      } else if (window.managerControls && typeof window.managerControls.showModal === 'function') {
        window.managerControls.showModal();
        opened = true;
      } else if (modal && typeof modal.showModal === 'function') {
        modal.showModal();
        opened = true;
      }

      await new Promise(r => setTimeout(r, 500));

      const isModalOpen = modal ? modal.open : false;

      // Extract metrics
      const modalText = modal ? modal.innerText : '';
      const hasParticipants = modalText.includes('Partecipanti') || modalText.includes('Utenti') || modalText.includes('Allowlist');
      const hasDomains = modalText.includes('Domini') || modalText.includes('luxottica.com') || modalText.includes('Domain');
      const hasAuthMode = modalText.includes('Auth') || modalText.includes('Modalità') || modalText.includes('OAuth');

      // Test Single Email Addition
      const emailInput = modal?.querySelector('input[type="email"], input[placeholder*="email"], input[id*="email"]');
      const addBtn = modal?.querySelector('button[onclick*="add"], button[id*="add"], button[type="submit"]');

      let addClicked = false;
      if (emailInput && addBtn) {
        emailInput.value = 'qa.test.user@luxottica.com';
        emailInput.dispatchEvent(new Event('input', { bubbles: true }));
        addBtn.click();
        addClicked = true;
      }

      await new Promise(r => setTimeout(r, 400));

      // Test Delete Single Email
      const removeBtns = Array.from(modal?.querySelectorAll('button') || [])
        .filter(b => b.innerText.includes('Elimina') || b.innerText.includes('Rimuovi') || b.innerText.includes('🗑️') || b.getAttribute('onclick')?.includes('remove'));

      let removeClicked = false;
      if (removeBtns.length > 0) {
        removeBtns[0].click();
        removeClicked = true;
      }

      // Test Drag & Drop zone
      const dropZone = modal?.querySelector('.drop-zone, [id*="drop"], [class*="drop"], [id*="csv"]');
      const fileInput = modal?.querySelector('input[type="file"]');

      return {
        modalOpened: isModalOpen,
        metrics: {
          hasParticipants,
          hasDomains,
          hasAuthMode
        },
        singleEmailAddTested: addClicked,
        singleEmailDeleteTested: removeClicked,
        dropZoneFound: !!dropZone,
        fileInputFound: !!fileInput
      };
    });

    console.log('Manager Admin result:', managerAdminStep);
    auditLog.steps.push({ name: 'Manager Admin Flow', result: managerAdminStep });

    // =========================================================================
    // 3. FLUSSO TRAINER CONSOLE
    // =========================================================================
    console.log('\n========================================');
    console.log('👑 FLUSSO 3: Trainer Console');
    console.log('========================================');

    const trainerStep = await page.evaluate(async () => {
      // Open PIN modal or activate trainer mode directly
      let toggleResult = false;
      if (typeof toggleTrainerMode === 'function') {
        toggleTrainerMode();
        toggleResult = true;
      }

      await new Promise(r => setTimeout(r, 500));

      // Check PIN Modal
      const pinModal = document.getElementById('trainer-pin-modal');
      if (pinModal && pinModal.open) {
        const pinInput = document.getElementById('trainer-modal-pin');
        const submitBtn = pinModal.querySelector('button[type="submit"], button[onclick*="verify"]');
        if (pinInput) {
          pinInput.value = '1926';
          pinInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
        if (submitBtn) {
          submitBtn.click();
        } else if (typeof verifyTrainerPin === 'function') {
          verifyTrainerPin();
        }
        await new Promise(r => setTimeout(r, 500));
      }

      const trainerCenter = document.getElementById('trainer-command-center');
      const isVisible = trainerCenter ? !trainerCenter.classList.contains('hidden') : false;

      // Test Regia Commands: Module Lock/Unlock, Timer, Hints
      let lockControlClicked = false;
      const lockBtn = document.getElementById('btn-lock-control') || document.querySelector('button[onclick*="Lock"], button[onclick*="lock"]');
      if (lockBtn) {
        lockBtn.click();
        lockControlClicked = true;
      }

      let timerControlClicked = false;
      if (typeof trainerStartTimer === 'function') {
        trainerStartTimer(15);
        timerControlClicked = true;
      } else {
        const timerBtn = document.querySelector('button[onclick*="Timer"], button[onclick*="timer"]');
        if (timerBtn) { timerBtn.click(); timerControlClicked = true; }
      }

      let hintControlClicked = false;
      if (typeof trainerToggleHint === 'function') {
        trainerToggleHint(1);
        hintControlClicked = true;
      } else {
        const hintBtn = document.querySelector('button[onclick*="Hint"], button[onclick*="hint"]');
        if (hintBtn) { hintBtn.click(); hintControlClicked = true; }
      }

      return {
        trainerCenterFound: !!trainerCenter,
        isVisible,
        regiaCommands: {
          moduleLock: lockControlClicked,
          timerCountdown: timerControlClicked,
          hintReveal: hintControlClicked
        }
      };
    });

    console.log('Trainer Console result:', trainerStep);
    auditLog.steps.push({ name: 'Trainer Console Flow', result: trainerStep });

    console.log('\n✅ Live Audit Completed!');
  } catch (err) {
    console.error('❌ E2E Exception:', err);
    auditLog.pageErrors.push(err.stack);
  } finally {
    await browser.close();
    fs.writeFileSync(path.join(__dirname, 'full_e2e_user_journey_telemetry.json'), JSON.stringify(auditLog, null, 2));
    console.log('Saved telemetry to scratch/full_e2e_user_journey_telemetry.json');
  }
}

runDetailedE2E();
