import { defineConfig } from "@playwright/test";

export default defineConfig({
    reporter: 'allure-playwright',
    use: { testIdAttribute: 'data-test-id',},
    
    projects: [
        {
            name: 'chromium',
            timeout: 20000,
            use: {
                video: 'on',
                screenshot: "on",
                headless: true,
            }
            
        },
     
    ],
});