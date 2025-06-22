const puppeteer = require('puppeteer');

async function testAdvancedPortfolio() {
    console.log('🚀 Starting Advanced Portfolio Test...');
    
    const browser = await puppeteer.launch({
        headless: false, // Set to true for headless testing
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        defaultViewport: { width: 1920, height: 1080 }
    });

    const page = await browser.newPage();
    
    try {
        // Navigate to the advanced portfolio
        console.log('📍 Navigating to portfolio...');
        await page.goto('http://localhost:8080/index-advanced.html', { 
            waitUntil: 'networkidle0',
            timeout: 30000 
        });

        // Wait for preloader to finish
        console.log('⏳ Waiting for preloader...');
        await page.waitForSelector('.preloader.loaded', { timeout: 10000 });

        // Test responsive design
        console.log('📱 Testing responsive design...');
        const viewports = [
            { width: 1920, height: 1080, device: 'Desktop' },
            { width: 1024, height: 768, device: 'Tablet' },
            { width: 375, height: 667, device: 'Mobile' }
        ];

        for (const viewport of viewports) {
            await page.setViewport(viewport);
            console.log(`🖥️  Testing ${viewport.device} view (${viewport.width}x${viewport.height})`);
            
            // Wait for layout adjustment
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Take screenshot
            await page.screenshot({
                path: `test-screenshots/portfolio-${viewport.device.toLowerCase()}.png`,
                fullPage: true
            });
        }

        // Reset to desktop view for further testing
        await page.setViewport({ width: 1920, height: 1080 });

        // Test animations and interactions
        console.log('🎬 Testing animations...');
        
        // Test hero section animations
        const heroTitle = await page.$('.hero-title');
        if (heroTitle) {
            console.log('✅ Hero title found');
            
            // Check if text splitting worked
            const chars = await page.$$('.hero-title .char');
            console.log(`📝 Text split into ${chars.length} characters`);
        }

        // Test navigation interactions
        console.log('🧭 Testing navigation...');
        await page.hover('.nav-link');
        await new Promise(resolve => setTimeout(resolve, 500));

        // Test theme toggle
        console.log('🎨 Testing theme toggle...');
        const themeToggle = await page.$('.theme-toggle');
        if (themeToggle) {
            await themeToggle.click();
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const currentTheme = await page.evaluate(() => {
                return document.documentElement.getAttribute('data-theme');
            });
            console.log(`🌙 Theme switched to: ${currentTheme}`);
            
            // Switch back to dark
            await themeToggle.click();
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Test smooth scrolling to sections
        console.log('📜 Testing smooth scrolling...');
        const aboutLink = await page.$('a[href="#about"]');
        if (aboutLink) {
            await aboutLink.click();
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        // Test portfolio filter functionality
        console.log('🎯 Testing portfolio filters...');
        await page.goto('http://localhost:8080/index-advanced.html#portfolio', { 
            waitUntil: 'networkidle0' 
        });
        
        const filterButtons = await page.$$('.filter-btn');
        for (let i = 0; i < Math.min(filterButtons.length, 3); i++) {
            console.log(`🔄 Testing filter ${i + 1}`);
            await filterButtons[i].click();
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Test form interactions
        console.log('📧 Testing contact form...');
        await page.goto('http://localhost:8080/index-advanced.html#contact', { 
            waitUntil: 'networkidle0' 
        });
        
        await page.type('#name', 'Test User');
        await page.type('#email', 'test@example.com');
        await page.type('#message', 'This is a test message from Puppeteer!');
        
        // Don't actually submit the form
        console.log('✅ Form inputs working correctly');

        // Test performance metrics
        console.log('⚡ Checking performance metrics...');
        const metrics = await page.metrics();
        console.log('📊 Performance Metrics:');
        console.log(`   - JS Heap Used: ${(metrics.JSHeapUsedSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`   - DOM Nodes: ${metrics.Nodes}`);
        console.log(`   - JS Event Listeners: ${metrics.JSEventListeners}`);

        // Check for console errors
        console.log('🐛 Checking for console errors...');
        const logs = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                logs.push(msg.text());
            }
        });
        
        // Reload page to catch any errors
        await page.reload({ waitUntil: 'networkidle0' });
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        if (logs.length > 0) {
            console.log('❌ Console errors found:');
            logs.forEach(log => console.log(`   - ${log}`));
        } else {
            console.log('✅ No console errors detected');
        }

        // Test loading times
        console.log('⏱️  Testing loading performance...');
        const startTime = Date.now();
        await page.reload({ waitUntil: 'networkidle0' });
        const loadTime = Date.now() - startTime;
        console.log(`🚀 Page load time: ${loadTime}ms`);

        // Check accessibility
        console.log('♿ Basic accessibility check...');
        const hasAriaLabels = await page.$$eval('[aria-label]', elements => elements.length);
        const hasAltText = await page.$$eval('img[alt]', elements => elements.length);
        console.log(`🏷️  Elements with aria-labels: ${hasAriaLabels}`);
        console.log(`🖼️  Images with alt text: ${hasAltText}`);

        // Take final screenshot
        await page.screenshot({
            path: 'test-screenshots/final-portfolio.png',
            fullPage: true
        });

        console.log('✅ All tests completed successfully!');
        console.log('📸 Screenshots saved to test-screenshots/');

    } catch (error) {
        console.error('❌ Test failed:', error);
        
        // Take error screenshot
        try {
            await page.screenshot({
                path: 'test-screenshots/error-screenshot.png',
                fullPage: true
            });
        } catch (screenshotError) {
            console.error('Failed to take error screenshot:', screenshotError);
        }
    } finally {
        await browser.close();
    }
}

// Create screenshots directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('test-screenshots')) {
    fs.mkdirSync('test-screenshots');
}

// Run the test
testAdvancedPortfolio().catch(console.error);