import { Page, Locator } from '@playwright/test';

export class HomePage {
    readonly page: Page;
    readonly logo: Locator;
    readonly navMenu: Locator;
    readonly signInButton: Locator;
    readonly searchButton: Locator;
    readonly energyPlansLink: Locator;
    readonly businessLink: Locator;
    readonly helpSupportLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.logo = page.locator('[aria-label="Origin Energy"]');
        this.navMenu = page.locator('nav');
        this.signInButton = page.getByRole('link', { name: /sign in/i });
        this.searchButton = page.getByRole('button', { name: /search/i });
        this.energyPlansLink = page.getByRole('link', { name: /energy plans/i });
        this.businessLink = page.getByRole('link', { name: /business/i });
        this.helpSupportLink = page.getByRole('link', { name: /help/i });
    }

    async goto() {
        await this.page.goto('https://www.originenergy.com.au/');
    }

    async clickSignIn() {
        await this.signInButton.click();
    }

    async searchFor(query: string) {
        await this.searchButton.click();
        await this.page.fill('input[type="search"]', query);
        await this.page.keyboard.press('Enter');
    }

    async navigateToEnergyPlans() {
        await this.energyPlansLink.click();
    }

    async navigateToBusiness() {
        await this.businessLink.click();
    }

    async navigateToHelpSupport() {
        await this.helpSupportLink.click();
    }
}