const axios = require('axios');

async function checkSchema() {
    try {
        console.log('Fetching single lead to check schema...');
        
        // Use a dummy token, axios interceptor on server might handle it or we expect 401 if strict.
        // But we fixed localStorage crash, so we expect either data or specific error.
        // We'll use a mocked "Authorization" header to pass the check in route.js
        const headers = { 'Authorization': `Bearer mock_token_for_schema_check` };

        // Hit the NEXT.js API route
        const res = await axios.get('http://localhost:3000/api/Leads/getLeads?PageSize=1&PageNumber=1', { headers });

        console.log('Response Status:', res.status);
        if (Array.isArray(res.data) && res.data.length > 0) {
            const first = res.data[0];
            console.log('--- ACTUAL KEYS ---');
            console.log(Object.keys(first));
            console.log('--- SAMPLE DATA ---');
            console.log(JSON.stringify(first, null, 2));
        } else {
            console.log('Response is empty or not an array:', res.data);
        }

    } catch (e) {
        console.error('Error:', e.message);
        if (e.response) {
            console.log('Error Data:', JSON.stringify(e.response.data, null, 2));
        }
    }
}

checkSchema();
