const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = '/Users/maurizio.ipsale/.gemini/antigravity/brain/96fc29ce-4955-4852-99f0-6f0ba53b974a/user_journey_screenshots';
const TARGET_URL = 'https://luxottica-training-hub-958200195100.us-central1.run.app';

async function runDetailedBlockTest() {
  console.log('🚀 Running Detailed Block & Challenge Test...');

  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  await page.goto(TARGET_URL, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1000));

  // 1. Verify default lock enforcement
  console.log('🔒 1. Verifying default lock behavior...');
  const defaultLockCheck = await page.evaluate(() => {
    // Attempt block switch without unlocking
    userSelectBlock(1);
    const activeBlock1 = document.getElementById('block-1');
    const isBlock1Visible = activeBlock1 ? !activeBlock1.classList.contains('hidden') : false;
    return {
      isStrictLocked: window.isStrictLocked,
      isBlock1Visible
    };
  });
  console.log('   Default Lock Check:', defaultLockCheck);

  // 2. Unlock free navigation
  console.log('🔓 2. Unlocking navigation for full block audit...');
  await page.evaluate(() => {
    window.isStrictLocked = false;
    updateSyncBadge(false);
  });

  const blocks = [
    { key: 'cover', id: 'block-cover', name: '01_block_cover' },
    { key: 1, id: 'block-1', name: '02_block_1_bq_studio' },
    { key: 2, id: 'block-2', name: '03_block_2_gemini_sql' },
    { key: 'break', id: 'block-break', name: '04_block_break_coffee' },
    { key: 3, id: 'block-3', name: '05_block_3_ai_functions' },
    { key: 4, id: 'block-4', name: '06_block_4_forensic_challenge' },
    { key: 5, id: 'block-5', name: '07_block_5_conclusions_feedback' }
  ];

  const auditSummary = [];

  for (const b of blocks) {
    console.log(`📸 Inspecting Block: ${b.id}...`);
    const res = await page.evaluate((targetKey, targetId) => {
      showBlock(targetKey, false);
      const el = document.getElementById(targetId);
      if (!el) return { exists: false };

      const isVisible = !el.classList.contains('hidden');
      const titleEl = el.querySelector('h1, h2, h3');
      const titleText = titleEl ? titleEl.innerText.trim() : 'No Title';
      const sqlSnippets = el.querySelectorAll('pre, code, .sql-snippet').length;
      const quizzes = el.querySelectorAll('[id^="quiz-card-ch"]').length;

      return {
        exists: true,
        isVisible,
        titleText,
        sqlSnippets,
        quizzes
      };
    }, b.key, b.id);

    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(OUTPUT_DIR, `${b.name}.png`), fullPage: false });

    console.log(`   Block ${b.id}:`, res);
    auditSummary.push({ block: b.id, ...res });
  }

  // 3. Test Quiz Answer Submission & Score Update in Blocco 1
  console.log('🏆 3. Testing Quiz Submission & Score Update in Blocco 1...');
  await page.evaluate(() => {
    showBlock(1, false);
  });
  await new Promise(r => setTimeout(r, 500));

  const quizResult = await page.evaluate(() => {
    const card = document.querySelector('#block-1 [id^="quiz-card-ch"]') || document.querySelector('[id^="quiz-card-ch1"]');
    if (!card) return { foundCard: false };

    const select = card.querySelector('select');
    const submitBtn = card.querySelector('button[onclick*="checkQuiz"]');
    
    let answerText = '';
    if (select) {
      // Find correct option or pick index 1
      select.selectedIndex = 1;
      answerText = select.options[select.selectedIndex].text;
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }

    if (submitBtn) {
      submitBtn.click();
    }

    const scoreEl = document.getElementById('student-display-score');

    return {
      foundCard: true,
      cardId: card.id,
      selectedAnswer: answerText,
      updatedScore: scoreEl ? scoreEl.innerText : null
    };
  });

  console.log('   Quiz Submission Result:', quizResult);
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '08_quiz_submitted.png'), fullPage: false });

  // 4. Test Coffee Break Games
  console.log('☕ 4. Testing Coffee Break Lounge...');
  await page.evaluate(() => {
    showBlock('break', false);
  });
  await new Promise(r => setTimeout(r, 500));

  // Query Beats DJ
  await page.evaluate(() => {
    if (typeof switchBreakGame === 'function') switchBreakGame('dj');
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '09_break_dj_detail.png'), fullPage: false });

  // Optics Lab
  await page.evaluate(() => {
    if (typeof switchBreakGame === 'function') switchBreakGame('optics');
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '10_break_optics_detail.png'), fullPage: false });

  // AI Turing Roast
  await page.evaluate(() => {
    if (typeof switchBreakGame === 'function') switchBreakGame('roast');
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '11_break_roast_detail.png'), fullPage: false });

  // 5. Test Rosetta Stone Modal
  console.log('📖 5. Testing Rosetta Stone Modal...');
  await page.evaluate(() => {
    if (typeof openRosettaModal === 'function') openRosettaModal();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '12_rosetta_modal.png'), fullPage: false });

  // 6. Test Live Leaderboard Modal
  console.log('🏆 6. Testing Leaderboard Modal...');
  await page.evaluate(() => {
    if (typeof closeRosettaModal === 'function') closeRosettaModal();
    if (typeof openLeaderboardModal === 'function') openLeaderboardModal();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '13_leaderboard_modal.png'), fullPage: false });

  await browser.close();

  fs.writeFileSync(path.join(OUTPUT_DIR, 'detailed_block_summary.json'), JSON.stringify(auditSummary, null, 2));
  console.log('✅ Detailed Block Test Completed!');
}

runDetailedBlockTest();
