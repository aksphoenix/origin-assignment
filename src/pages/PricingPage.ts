import { Locator, Page, TestInfo, expect, test } from "@playwright/test";
import { PageHelper } from '../helpers/commonHelpers';




export class PricingPage {
  readonly page: Page;
  readonly pageHelper: PageHelper;
  // Locators 
  addressSearch_l: Locator;
  electricityCheckbox_l: Locator;
  gasCheckbox_l: Locator;
  addressVerifiedIcon_l: Locator;
  autocompletionResults_l: Locator;
  planTableContainer_l: Locator;
  planTableHeader_l: Locator;
  basicGasPlanLink_l: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageHelper = new PageHelper();
    this.addressSearch_l = this.page.getByRole('combobox', { name: 'Your address' });
    this.electricityCheckbox_l = this.page.getByRole('checkbox', { name: 'Electricity' });
    this.gasCheckbox_l = this.page.getByRole('checkbox', { name: 'Gas' });
    this.addressVerifiedIcon_l = this.page.locator('#check-circle--checkmark-addition-circle-success-check-validation-add-form-tick > path');
    this.autocompletionResults_l = this.page.getByRole('listbox', { name: 'Your address' });
    this.planTableContainer_l = this.page.locator('[data-id="searchResultsContainer"]');
    this.planTableHeader_l = this.page.getByRole('columnheader', { name: 'Plan BPID/EFS' })
    this.basicGasPlanLink_l = this.page.locator('[data-id="energy-fact-sheet-Origin Basic-gas"]');
  }

  async navigateToPricingPage() {
    await this.page.goto(process.env.BASE_URL + '/pricing.html');
  }

  async EnterAddressAndSelectFromDropdown(address: string) {
    await this.addressSearch_l.click();
    await this.addressSearch_l.fill(address);
    // Wait for autocomplete listbox to appear
    await this.autocompletionResults_l.waitFor({ state: 'visible', timeout: 5000 });
    const options = this.page.getByRole('option');
    const firstOption = options.first();
    await firstOption.waitFor({ state: 'visible', timeout: 5000 });
    await firstOption.click();
    await this.addressVerifiedIcon_l.isVisible();
  }


  async selectEnergyTypes(options: { electricity?: boolean; gas?: boolean }) {
    if (options.electricity === false && options.gas === false) {
      throw new Error('At least one energy type (electricity or gas) must be selected');
    }
    if (options.electricity !== undefined) {
      await this.electricityCheckbox_l.setChecked(options.electricity);
    }
    if (options.gas !== undefined) {
      await this.gasCheckbox_l.setChecked(options.gas);
    }
  }


  async verifyPlanDetailsDisplayed() {
    await this.page.waitForLoadState('load', { timeout: 10000 }).catch(() => { });
    await expect(this.planTableContainer_l).toBeVisible({ timeout: 10000 });
    await expect(this.planTableHeader_l).toBeVisible({ timeout: 10000 });
  }

  async clickOnBasicGasPlanLinkAndVerifyTab() {
    const newTabPromise = this.page.waitForEvent('popup');
    await this.basicGasPlanLink_l.first().isEnabled();
    await this.basicGasPlanLink_l.first().click();
    const newPage = await newTabPromise;

    const title = await newPage.title();
    console.log('PDF page title:', title);
    // verify new page title
    if (title && title.length > 0) {
      await expect(newPage).toHaveTitle(/Victorian Energy Fact Sheet - Offer OR.*/);
    }
    await this.pageHelper.captureScreenClip(this.page, 'PDF', null);
    return newPage;


    // const pdfUrl = newPage.url();
    // console.log('PDF URL:', pdfUrl);
    // // Download via API
    // const response = await newPage.context().request.get(pdfUrl);
    // console.log('Response status:', response.status());
    // if (!response.ok()) {
    //   throw new Error(`Failed to download PDF: ${response.status()} ${response.statusText()}`);
    // }
    // const pdf = await response.body();
    // const filePath = './downloads/plan.pdf';
    // // Create downloads directory if it doesn't exist
    // const fs = require('fs');
    // await fs.promises.writeFile(filePath, pdf);
    // console.log('PDF saved to:', filePath);
    // await newPage.close();
    // return filePath;
  }

}

