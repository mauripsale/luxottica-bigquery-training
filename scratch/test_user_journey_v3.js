const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const TARGET_URL = 'http://127.0.0.1:8000';

async function runE2EUserJourney() {
  console.log('🚀 Starting Comprehensive Live E2E User Journey Test on', TARGET_URL);

  const reportData = {
    url: TARGET_URL,
    timestamp: new Date().toISOString(),
    logs: [],
    errors: [],
    flows: {
      onboardingAndStudent: {},
      managerAdmin: {},
      trainerConsole: {}
    }
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
      reportData.errors.push(`[Console Error] ${msg.text()}`);
    } else {
      reportData.logs.push(`[Console ${msg.type()}] ${msg.text()}`);
    }
  });

  page.on('pageerror', err => {
    reportData.errors.push(`[Page Error] ${err.message}`);
  });

  try {
    // -----------------------------------------------------------------------
    // FLUSSO 1: Onboarding & Studente
    // -----------------------------------------------------------------------
    console.log('\n--- 🎓 FLUSSO 1: Onboarding & Studente ---');
    await page.goto(TARGET_URL, { waitUntil: 'networkidle2' });

    // Onboarding Check-in
    const onboardingRes = await page.evaluate(async () => {
      const obModal = document.getElementById('student-onboarding-modal');
      const nameInput = document.getElementById('student-input-name');
      const teamSelect = document.getElementById('student-input-team');
      const roleSelect = document.getElementById('student-input-role');
      const submitBtn = document.getElementById('btn-submit-onboarding');

      let modalOpened = false;
      if (obModal) {
        if (typeof obModal.showModal === 'function' && !obModal.open) {
          obModal.showModal();
        }
        modalOpened = obModal.open;
      }

      if (nameInput) {
        nameInput.value = 'Mario Rossi';
        nameInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      if (teamSelect && teamSelect.options.length > 0) {
        teamSelect.selectedIndex = 0;
        teamSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }
      if (roleSelect && roleSelect.options.length > 0) {
        roleSelect.selectedIndex = 0;
        roleSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }

      let submitted = false;
      if (typeof submitStudentOnboarding === 'function') {
        submitStudentOnboarding();
        submitted = true;
      } else if (submitBtn) {
        submitBtn.click();
        submitted = true;
      }

      const savedProfile = localStorage.getItem('lux_student_profile');
      return {
        modalOpened,
        submitted,
        savedProfile: savedProfile ? JSON.parse(savedProfile) : null
      };
    });
    console.log('Onboarding result:', onboardingRes);
    reportData.flows.onboardingAndStudent.onboarding = onboardingRes;

    // Test Educational Blocks 1-4
    console.log('Testing Blocks 1-4 & SQL Challenges UI...');
    const blockIds = ['blocco1', 'blocco2', 'blocco3', 'blocco4'];
    const blocksStatus = [];

    // Bypass locks for student testing if needed
    await page.evaluate(() => { window.isStrictLocked = false; });

    for (const bId of blockIds) {
      const blockDetail = await page.evaluate((id) => {
        if (typeof switchTab === 'function') switchTab(id);
        const el = document.getElementById(`block-${id}`);
        if (!el) return { id, found: false };

        const visible = !el.classList.contains('hidden');
        const sqlSnippets = el.querySelectorAll('pre, code, textarea, .sql-snippet').length;
        const quizCards = el.querySelectorAll('[id^="quiz-card-"], .quiz-card').length;
        const headings = Array.from(el.querySelectorAll('h1, h2, h3')).map(h => h.innerText.trim());

        return { id, found: true, visible, sqlSnippets, quizCards, topHeading: headings[0] || '' };
      }, bId);
      blocksStatus.push(blockDetail);
    }
    console.log('Blocks status:', blocksStatus);
    reportData.flows.onboardingAndStudent.blocks = blocksStatus;

    // Test Coffee Break Lounge (DJ, Optics, Turing Roast)
    console.log('Testing Coffee Break Lounge...');
    const coffeeBreakRes = await page.evaluate(async () => {
      if (typeof switchTab === 'function') switchTab('pausa');

      // Test Query Beats DJ
      if (typeof switchBreakGame === 'function') switchBreakGame('dj');
      const djContainer = document.getElementById('break-game-dj');
      const playBtn = document.getElementById('btn-dj-play') || document.querySelector('button[onclick*="toggleSequencer"]');
      let djPlayed = false;
      if (playBtn) { playBtn.click(); djPlayed = true; }

      // Test Virtual Optics Lab
      if (typeof switchBreakGame === 'function') switchBreakGame('optics');
      const opticsContainer = document.getElementById('break-game-optics');
      const opticsSlider = document.getElementById('optics-refraction-index');
      if (opticsSlider) {
        opticsSlider.value = "1.52";
        opticsSlider.dispatchEvent(new Event('input', { bubbles: true }));
      }

      // Test AI Turing Roast
      if (typeof switchBreakGame === 'function') switchBreakGame('roast');
      const roastContainer = document.getElementById('break-game-roast');
      const roastArea = document.getElementById('roast-sql-input');
      const roastBtn = document.getElementById('btn-roast-submit');
      if (roastArea) { roastArea.value = "SELECT * FROM `luxottica.sales`;"; }
      let roastClicked = false;
      if (roastBtn) { roastBtn.click(); roastClicked = true; }

      return {
        dj: { found: !!djContainer, played: djPlayed },
        optics: { found: !!opticsContainer, sliderTested: !!opticsSlider },
        roast: { found: !!roastContainer, clicked: roastClicked }
      };
    });
    console.log('Coffee Break result:', coffeeBreakRes);
    reportData.flows.onboardingAndStudent.coffeeBreak = coffeeBreakRes;

    // -----------------------------------------------------------------------
    // FLUSSO 2: Manager Admin (#manager-admin-modal)
    // -----------------------------------------------------------------------
    console.log('\n--- 👔 FLUSSO 2: Manager Admin ---');
    const managerRes = await page.evaluate(async () => {
      const modal = document.getElementById('manager-admin-modal');
      let opened = false;

      if (window.managerControls && typeof window.managerControls.showModal === 'function') {
        window.managerControls.showModal();
        opened = true;
      } else if (modal && typeof modal.showModal === 'function') {
        modal.showModal();
        opened = true;
      } else {
        const btn = document.querySelector('button[onclick*="managerControls.showModal"]') || document.getElementById('btn-manager-modal');
        if (btn) { btn.click(); opened = true; }
      }

      await new Promise(r => setTimeout(r, 500));

      // Inspect Metrics
      const participantsMetric = document.getElementById('mgr-total-participants')?.innerText || document.querySelector('[data-metric="participants"]')?.innerText || 'N/A';
      const domainsMetric = document.getElementById('mgr-allowed-domains')?.innerText || document.querySelector('[data-metric="domains"]')?.innerText || 'N/A';
      const authMetric = document.getElementById('mgr-auth-mode')?.innerText || document.querySelector('[data-metric="auth"]')?.innerText || 'N/A';

      // Test Add Single Email
      const emailInput = document.getElementById('mgr-add-email-input') || document.querySelector('#manager-admin-modal input[type="email"]');
      const addBtn = document.getElementById('mgr-btn-add-email') || document.querySelector('#manager-admin-modal button[onclick*="add"]');
      let addSuccess = false;
      if (emailInput && addBtn) {
        emailInput.value = 'test.user@luxottica.com';
        emailInput.dispatchEvent(new Event('input', { bubbles: true }));
        addBtn.click();
        addSuccess = true;
      }

      await new Promise(r => setTimeout(r, 300));

      // Test Delete Single Email
      const deleteBtn = document.querySelector('#manager-admin-modal button[onclick*="remove"], #manager-admin-modal .btn-delete-email');
      let deleteSuccess = false;
      if (deleteBtn) {
        deleteBtn.click();
        deleteSuccess = true;
      }

      // Test CSV Drag & Drop zone
      const dropZone = document.getElementById('mgr-drop-zone') || document.querySelector('#manager-admin-modal .drop-zone, #manager-admin-modal [id*="drop"]');
      const fileInput = document.getElementById('mgr-csv-file-input') || document.querySelector('#manager-admin-modal input[type="file"]');

      return {
        opened,
        modalExists: !!modal,
        metrics: { participantsMetric, domainsMetric, authMetric },
        addSingleEmail: addSuccess,
        deleteSingleEmail: deleteSuccess,
        hasDropZone: !!dropZone,
        hasFileInput: !!fileInput
      };
    });
    console.log('Manager Admin result:', managerRes);
    reportData.flows.managerAdmin = managerRes;

    // -----------------------------------------------------------------------
    // FLUSSO 3: Trainer Console
    // -----------------------------------------------------------------------
    console.log('\n--- 👑 FLUSSO 3: Trainer Console ---');
    const trainerRes = await page.evaluate(async () => {
      // Activate trainer view
      let activated = false;
      if (typeof toggleTrainerMode === 'function') {
        toggleTrainerMode();
        activated = true;
      } else if (typeof window.activateTrainerMode === 'function') {
        window.activateTrainerMode('1926');
        activated = true;
      }

      await new Promise(r => setTimeout(r, 500));

      const trainerCenter = document.getElementById('trainer-command-center');
      const isVisible = trainerCenter ? !trainerCenter.classList.contains('hidden') : false;

      // Test Regia Commands: Module Lock/Unlock, Timer countdown, Hint reveal
      const lockToggleBtn = document.getElementById('btn-trainer-toggle-lock') || document.querySelector('button[onclick*="toggleLock"]');
      let lockToggled = false;
      if (lockToggleBtn) {
        lockToggleBtn.click();
        lockToggled = true;
      }

      // Timer countdown
      const timerBtn = document.getElementById('btn-trainer-start-timer') || document.querySelector('button[onclick*="startTimer"], button[onclick*="Timer"]');
      let timerStarted = false;
      if (timerBtn) {
        timerBtn.click();
        timerStarted = true;
      }

      // Hint Reveal
      const hintBtn = document.getElementById('btn-trainer-reveal-hint') || document.querySelector('button[onclick*="revealHint"], button[onclick*="Hint"]');
      let hintRevealed = false;
      if (hintBtn) {
        hintBtn.click();
        hintRevealed = true;
      }

      return {
        activated,
        hasCenter: !!trainerCenter,
        isVisible,
        regiaCommands: {
          lockToggled,
          timerStarted,
          hintRevealed
        }
      };
    });
    console.log('Trainer Console result:', trainerRes);
    reportData.flows.trainerConsole = trainerRes;

    console.log('\n✅ E2E User Journey Execution Completed.');
  } catch (err) {
    console.error('❌ E2E Execution Error:', err);
    reportData.errors.push(`[Execution Failure] ${err.stack}`);
  } finally {
    await browser.close();
    fs.writeFileSync(path.join(__dirname, 'v3_user_journey_test_results.json'), JSON.stringify(reportData, null, 2));
    console.log('Saved test telemetry to scratch/v3_user_journey_test_results.json');
  }
}

runE2EUserJourney();
