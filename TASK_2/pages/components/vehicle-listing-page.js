import { expect } from "@playwright/test";

exports.VehicleListingPage = class VehicleListingPage {

	/**
	 * @param {import('@playwright/test').Page} page
	 */
	constructor(page) {
		this.page = page;
		this.sortingCombobox = page.getByLabel('Sorting');
		this.filter = page.locator('.filter-toggle');
		this.pre_owned_option = page.locator('wb-tab').filter({ hasText: 'Pre-Owned' });
		this.colour_filter = page.locator('.category-filter-row')
                                 .filter({ has: page.locator('.category-filter-row-headline') })
                                 .filter({ has:  page.locator('.category-filter-row-headline__text')})
                                 .filter({hasText: 'Colour'})
		this.colour_options = page.getByTestId('multi-select-dropdown-card-opener').filter({ hasText: 'Colour' });
		this.sortingCombobox = page.getByLabel('Sorting');
		this.model_year = page.locator('.dcp-vehicle-details-list__item').filter({hasText: 'Model Year'}).locator('.dcp-vehicle-details-list-item__value');
		this.vin = page.locator('.dcp-vehicle-details-list__item').filter({hasText: 'VIN'}).locator('.dcp-vehicle-details-list-item__value');
		this.enquire_button = page.getByTestId('dcp-buy-box__contact-seller');
	}

	/**
	 * 
	 * Check if the component is loaded and if the sortingCombobox is Editable.
	 */	
	async isOpen() {
		await expect(this.sortingCombobox).toBeEditable();
	}

	/**
	 * 
	 * Click on the filter icon to open the options. Validate if the div with filter options is visible.
	 */	
	async openTheFilter() {
		await this.filter.click();
		await expect (this.page.locator('.dcp-cars-srp > .wrapper .show')).toBeVisible();
	}

	/**
	 * Click on the pre owned tab.
	 * NOTE: Adding dispatchEvent calling click directly because the click on the button is very instable.
	 */	
	async choosePreOwned() {
		await this.pre_owned_option.dispatchEvent('click');
        await expect(this.pre_owned_option).toHaveAttribute('aria-selected', 'true');
	}

	/**
	 * 
	 * Click on the color filter option.
	 * @param color 
	 * @example Brilliant Blue metallic
	 */	
	async selectTheColor(color) {
		await this.colour_filter.click();
		await this.colour_options.click({ force: true });
		const item_color = this.page.locator('a').filter({ hasText: color }).first();
		await item_color.click();
	}

	/**
	 * Get selected filter.
	 * @param filter 
	 * @example Brilliant Blue metallic
	 */	
	async getSelectedFilter(filter) {
		const selected_color = this.page.getByTestId('dcp-selected-filters-widget-tag').filter({ hasText: filter });
        await expect(selected_color).toBeVisible();
	}

	/**
	 * Get selected filter.
	 * @param filter
	 * @example [Relevance, Top Rated, Name (ascending), Name (descending), Price (ascending), Price (descending)]
	 */	
	async sortBy(filter) {
		await this.sortingCombobox.selectOption({label: filter});

		const first_and_most_expensive_vehicle = this.page.locator('.dcp-cars-srp-results__tile').first().getByTestId('dcp-cars-product-tile__model');
        await expect(first_and_most_expensive_vehicle).toHaveText('GLC 300 4MATIC SUV');
        await first_and_most_expensive_vehicle.click();
        await expect(this.page.getByText('Vehicle Details')).toBeVisible();
	}

	/**
	 * Enquire the selected vehicle.
	 */	
	async enquire() {
		await enquire_button.scrollIntoViewIfNeeded();
		await enquire_button.click();
		await expect(page.getByText('Contact Details and Account Creation')).toBeVisible();
	}
};