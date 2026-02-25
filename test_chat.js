const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page1 = await browser.newPage();
  const page2 = await browser.newPage();
  
  // Logic to log in and chat
  // I will just use the browser subagent instead, it's easier.
  console.log('done');
  await browser.close();
})();
