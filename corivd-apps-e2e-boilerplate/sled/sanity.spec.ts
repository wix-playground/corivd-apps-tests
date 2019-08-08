/// <reference types="sled-test-runner" />
import { Page } from 'puppeteer';
import { withViewer } from 'santa-integration-tests'
import testUrl from 'my-test-url-service';

describe('wix.com sanity', () => {

  const cfaButtonId = 'comp-jx8mrtll';

  it('CFA Button with vanilla sled', async () => {
    const { page }: { page: Page } = await sled.newPage({});
    const rcUrl = await testUrl.get('https://www.wix.com');
    await page.goto(rcUrl);
    const slctr = `#${cfaButtonId}`;
    await page.waitForSelector(slctr);
    const text = await page.$eval(slctr, (e: HTMLElement) => e.innerText);
    expect(text).toBe('Get Started');
  });
  
});
