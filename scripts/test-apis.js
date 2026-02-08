// API Testing Script for The Obsidian Backend
// Run this with: node scripts/test-apis.js

const BASE_URL = 'http://localhost:3000';

// Color codes for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testAPI(name, url, expectedStatus = 200) {
    try {
        log(`\n🧪 Testing: ${name}`, 'cyan');
        log(`   URL: ${url}`, 'blue');

        const response = await fetch(url);
        const data = await response.json();

        if (response.status === expectedStatus) {
            log(`   ✅ Status: ${response.status} (Expected: ${expectedStatus})`, 'green');
            log(`   📦 Response:`, 'blue');
            console.log(JSON.stringify(data, null, 2));
            return { success: true, data };
        } else {
            log(`   ❌ Status: ${response.status} (Expected: ${expectedStatus})`, 'red');
            log(`   📦 Response:`, 'yellow');
            console.log(JSON.stringify(data, null, 2));
            return { success: false, data };
        }
    } catch (error) {
        log(`   ❌ Error: ${error.message}`, 'red');
        return { success: false, error: error.message };
    }
}

async function runTests() {
    log('\n' + '='.repeat(60), 'cyan');
    log('🚀 THE OBSIDIAN - API TESTING SUITE', 'cyan');
    log('='.repeat(60), 'cyan');

    const results = [];

    // Test 1: Pricing Configuration
    results.push(await testAPI(
        'GET /api/pricing/config',
        `${BASE_URL}/api/pricing/config`
    ));

    // Test 2: Pricing Calculation (7 nights - weekly discount)
    results.push(await testAPI(
        'GET /api/pricing/calculate (7 nights)',
        `${BASE_URL}/api/pricing/calculate?nights=7`
    ));

    // Test 3: Pricing Calculation (30 nights - monthly discount)
    results.push(await testAPI(
        'GET /api/pricing/calculate (30 nights)',
        `${BASE_URL}/api/pricing/calculate?nights=30`
    ));

    // Test 4: Blocked Dates
    results.push(await testAPI(
        'GET /api/blocked-dates',
        `${BASE_URL}/api/blocked-dates`
    ));

    // Test 5: Availability Check (available dates)
    results.push(await testAPI(
        'GET /api/availability (May 1-5, 2026)',
        `${BASE_URL}/api/availability?checkIn=2026-05-01&checkOut=2026-05-05`
    ));

    // Test 6: Availability Check (blocked dates)
    results.push(await testAPI(
        'GET /api/availability (Feb 10-15, 2026 - should be blocked)',
        `${BASE_URL}/api/availability?checkIn=2026-02-10&checkOut=2026-02-15`
    ));

    // Summary
    log('\n' + '='.repeat(60), 'cyan');
    log('📊 TEST SUMMARY', 'cyan');
    log('='.repeat(60), 'cyan');

    const passed = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    log(`\n✅ Passed: ${passed}`, 'green');
    log(`❌ Failed: ${failed}`, failed > 0 ? 'red' : 'green');
    log(`📈 Success Rate: ${((passed / results.length) * 100).toFixed(1)}%\n`, 'cyan');

    // Get a booking number from the first blocked date to test booking retrieval
    const blockedDatesResult = results[3];
    if (blockedDatesResult.success && blockedDatesResult.data.length > 0) {
        log('\n' + '='.repeat(60), 'cyan');
        log('🔍 BONUS TEST: Booking Retrieval', 'cyan');
        log('='.repeat(60), 'cyan');
        log('\nNote: To test GET /api/bookings, you need a booking number.', 'yellow');
        log('Check your Supabase dashboard for booking numbers, then run:', 'yellow');
        log(`\n   fetch('${BASE_URL}/api/bookings?bookingNumber=OBS-2026-001')`, 'blue');
        log(`   .then(r => r.json()).then(console.log)\n`, 'blue');
    }
}

// Run the tests
runTests().catch(console.error);
