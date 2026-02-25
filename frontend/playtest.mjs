import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context1 = await browser.newContext();
  const context2 = await browser.newContext();
  const page1 = await context1.newPage();
  const page2 = await context2.newPage();

  // Login User 1
  await page1.goto('http://localhost:3001/auth');
  await page1.fill('input[type="text"]', 'user1@vitbhopal.ac.in');
  await page1.click('button:has-text("Verify Student ID")');
  await page1.waitForTimeout(1000);
  
  // Wait for the alert and accept it
  page1.on('dialog', dialog => dialog.accept());
  // The alert triggers immediately after the request, which was handled

  // Find the exact OTP the page expects using evaluate
  // Or just type 123456 since mock backend doesn't care actually? 
  // Wait, mock backend checks the OTP sent. It was random!
  // It was returned in alert. Let's capture the alert text.
  
  await browser.close();
})();
