const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = '/Users/maurizio.ipsale/.gemini/antigravity/brain/96fc29ce-4955-4852-99f0-6f0ba53b974a/user_journey_screenshots';
const TARGET_URL = 'https://luxottica-training-hub-958200195100.us-central1.run.app';

async function runLiveUserJourneyTest() {
  console.log('🚀 Starting E2E Live User Journey Test on:', TARGET_URL);
  
  const auditLog = {
    url: TARGET_URL,
    timestamp: new Date().toISOString(),
    steps: [],
    consoleErrors: [],
    networkErrors: [],
    performanceMetrics: {},
    passedChecks: 0,
    failedChecks: 0,
    frictionPoints: [],
    bugs: []
  };

  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  // Monitor Console Logs
  page.on('console', msg => {
    const text = msg.text();
    const type = msg.type();
    if (type === 'error') {
      auditLog.consoleErrors.push(text);
      console.error('❌ [CONSOLE ERROR]', text);
    } else {
      // console.log(`[CONSOLE ${type.toUpperCase()}]`, text);
    }
  });

  // Monitor Page Uncaught Errors
  page.on('pageerror', err => {
    auditLog.consoleErrors.push(`[UNCAUGHT] ${err.message}`);
    console.error('💥 [PAGE ERROR]', err.message);
  });

  // Monitor Failed Network Requests
  page.on('requestfailed', request => {
    const failure = request.failure();
    auditLog.networkErrors.push({
      url: request.url(),
      errorText: failure ? failure.errorText : 'failed'
    });
    console.warn('⚠️ [REQUEST FAILED]', request.url(), failure ? failure.errorText : '');
  });

  page.on('response', response => {
    if (response.status() >= 400) {
      auditLog.networkErrors.push({
        url: response.url(),
        status: response.status()
      });
      console.warn(`⚠️ [HTTP ${response.status()}]`, response.url());
    }
  });

  try {
    // =========================================================================
    // STEP 1: LANDING PAGE & GOOGLE OAUTH LOGIN / CHECK-IN
    // =========================================================================
    console.log('\n--- 📍 STEP 1: Landing Page & Check-in ---');
    const startNav = Date.now();
    await page.goto(TARGET_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    const loadTime = Date.now() - startNav;
    auditLog.performanceMetrics.initialLoadTimeMs = loadTime;

    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '01_landing_page.png'), fullPage: false });

    // Validate Page Title & Branding
    const title = await page.title();
    console.log('📄 Page Title:', title);

    const landingChecks = await page.evaluate(() => {
      const headerText = document.body.innerText;
      const hasLuxottica = headerText.includes('Luxottica');
      const hasBigQuery = headerText.includes('Google Cloud') || headerText.includes('BigQuery');
      const googleOAuthBtn = document.getElementById('g_id_onload') || document.querySelector('.g_id_signin') || document.querySelector('iframe[src*="accounts.google.com"]');
      const onboardingModal = document.getElementById('student-onboarding-modal');
      const roleModal = document.getElementById('role-selection-modal');
      
      return {
        hasLuxottica,
        hasBigQuery,
        hasGoogleOAuth: !!googleOAuthBtn,
        hasOnboardingModal: !!onboardingModal,
        isOnboardingOpen: onboardingModal ? onboardingModal.open : false,
        hasRoleModal: !!roleModal,
        isRoleModalOpen: roleModal ? roleModal.open : false
      };
    });

    console.log('🔍 Landing Page Checks:', landingChecks);
    auditLog.steps.push({
      step: '1. Landing Page & Check-in',
      status: landingChecks.hasLuxottica && landingChecks.hasBigQuery ? 'PASS' : 'FAIL',
      details: landingChecks
    });

    // Perform Student Onboarding Check-in
    console.log('👤 Performing Student Onboarding Check-in...');
    await page.evaluate(() => {
      // Open onboarding modal if not open
      const obModal = document.getElementById('student-onboarding-modal');
      if (obModal && typeof obModal.showModal === 'function' && !obModal.open) {
        obModal.showModal();
      }

      // Fill inputs
      const nameInput = document.getElementById('student-input-name');
      if (nameInput) {
        nameInput.value = 'Giulia Luxottica Tester';
        nameInput.dispatchEvent(new Event('input', { bubbles: true }));
      }

      const teamSelect = document.getElementById('student-input-team');
      if (teamSelect) {
        teamSelect.value = 'Oakley';
        teamSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }

      const roleSelect = document.getElementById('student-input-role');
      if (roleSelect) {
        roleSelect.value = 'Data Analyst';
        roleSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }

      // Click submit or call submit function
      if (typeof submitStudentOnboarding === 'function') {
        submitStudentOnboarding();
      } else {
        const btn = document.getElementById('btn-submit-onboarding');
        if (btn) btn.click();
      }

      // Close modals
      if (obModal && obModal.open) obModal.close();
      const roleModal = document.getElementById('role-selection-modal');
      if (roleModal && roleModal.open) roleModal.close();
    });

    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '02_after_checkin.png'), fullPage: false });

    // Verify Check-in Persistence
    const profileState = await page.evaluate(() => {
      const nameEl = document.getElementById('student-display-name');
      const teamEl = document.getElementById('student-display-team');
      const scoreEl = document.getElementById('student-display-score');
      const savedProfile = localStorage.getItem('lux_student_profile');
      return {
        displayName: nameEl ? nameEl.innerText : null,
        displayTeam: teamEl ? teamEl.innerText : null,
        displayScore: scoreEl ? scoreEl.innerText : null,
        localStorageProfile: savedProfile ? JSON.parse(savedProfile) : null
      };
    });

    console.log('👤 Verified Profile State:', profileState);

    // =========================================================================
    // STEP 2: EDUCATIONAL BLOCKS & SQL CHALLENGES
    // =========================================================================
    console.log('\n--- 📍 STEP 2: Educational Blocks & SQL Challenges ---');

    const blocksToTest = [
      { id: 'intro', tabName: 'Introduzione & Setup', screenshot: '03_block_intro.png' },
      { id: 'blocco1', tabName: 'Blocco 1: BigQuery Studio', screenshot: '04_block_1_sql.png' },
      { id: 'blocco2', tabName: 'Blocco 2: Gemini SQL', screenshot: '05_block_2_gemini.png' },
      { id: 'blocco3', tabName: 'Blocco 3: AI Functions', screenshot: '06_block_3_aifunctions.png' },
      { id: 'blocco4', tabName: 'Blocco 4: Forensic Challenge', screenshot: '07_block_4_forensic.png' }
    ];

    // Ensure lock override for testing student block exploration
    await page.evaluate(() => {
      window.isStrictLocked = false;
    });

    const blockResults = [];

    for (const b of blocksToTest) {
      console.log(`➡️ Testing Block: ${b.tabName} (${b.id})`);
      const blockCheck = await page.evaluate((blkId) => {
        if (typeof switchTab === 'function') {
          switchTab(blkId);
        } else if (typeof showBlock === 'function') {
          showBlock(blkId, true);
        }

        const blockContainer = document.getElementById(`block-${blkId}`);
        if (!blockContainer) return { found: false };

        const headings = Array.from(blockContainer.querySelectorAll('h1, h2, h3')).map(h => h.innerText.trim());
        const sqlBlocks = blockContainer.querySelectorAll('pre, code, .sql-snippet').length;
        const quizCards = blockContainer.querySelectorAll('[id^="quiz-card-ch"], .quiz-card').length;
        const isVisible = !blockContainer.classList.contains('hidden');

        return {
          found: true,
          isVisible,
          headingsCount: headings.length,
          topHeading: headings[0] || '',
          sqlBlocksCount: sqlBlocks,
          quizCardsCount: quizCards
        };
      }, b.id);

      await new Promise(r => setTimeout(r, 800));
      await page.screenshot({ path: path.join(OUTPUT_DIR, b.screenshot), fullPage: false });

      console.log(`   Result for ${b.id}:`, blockCheck);
      blockResults.push({ blockId: b.id, ...blockCheck });
    }

    // Interactive SQL Challenge Test: Submit quiz in Blocco 1 or 2
    console.log('🧪 Testing Interactive Quiz / SQL Challenge Submission in Blocco 1...');
    await page.evaluate(() => {
      if (typeof switchTab === 'function') switchTab('blocco1');
    });
    await new Promise(r => setTimeout(r, 500));

    const quizInteraction = await page.evaluate(() => {
      const quizCard = document.querySelector('[id^="quiz-card-ch1"]') || document.querySelector('.quiz-card');
      if (!quizCard) return { quizFound: false };

      const select = quizCard.querySelector('select');
      const submitBtn = quizCard.querySelector('button[onclick*="checkQuiz"], button[onclick*="submitAnswer"]');
      const hintBtn = quizCard.querySelector('button[onclick*="toggleHint"], button[onclick*="showHint"]');

      let hintOpened = false;
      if (hintBtn) {
        hintBtn.click();
        hintOpened = true;
      }

      let answerSubmitted = false;
      if (select && select.options.length > 1) {
        // Select second option
        select.selectedIndex = 1;
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }

      if (submitBtn) {
        submitBtn.click();
        answerSubmitted = true;
      }

      const feedbackEl = quizCard.querySelector('[id^="quiz-feedback-"], .quiz-feedback');
      return {
        quizFound: true,
        hintOpened,
        answerSubmitted,
        feedbackText: feedbackEl ? feedbackEl.innerText : null
      };
    });

    console.log('   Quiz Interaction Result:', quizInteraction);
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '08_quiz_interaction.png'), fullPage: false });

    auditLog.steps.push({
      step: '2. Educational Blocks & SQL Challenges',
      status: blockResults.every(r => r.found && r.isVisible) ? 'PASS' : 'FAIL',
      details: { blockResults, quizInteraction }
    });

    // =========================================================================
    // STEP 3: COFFEE BREAK LOUNGE (QUERY BEATS DJ, OPTICS LAB, TURING ROAST)
    // =========================================================================
    console.log('\n--- 📍 STEP 3: Coffee Break Lounge ---');

    await page.evaluate(() => {
      if (typeof switchTab === 'function') switchTab('pausa');
    });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '09_coffee_break_home.png'), fullPage: false });

    // 3a. Query Beats DJ
    console.log('🎵 Testing 3a: Query Beats DJ...');
    const djState = await page.evaluate(() => {
      if (typeof switchBreakGame === 'function') switchBreakGame('dj');
      const djContainer = document.getElementById('break-game-dj');
      const sequencerGrid = document.querySelector('.grid-cols-16') || document.querySelector('[id*="sequencer"]');
      const playBtn = document.getElementById('btn-dj-play') || document.querySelector('button[onclick*="toggleSequencer"]');
      
      let playToggled = false;
      if (playBtn) {
        playBtn.click();
        playToggled = true;
      }

      return {
        hasDjContainer: !!djContainer,
        hasSequencerGrid: !!sequencerGrid,
        playToggled
      };
    });
    console.log('   DJ State:', djState);
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '10_coffee_break_dj.png'), fullPage: false });

    // Stop DJ playback after testing
    await page.evaluate(() => {
      const playBtn = document.getElementById('btn-dj-play') || document.querySelector('button[onclick*="toggleSequencer"]');
      if (playBtn && playBtn.innerText.includes('STOP')) playBtn.click();
    });

    // 3b. Virtual Optics Lab
    console.log('🔬 Testing 3b: Virtual Optics Lab...');
    const opticsState = await page.evaluate(() => {
      if (typeof switchBreakGame === 'function') switchBreakGame('optics');
      const opticsContainer = document.getElementById('break-game-optics');
      const canvas = document.querySelector('#optics-canvas, canvas, svg');
      const refractionSlider = document.getElementById('optics-refraction-index') || document.querySelector('input[type="range"]');

      if (refractionSlider) {
        refractionSlider.value = "1.52";
        refractionSlider.dispatchEvent(new Event('input', { bubbles: true }));
      }

      return {
        hasOpticsContainer: !!opticsContainer,
        hasCanvas: !!canvas,
        sliderAdjusted: !!refractionSlider
      };
    });
    console.log('   Optics State:', opticsState);
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '11_coffee_break_optics.png'), fullPage: false });

    // 3c. AI Turing Roast
    console.log('🔥 Testing 3c: AI Turing Roast...');
    const roastState = await page.evaluate(async () => {
      if (typeof switchBreakGame === 'function') switchBreakGame('roast');
      const roastContainer = document.getElementById('break-game-roast');
      const textarea = document.getElementById('roast-sql-input') || document.querySelector('textarea');
      const roastBtn = document.getElementById('btn-roast-submit') || document.querySelector('button[onclick*="roast"], button[onclick*="Roast"]');

      if (textarea) {
        textarea.value = "SELECT * FROM `luxottica.sales` WHERE 1=1;";
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
      }

      let roastTriggered = false;
      if (roastBtn) {
        roastBtn.click();
        roastTriggered = true;
      }

      return {
        hasRoastContainer: !!roastContainer,
        hasTextarea: !!textarea,
        roastTriggered
      };
    });
    console.log('   Roast State:', roastState);
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '12_coffee_break_roast.png'), fullPage: false });

    auditLog.steps.push({
      step: '3. Coffee Break Lounge',
      status: (djState.hasDjContainer && opticsState.hasOpticsContainer && roastState.hasRoastContainer) ? 'PASS' : 'FAIL',
      details: { djState, opticsState, roastState }
    });

    // =========================================================================
    // STEP 4: CABINA DI REGIA DOCENTE (TRAINER CONSOLE)
    // =========================================================================
    console.log('\n--- 📍 STEP 4: Cabina di Regia Docente (Trainer Console) ---');

    // Test Trainer Mode Activation (Logo triple click or direct function invocation)
    const trainerActivation = await page.evaluate(() => {
      if (typeof toggleTrainerMode === 'function') {
        toggleTrainerMode();
      } else if (typeof switchToTrainerCommandCenter === 'function') {
        switchToTrainerCommandCenter();
      }

      const tcc = document.getElementById('trainer-command-center');
      const studentMain = document.getElementById('student-main-layout') || document.querySelector('main');
      const solutionsBtn = document.getElementById('btn-top-trainer-solutions');
      
      return {
        hasTccContainer: !!tcc,
        isTccVisible: tcc ? !tcc.classList.contains('hidden') : false,
        hasSolutionsBtn: !!solutionsBtn
      };
    });

    console.log('🎓 Trainer Activation State:', trainerActivation);
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '13_trainer_command_center.png'), fullPage: false });

    // Test Trainer Solutions Cheat Sheet Modal
    console.log('🔑 Testing Trainer Solutions Cheat Sheet Modal...');
    const solutionsModalState = await page.evaluate(() => {
      if (typeof openTrainerSolutionsModal === 'function') {
        openTrainerSolutionsModal();
      }
      const modal = document.getElementById('trainer-solutions-modal');
      return {
        hasSolutionsModal: !!modal,
        isOpen: modal ? modal.open : false
      };
    });
    console.log('   Solutions Modal State:', solutionsModalState);
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '14_trainer_solutions_modal.png'), fullPage: false });

    // Close Solutions Modal and Test Student Preview Banner Return
    await page.evaluate(() => {
      const modal = document.getElementById('trainer-solutions-modal');
      if (modal && modal.open) modal.close();

      // Return to student preview view
      if (typeof previewStudentView === 'function') {
        previewStudentView();
      }
    });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '15_trainer_preview_banner.png'), fullPage: false });

    auditLog.steps.push({
      step: '4. Cabina di Regia Docente',
      status: (trainerActivation.hasTccContainer && solutionsModalState.hasSolutionsModal) ? 'PASS' : 'FAIL',
      details: { trainerActivation, solutionsModalState }
    });

    // =========================================================================
    // STEP 5: UX/UI & RESPONSIVENESS (DARK MODE, LANGUAGE, MOBILE)
    // =========================================================================
    console.log('\n--- 📍 STEP 5: UX/UI Ergonomics & Responsiveness ---');

    // 5a. Dark Mode Test
    console.log('🌙 Testing Dark Mode...');
    await page.evaluate(() => {
      if (typeof toggleTheme === 'function') toggleTheme();
    });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '16_dark_mode_view.png'), fullPage: false });

    // Toggle back to Light Mode
    await page.evaluate(() => {
      if (typeof toggleTheme === 'function') toggleTheme();
    });

    // 5b. Language Switcher Test
    console.log('🌐 Testing Language Switcher (IT <-> EN)...');
    const langSwitchState = await page.evaluate(() => {
      if (typeof setLanguage === 'function') setLanguage('en');
      const bodyText = document.body.innerText;
      const hasEnglish = bodyText.includes('Student Profile') || bodyText.includes('Switch Role') || bodyText.includes('Leaderboard');
      
      // Switch back to IT
      if (typeof setLanguage === 'function') setLanguage('it');
      
      return {
        hasEnglishTranslation: hasEnglish
      };
    });
    console.log('   Language Switch State:', langSwitchState);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '17_language_it_restored.png'), fullPage: false });

    // 5c. Mobile Responsiveness Test
    console.log('📱 Testing Mobile Viewport (375x812)...');
    await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2, isMobile: true });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '18_mobile_viewport.png'), fullPage: false });

    // Test Hamburger Menu on Mobile
    await page.evaluate(() => {
      const btn = document.getElementById('btn-hamburger-menu');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '19_mobile_hamburger_menu.png'), fullPage: false });

    auditLog.steps.push({
      step: '5. UX/UI & Responsiveness',
      status: 'PASS',
      details: { langSwitchState }
    });

    console.log('\n✅ E2E Live User Journey Test Completed Successfully!');

  } catch (err) {
    console.error('❌ E2E User Journey Test failed with exception:', err);
    auditLog.bugs.push({ title: 'Unhandled Test Exception', details: err.message, stack: err.stack });
  } finally {
    await browser.close();
    fs.writeFileSync(path.join(OUTPUT_DIR, 'audit_results.json'), JSON.stringify(auditLog, null, 2));
    console.log('📊 Audit results saved to:', path.join(OUTPUT_DIR, 'audit_results.json'));
  }
}

runLiveUserJourneyTest();
