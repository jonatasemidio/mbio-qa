import { expect } from "@playwright/test";

exports.FormLocationDialog = class FormLocationDialog {

	/**
	 * @param {import('@playwright/test').Page} page
	 */
	constructor(page) {
		this.page = page;
		this.dialog = page.getByTestId('modal-popup__location').getByRole('dialog');
		this.dialogTitle = page.getByText('Please select your location');
		this.stateCombobox = page.getByLabel('* Your state');
		this.postalCodeField = page.locator('wb-input').locator('input');
		this.privateCheckbox = page.locator('label').filter({ hasText: 'Private' }).locator('div');
		this.continueButton = page.getByRole('button', {name: 'Continue'});
		//this.agreeToAllButton = page.getByRole('button', {name: 'Agree to all'});
	}

	/**
	 * 
	 * Check if the component is loaded and it the dialog and title is visible.
	 */	
	async isOpen() {
		this.page.waitForLoadState('domcontentloaded');
		await expect(this.dialog).toBeVisible();
		await expect(this.dialogTitle).toBeVisible();
	}
	/**
	 * 
	 * Click on the option to accept all the policy informed on the policy popup.
	 */	
	async agreeToAll() {
		await this.agreeToAllButton.click();
	}

	/**
	 * 
	 * Inform the string to be selected on the combobox.
	 * @param stateOption 
	 * @example 'New South Wales'
	 */
	async selectState(stateOption) {
		await this.stateCombobox.selectOption(stateOption);
	}

	/**
	 * 
	 * Insert the postal code.
	 * @param postalCode
	 * @example 2700
	 */
	async insertThePostalCode(postalCode) {
		await this.postalCodeField.fill(postalCode);
	}

	/**
	 * 
	 * Check the Private option.
	 */
	async checkPrivateOption() {
		await this.privateCheckbox.check();
	}

	/**
	 * 
	 * Click on the Continue Button and wait for the response of the /search with status 200.
	 */
	async continue() {
		await Promise.all([
			this.page.waitForResponse(response => response.url().includes("v2/dcp-mp-au/products/search") && response.status() === 200),
			this.continueButton.click()
		]);
	}
};