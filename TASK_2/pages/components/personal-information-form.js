import { expect } from "@playwright/test";

exports.PersonalInformationForm = class PersonalInformationForm {

	/**
	 * @param {import('@playwright/test').Page} page
	 */
	constructor(page) {
		this.page = page;

		this.name_input = page.getByLabel('First Name');
        this.last_name_input = page.getByLabel('Last Name');
        this.email_input = page.getByLabel('E-mail');
        this.postal_code_input = page.getByLabel('Postal Code');
		this.proceedButton = page.getByText('Proceed');
	}

	/**
	 * 
	 * Check if the component is loaded and if url is the quotes one.
	 */	
	async isOpen() {
		await expect(this.page).toHaveURL('**https://shop.mercedes-benz.com/dcpoto-api/dcp-api/v2/dcp-mp-au/open/quotes*');
	}

	/**
	 * 
	 * Insert some personal required information.
	 * @returns a invalid form for missing required information
	 */	
	async insertSomeInformation() {
        await this.name_input.fill('John', { force: true });
        await this.last_name_input.fill('Doe');
        await this.email_input.fill('johndoe.email.com');
        await this.postal_code_input.fill('2700');
	}

	/**
	 * 
	 * Validate the form.
	 * @returns The error messages related with the missing fields
	 */	
	async validatePersonalInformation() {
		await this.proceedButton.dispatchEvent('click');

		const invalid_email_message = this.page.getByText('Please enter a valid email address using a minimum of six characters.');
		const privacy_error_field = this.page.locator('.dcp-multi-checkbox').filter({has: this.page.locator('wb-control-error')});
		const generic_error_message = this.page.getByText('An error has occurred.');
		const check_alert = this.page.getByText('Please check the following sections:');

		await this.page.pause();

		await expect(invalid_email_message).toBeVisible();
		await expect(privacy_error_field).toHaveText('I have read and understood the  Collection Statement  and  Privacy Policy\nThis is a mandatory field.');
		await expect(generic_error_message).toBeVisible();
		await expect(check_alert).toBeVisible();
	}
};