import { test, expect } from "@playwright/test";
import fs from 'fs';

test("MBio Search Vehicle", async({ page, browser }, testInfo) => {

    await test.step('Go to MBio Page', async () => {
        await page.goto("https://shop.mercedes-benz.com/en-au/shop/vehicle/srp/demo/");
    });    
    
    await test.step('First accept the policy', async () => {
        await page.getByRole("button", {name: 'Agree to all'}).click();

        const location_selector_modal = page.getByText('Please select your location');
        await expect(location_selector_modal).toBeVisible();
    });

    await test.step('Select the location', async () => {
        await page.getByLabel('* Your state').selectOption('New South Wales');
        await page.locator('wb-input').locator('input').fill('2700');
        
        await page.locator('label').filter({ hasText: 'Private' }).locator('div').click();
        await page.getByRole('button', {name: 'Continue'}).click();
    });

    await test.step('Open Filter Menu', async () => {
        const filter = page.locator('.filter-toggle');
        await filter.click();
        
    });

    await test.step('Select Pre-Owned', async () => {
        const pre_owned_option = page.locator('wb-tab').filter({ hasText: 'Pre-Owned' });
        await pre_owned_option.click({ force: true });
        await expect(pre_owned_option).toHaveAttribute('name', '0');
        await expect(pre_owned_option).toHaveAttribute('aria-selected', 'true');
    });

    await test.step('Open the colour filter', async () => {
        const colour_filter = page.locator('.category-filter-row')
                                 .filter({ has: page.locator('.category-filter-row-headline') })
                                 .filter({ has:  page.locator('.category-filter-row-headline__text')})
                                 .filter({hasText: 'Colour'});
        await colour_filter.click();
    });

    await test.step('Select the colour dropdown', async () => {
        const colour_options = page.getByTestId('multi-select-dropdown-card-opener').filter({ hasText: 'Colour' });
        expect(colour_options).toBeDefined();
        await colour_options.click({ force: true });

    });

    await test.step('Select the colour', async () => {
        const item_color = page.locator('a').filter({ hasText: 'Brilliant Blue metallic' }).first();
        await item_color.click();
        const selected_color = page.getByTestId('dcp-selected-filters-widget-tag').filter({ hasText: 'Brilliant Blue metallic' });
        await expect(selected_color).toBeVisible();
    });

    await test.step('Sorting by Price (decending) And select the most expensive vehicle', async () => {
        await page.getByLabel('Sorting').selectOption({label: 'Price (descending)'});
        const first_and_most_expensive_vehicle = page.locator('.dcp-cars-srp-results__tile').first().getByTestId('dcp-cars-product-tile__model');
        await expect(first_and_most_expensive_vehicle).toHaveText('GLC 300 4MATIC SUV');
        await first_and_most_expensive_vehicle.click();
        await expect(page.getByText('Vehicle Details')).toBeVisible();
    });

    await test.step('Saving VIM Number and Model Year', async () => {
        if(!fs.existsSync('saved_vehicles')) {
            fs.mkdirSync('saved_vehicles');
        }
        fs.writeFileSync('saved_vehicles/GLC_300_4MATIC_SUV.json', '{"VIM Number": "W1N2539842V317433", "Model Year": 2023}');
    });

    await test.step('Enquire now', async () => {
        const enquire_button = page.getByTestId('dcp-buy-box__contact-seller');
        await enquire_button.scrollIntoViewIfNeeded();
        await enquire_button.click();
        await expect(page.getByText('Contact Details and Account Creation')).toBeVisible();
    });

    await test.step('Filling form with invalid information', async () => {
        await page.getByLabel('First Name').fill('John');
        await page.getByLabel('Last Name').fill('Doe');
        await page.getByLabel('E-mail').fill('johndoe.email.com');
        await page.getByLabel('Postal Code').fill('2700');
    });

    await test.step('Try to submit the invalid form', async () => {
        await page.getByText('Proceed').click();
        await expect(page.getByText('Please enter a valid email address using a minimum of six characters.')).toBeVisible();
        await expect(page.getByTestId('rfq-contact__phone').filter({hasText: 'This is a mandatory field.'})).toBeVisible();
        await expect(page.locator('.dcp-multi-checkbox').filter({has: page.locator('wb-control-error')})).toHaveText('I have read and understood the  Collection Statement  and  Privacy Policy\nThis is a mandatory field.');
        await expect(page.getByText('An error has occurred.')).toBeVisible();
        await expect(page.getByText('Please check the following sections:')).toBeVisible();

    });

    await test.step('Screenshot the step', async () => {
        await page.screenshot({ path: `screenshots/${testInfo.title}.png` });
    });
});