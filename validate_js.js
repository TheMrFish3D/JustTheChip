// Simple JavaScript validation for layout selector
// This checks basic syntax and structure

const fs = require('fs');

try {
    const htmlContent = fs.readFileSync('JustTheChip.html', 'utf8');
    
    // Extract JavaScript from script tags
    const scriptMatch = htmlContent.match(/<script[^>]*type="text\/babel"[^>]*>([\s\S]*?)<\/script>/);
    
    if (!scriptMatch) {
        console.log('❌ Could not find React/Babel script section');
        process.exit(1);
    }
    
    const jsContent = scriptMatch[1];
    
    // Check for basic structure elements
    const checks = [
        { name: 'Layout style state', pattern: /layoutStyle.*useState/, required: true },
        { name: 'Integrated layout', pattern: /renderIntegratedLayout/, required: true },
        { name: 'Tabbed layout', pattern: /renderTabbedLayout/, required: true },
        { name: 'Top bar layout', pattern: /renderTopBarLayout/, required: true },
        { name: 'Dashboard layout', pattern: /renderDashboardLayout/, required: true },
        { name: 'Accordion layout', pattern: /renderAccordionLayout/, required: true },
        { name: 'Layout selector dropdown', pattern: /layoutStyle.*onChange/, required: true },
        { name: 'Current layout renderer', pattern: /renderCurrentLayout/, required: true },
        { name: 'Invalid useState in render functions', pattern: /const render.*Layout.*useState/, required: false, shouldNotExist: true }
    ];
    
    let passCount = 0;
    let totalChecks = 0;
    
    console.log('🔍 JavaScript Structure Validation:\n');
    
    checks.forEach(check => {
        totalChecks++;
        const found = check.pattern.test(jsContent);
        
        if (check.shouldNotExist) {
            if (!found) {
                console.log(`✅ ${check.name}: Not found (good)`);
                passCount++;
            } else {
                console.log(`❌ ${check.name}: Found (should not exist)`);
            }
        } else if (check.required) {
            if (found) {
                console.log(`✅ ${check.name}: Found`);
                passCount++;
            } else {
                console.log(`❌ ${check.name}: Missing`);
            }
        }
    });
    
    console.log(`\n📊 Results: ${passCount}/${totalChecks} checks passed`);
    
    if (passCount === totalChecks) {
        console.log('🎉 All validation checks passed!');
    } else {
        console.log('⚠️  Some validation checks failed');
    }
    
    // Check for layout options
    const layoutOptions = [
        'integrated', 'tabbed', 'topbar', 'dashboard', 'accordion'
    ];
    
    console.log('\n🎨 Layout Options Check:');
    layoutOptions.forEach(layout => {
        const found = jsContent.includes(`value="${layout}"`);
        console.log(`${found ? '✅' : '❌'} ${layout}: ${found ? 'Found' : 'Missing'}`);
    });
    
} catch (error) {
    console.error('❌ Error reading or parsing file:', error.message);
    process.exit(1);
}