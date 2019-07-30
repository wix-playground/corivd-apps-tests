/// <reference types="sled-test-runner" />
import { Page } from 'puppeteer';
import { withViewer } from 'santa-integration-tests'

describe('wix.com sanity', () => {

  const cfaButtonId = 'comp-jx8mrtll';

  it('CFA Button with vanilla sled', async () => {
    const { page }: { page: Page } = await sled.newPage({});
    await page.goto('https://www.wix.com');
    const slctr = `#${cfaButtonId}`;
    await page.waitForSelector(slctr);
    const text = await page.$eval(slctr, (e: HTMLElement) => e.innerText);
    expect(text).toBe('Get Started');
  });

  it('CFA Button with santa-integration-tests', withViewer({baseUrl: 'https://www.wix.com'}, async ({componentDriverFactory}) => {
      const buttonDriver = await componentDriverFactory.create(cfaButtonId) // https://github.com/wix-private/santa-integration-tests#viewersitebuttoncomponent
      const btnText = await buttonDriver.getText()
      expect(btnText).toEqual('Get Started')
  }))
  
});
