import { test, expect } from "@playwright/test";
import { PolicePopup } from "../pages/components/police-popup";
import { FormLocationDialog } from "../pages/components/form-location-dialog";
import { VehicleListingPage } from "../pages/components/vehicle-listing-page";
import { PersonalInformationForm } from "../pages/components/personal-information-form";


import { generate } from "../helper/log-in-file";


test("MBio Search Vehicle", async({ page, context }) => {

    await test.step('Go to MBio Page', async () => {
        await page.goto("https://shop.mercedes-benz.com/en-au/shop/vehicle/srp/demo/");
        await page.waitForURL('https://shop.mercedes-benz.com/en-au/shop/vehicle/srp/demo/?error=login_required&sort=relevance-demo&assortment=vehicle');
    });    
    
    await test.step('First accept the policy', async () => {
        const policePopup = new PolicePopup(page);
        await policePopup.isOpen();
        await policePopup.agreeToAll();

    });

    await test.step('Select the location', async () => {
        const formLocationDialog = new FormLocationDialog(page);

        await test.step('Form location is open', async () => {
            await formLocationDialog.isOpen();
        });

        await test.step('Fill Location form and click in Continue', async () => {
            await formLocationDialog.selectState('New South Wales');
            await formLocationDialog.insertThePostalCode('2700');
            await formLocationDialog.checkPrivateOption();
            await formLocationDialog.continue();
        });
    });

    await test.step('Select the most expensive vehicle', async () => {
        const vehicleListingPage = new VehicleListingPage(page);

        await test.step('Select a vehicle by color', async () => {
            await test.step('Vehicle listing page is open', async () => {
                await vehicleListingPage.isOpen();
            });
    
            await test.step('Open the filter', async () => {
                await vehicleListingPage.openTheFilter();
            });
    
            await test.step('Selecte the pre-owned option', async () => {
                await vehicleListingPage.choosePreOwned();
            });
    
            await test.step('Selecte the color', async () => {
                const color = 'Brilliant Blue metallic';
                await vehicleListingPage.selectTheColor(color);
                await vehicleListingPage.choosePreOwned(color);
                await vehicleListingPage.getSelectedFilter(color);
            });
        });
    
        await test.step('Select a vehicle to enquire', async () => {
            await test.step('Sort the vehicle list by Price (descending)', async () => {
                await vehicleListingPage.sortBy('Price (descending)');
            });
    
            await test.step('Saving VIM Number and Model Year', async () => {
                const model_year = await vehicleListingPage.model_year.innerText();
                const vin = await vehicleListingPage.vin.innerText();
                const content = `{"VIM Number": "${vin}", "Model Year": ${model_year}}`;
                generate('saved-vehicles', vin+'.json', content);
            });
        
            await test.step('Enquire now', async () => {
                const enquire_button = page.getByTestId('dcp-buy-box__contact-seller');
                await enquire_button.waitFor();
                await enquire_button.scrollIntoViewIfNeeded();
                await enquire_button.click({ force: true });
                await expect(page.getByText('Contact Details and Account Creation')).toBeVisible();
            });
        });
    });

    await test.step('Personal information', async () => {
        const personalInformationForm = new PersonalInformationForm(page);
        await test.step('Filling form with invalid information', async () => {
            await personalInformationForm.insertSomeInformation();
        });
    
        await test.step('Try to submit the invalid form', async () => {
            await personalInformationForm.validatePersonalInformation();
        });
    });

});