const puppeteer = require('puppeteer');

async function inspectDOM() {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new'
  });
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:8000', { waitUntil: 'networkidle2' });

  const info = await page.evaluate(() => {
    const ids = Array.from(document.querySelectorAll('[id]')).map(el => el.id);
    const navButtons = Array.from(document.querySelectorAll('button, a, nav [role="tab"]')).map(el => ({
      id: el.id,
      text: el.innerText.trim().replace(/\n/g, ' '),
      onclick: el.getAttribute('onclick') || el.getAttribute('@click')
    }));

    const modals = Array.from(document.querySelectorAll('dialog, .modal, [id*="modal"]')).map(el => el.id);

    const winKeys = Object.keys(window).filter(k => k.includes('manager') || k.includes('trainer') || k.includes('Tab') || k.includes('show') || k.includes('onboard') || k.includes('student') || k.includes('hub'));

    return {
      allIds: ids,
      modals,
      navButtons: navButtons.slice(0, 30),
      winKeys
    };
  });

  console.log('DOM IDs:', info.allIds);
  console.log('Modals:', info.modals);
  console.log('Nav Buttons:', info.navButtons);
  console.log('Window keys:', info.winKeys);

  await browser.close();
}

inspectDOM();
