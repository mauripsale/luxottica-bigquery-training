const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = '/Users/maurizio.ipsale/.gemini/antigravity/brain/099b99d5-ebcd-4f5e-827d-34e1d9da8eee/student_audit';
const TARGET_URL = process.env.AUDIT_URL || `file://${path.resolve(__dirname, 'v2/frontend/index.html')}`;

async function runAudit() {
  console.log('🚀 Avvio audit visivo studente con browser headless...');
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  // Cattura errori e warning di console
  const consoleLogs = [];
  page.on('console', msg => {
    consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
  });
  page.on('pageerror', err => {
    consoleLogs.push(`[PAGE_ERROR] ${err.message}`);
  });

  try {
    // 1. Schermata iniziale / Onboarding / Selezione ruolo
    console.log('📸 1. Navigazione a home page...');
    await page.goto(TARGET_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '01_initial_landing.png'), fullPage: false });

    // Se c'è un modal aperto (es. role selection o onboarding), facciamo screenshot del modal
    console.log('📸 2. Ispezione modali iniziali...');
    await page.screenshot({ path: path.join(OUTPUT_DIR, '02_initial_modal_state.png'), fullPage: false });

    // Chiudi o seleziona ruolo studente se presente
    // Se c'è il role modal aperto, clicca "Continua come Studente"
    await page.evaluate(() => {
      const studentBtn = document.querySelector('button[onclick*="selectRoleStudent"]') || 
                         Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Studente'));
      if (studentBtn) studentBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '03_after_role_select.png'), fullPage: false });

    // Compila ed invia l'onboarding studente
    console.log('📝 Compilazione onboarding studente...');
    await page.evaluate(() => {
      const nameInput = document.getElementById('student-input-name');
      if (nameInput) {
        nameInput.value = 'Marco Rossi';
        nameInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      if (typeof submitStudentOnboarding === 'function') {
        submitStudentOnboarding();
      } else {
        const submitBtn = document.getElementById('btn-submit-onboarding');
        if (submitBtn) submitBtn.click();
      }
      // Assicurati che il dialog sia chiuso per non oscurare i blocchi
      const obModal = document.getElementById('student-onboarding-modal');
      if (obModal && obModal.open) obModal.close();
      const roleModal = document.getElementById('role-selection-modal');
      if (roleModal && roleModal.open) roleModal.close();
      // Per l'audit dei blocchi, permetti lo switch
      window.isStrictLocked = false;
    });
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '04_student_view_cover.png'), fullPage: false });

    // 2. Ispezione Blocco Cover a pagina intera
    await page.screenshot({ path: path.join(OUTPUT_DIR, '05_student_cover_fullpage.png'), fullPage: true });

    // 3. Switch ai vari blocchi didattici per verificare colori, card, contrasti
    const blocks = [
      { id: '1', name: '06_student_block_1' },
      { id: '2', name: '07_student_block_2' },
      { id: 'break', name: '08_student_block_break' },
      { id: '3', name: '09_student_block_3' },
      { id: '4', name: '10_student_block_4' },
      { id: '5', name: '11_student_block_5' }
    ];

    for (const b of blocks) {
      console.log(`📸 Ispezione Blocco ${b.id}...`);
      await page.evaluate((blkId) => {
        if (typeof showBlock === 'function') {
          showBlock(blkId, true);
        } else if (typeof switchTab === 'function') {
          switchTab(blkId);
        }
      }, b.id);
      await new Promise(r => setTimeout(r, 1000));
      await page.screenshot({ path: path.join(OUTPUT_DIR, `${b.name}.png`), fullPage: false });
    }

    // 4. Ispezione Pausa Caffè - 3 sottomenu (DJ, Optics, Turing Roast)
    console.log('📸 Ispezione giochi pausa caffè...');
    await page.evaluate(() => {
      if (typeof switchTab === 'function') switchTab('break');
      if (typeof switchBreakGame === 'function') switchBreakGame('dj');
    });
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '12_break_dj.png'), fullPage: false });

    await page.evaluate(() => {
      if (typeof switchBreakGame === 'function') switchBreakGame('optics');
    });
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '13_break_optics.png'), fullPage: false });

    await page.evaluate(() => {
      if (typeof switchBreakGame === 'function') switchBreakGame('roast');
    });
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '14_break_roast.png'), fullPage: false });

    // 5. Ispezione Modali Principali (Rosetta Stone, Leaderboard, Challenge)
    console.log('📸 Ispezione modali...');
    await page.evaluate(() => {
      if (typeof openRosettaModal === 'function') openRosettaModal();
    });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '15_modal_rosetta.png'), fullPage: false });

    await page.evaluate(() => {
      if (typeof closeRosettaModal === 'function') closeRosettaModal();
      if (typeof openLeaderboardModal === 'function') openLeaderboardModal();
    });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '16_modal_leaderboard.png'), fullPage: false });

    // 6. Test Dark Mode vs Light Mode
    console.log('📸 Test Dark Mode...');
    await page.evaluate(() => {
      if (typeof closeLeaderboardModal === 'function') closeLeaderboardModal();
      if (typeof toggleTheme === 'function') toggleTheme();
    });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '17_student_dark_mode.png'), fullPage: false });

    // Scrivi log console
    fs.writeFileSync(path.join(OUTPUT_DIR, 'console_logs.txt'), consoleLogs.join('\n'));
    console.log('✅ Audit visivo completato! Tutti gli screenshot sono in:', OUTPUT_DIR);

  } catch (err) {
    console.error('❌ Errore durante audit visivo:', err);
  } finally {
    await browser.close();
  }
}

runAudit();
