import { expect } from "@playwright/test";

exports.PolicePopup = class PolicePopup {

	/**
	 * @param {import('@playwright/test').Page} page
	 */
	constructor(page) {
		this.page = page;
		this.popup = page.locator('.heading-section');
		this.agreeToAllButton = page.getByRole('button', {name: 'Agree to all'});
	}

	/**
	 * 
	 * Check if the component is loaded and if the popup is visible.
	 */	
	async isOpen() {
		this.page.waitForLoadState('domcontentloaded');
		await expect(this.popup).toBeVisible();
	}

	/**
	 * 
	 * Click on the button accepting all the polivy.
	 */	
	async agreeToAll() {
		await this.agreeToAllButton.click();
	}
};