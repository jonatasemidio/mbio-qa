import { defineConfig } from "@playwright/test";

export default defineConfig({
    reporter: 'allure-playwright',
    workers: 1,
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
        {
            name: 'firefox',
            timeout: 20000,
            use: {
                video: 'on',
                screenshot: "on",
                headless: true,
            }
            
        },  
        {
            name: 'webkit',
            timeout: 20000,
            use: {
                video: 'on',
                screenshot: "on",
                headless: true,
            }
            
        },   
    ],
});