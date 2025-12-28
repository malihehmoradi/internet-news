import handler from './main.js';

// Mock request/response objects
const req = {
    method: 'POST',
    headers: {},
    body: {}
};

const res = {
    json: (data, status = 200) => {
        console.log('Response Status:', status);
        console.log('Response Data:', JSON.stringify(data, null, 2));
        return data;
    }
};

const log = (...args) => console.log('📝 LOG:', ...args);
const error = (...args) => console.error('❌ ERROR:', ...args);

// Run the function
handler({req, res, log, error})
    .then(() => {
        console.log('✅ Test completed successfully');
        process.exit(0);
    })
    .catch((err) => {
        console.error('💥 Test failed:', err);
        process.exit(1);
    });