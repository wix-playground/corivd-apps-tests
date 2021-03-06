/// <reference types="sled-test-runner" />
import { Page } from 'puppeteer';

describe('wix.com sanity', () => {

  const cfaButtonId = 'comp-jx8pl0hy';

  it(`'Sign In' Button with vanilla sled`, async () => {
    const { page }: { page: Page } = await sled.newPage({});
    await page.goto('https://www.wix.com');
    const slctr = `#${cfaButtonId}`;
    await page.waitForSelector(slctr);
    const text = await page.$eval(slctr, (e: HTMLElement) => e.innerText);
    expect(text).toBe('Sign In');
  });
  
});
