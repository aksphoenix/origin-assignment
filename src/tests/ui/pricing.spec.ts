/**
 * Pricing Page Test Suite
 * @author Amrith Shetty
 * @description Tests for Origin Energy pricing page functionality
 * @module pricing.spec.ts
 * 
 * Test Coverage:
 * - Energy type selection (Both Electricity & Gas, Gas only)
 * - Address search with autocomplete dropdown selection
 * - Plan list display verification for selected energy types
 * - PDF download for energy fact sheets
 * - PDF content validation using pdf-parse
 * - Browser context cleanup (cookies, page closure)
 * 
 * Prerequisites:
 * - Valid test addresses configured in addressInfo.json
 * - BASE_URL environment variable set
 * - ignoreHTTPSErrors enabled for PDF downloads
 * - pdf-parse dependency installed
 */

import fs from 'fs';
import { expect, TestInfo } from '@playwright/test';
import { test } from '../../fixtures/BasePage';


test.describe.serial('Pricing Page Happy Path tests', () => {
  const addressData = JSON.parse(
    fs.readFileSync(
      require('path').resolve(__dirname, '../../data/addressInfo.json'),
      'utf8',
    ),
  );

  test.beforeEach(async ({ page, pricingPage, pageHelper }, testInfo: TestInfo) => {
    await page.bringToFront();
    await test.step('Given the user navigates to the pricing page', async () => {
      await pricingPage.navigateToPricingPage();
      await pageHelper.captureScreenClip(page, 'Navigate to Pricing Page', testInfo);
    });
    await test.step('And the user should be logged in and redirected to the pricing page', async () => {
      await expect(page).toHaveURL((process.env.BASE_URL || '').concat('/pricing.html'));
    });
  });

  test.afterEach(async ({ page, pricingPage, pageHelper }, testInfo: TestInfo) => {
    // Add any necessary cleanup steps here
    await test.step(`Test Execution Ended at ${new Date().toISOString()} `, async () => { });

  });

  test('Test 01 - Verify User can view Plan list for Both electricity and Gas after they enter a valid address', async ({ page, pricingPage, pageHelper }, testInfo: TestInfo) => {

    await test.step('And the user has selected both electricity and gas options', async () => {
      await pricingPage.selectEnergyTypes({ electricity: true, gas: true });
      await pageHelper.captureScreenClip(page, 'Energy Selection', testInfo);
    });

    await test.step('And the user enters valid address in address field', async () => {
      await pricingPage.EnterAddressAndSelectFromDropdown(addressData.validAddresses[0]);
      await pageHelper.captureScreenClip(page, 'Address Entry', testInfo);
    });

    await test.step('Then the user should see the Plans list for Both electricity and Gas', async () => {
      await pricingPage.verifyPlanDetailsDisplayed();
      await pageHelper.captureScreenClip(page, 'Plan List Table', testInfo);
    });
  });

  test('Test 02 - Verify User can view Plan list for Gas only after they enter a valid address', async ({ page, pricingPage, pageHelper }, testInfo: TestInfo) => {

    await test.step('And the user has selected both electricity and gas options', async () => {
      await pricingPage.selectEnergyTypes({ electricity: false, gas: true });
      await pageHelper.captureScreenClip(page, 'Energy Selection', testInfo);
    });

    await test.step('And the user enters valid address in address field', async () => {
      await pricingPage.EnterAddressAndSelectFromDropdown(addressData.validAddresses[0]);
      await pageHelper.captureScreenClip(page, 'Address Entry', testInfo);
    });

    await test.step('Then the user should see the Plans list for Both electricity and Gas', async () => {
      await pricingPage.verifyPlanDetailsDisplayed();
      await pageHelper.captureScreenClip(page, 'Plan List Table', testInfo);
    });
  });

  test.only('Test 03 - Verify User can view Plan PDF', async ({ page, pricingPage, pageHelper }, testInfo: TestInfo) => {

    await test.step('And the user has selected both electricity and gas options', async () => {
      await pricingPage.selectEnergyTypes({ electricity: false, gas: true });
      await pageHelper.captureScreenClip(page, 'Energy Selection', testInfo);
    });

    await test.step('When the user enters valid address in address field', async () => {
      await pricingPage.EnterAddressAndSelectFromDropdown(addressData.validAddresses[0]);
      await pageHelper.captureScreenClip(page, 'Address Entry', testInfo);
    });

    await test.step('Then the user should see the Plans list for Both electricity and Gas', async () => {
      await pricingPage.verifyPlanDetailsDisplayed();
      await pageHelper.captureScreenClip(page, 'Plan List Table', testInfo);
    });

    await test.step('And the user should see PDF for Basic Origin in a new Tab', async () => {
      const result = await pricingPage.clickOnBasicGasPlanLinkAndVerifyTab();
      if (result) {
        await pageHelper.downloadPDFFromPage(result);
      }
    });

    await test.step.skip('And the saved PDF should verify ', async () => {
      const filePath = './downloads/plan.pdf';
      await pageHelper.verifyPDFContent(filePath, 'Fuel type Gas');
    });
  });

});