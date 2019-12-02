const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({width: 1920, height: 1080});
  await page.goto('https://github.com');
  await page.screenshot({path: 'github.png', fullPage: true});

  await browser.close();
  await console.log("cool!");
})();
