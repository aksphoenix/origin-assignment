import { test as base } from '@playwright/test';
import { PricingPage } from '../pages/PricingPage';
import { PageHelper } from '../helpers/commonHelpers';


export const test = base.extend<{
    pricingPage: PricingPage;
    pageHelper: PageHelper;
}>({
  pricingPage: async ({ page }, use) => {
    await use(new PricingPage(page));
  },
  pageHelper: async ({ page }, use) => {
    await use(new PageHelper());
  },
});
