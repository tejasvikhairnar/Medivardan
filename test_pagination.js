const axios = require('axios');

async function testPagination() {
    try {
        console.log('Testing PageSize headers...');
        // We need the Authorization header, which the local API requires.
        // Assuming we can grab a valid token or the API route handles the lack of it by erroring?
        // Wait, the API route requires 'authorization' header.
        
        // I need a token. The route.js I saw earlier had a fallback token or I can try without if the route has a default?
        // In the modified route.js, `const authHeader = request.headers.get('authorization');` matches and checks if it exists.
        // I should use the fallback token from the original file or a known one.
        
        const FALLBACK_TOKEN = "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiMSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6IkFkbWluIiwiSXNDdXN0b21lciI6ImZhbHNlIiwiZXhwIjoxNzY3MTAwODE3LCJpc3MiOiJodHRwczovL215d2ViYXBpLmNvbSIsImF1ZCI6Imh0dHBzOi8vbXl3ZWJhcGkuY29tIn0.ed2joGgBAt2S4M4NZs0dl24N-rFbyCr9czX8GtnwGTo";

        const headers = { 'Authorization': `Bearer ${FALLBACK_TOKEN}` };

        // Test 1: PageSize 5
        console.log('Requesting PageSize=5...');
        const res1 = await axios.get('http://localhost:3000/api/Appointments/getAppointments?PageSize=5&PageNumber=1&Mode=1&DoctorID=32', { headers });
        console.log(`Response 1 status: ${res1.status}`);
        console.log(`Response 1 count: ${Array.isArray(res1.data) ? res1.data.length : 'Not Array'}`);

        // Test 2: PageSize 25
        console.log('Requesting PageSize=25...');
        const res2 = await axios.get('http://localhost:3000/api/Appointments/getAppointments?PageSize=25&PageNumber=1&Mode=1&DoctorID=32', { headers });
        console.log(`Response 2 status: ${res2.status}`);
        console.log(`Response 2 count: ${Array.isArray(res2.data) ? res2.data.length : 'Not Array'}`);


    } catch (e) {
        console.error('Error:', e.message);
        if (e.response) {
            console.error('Status:', e.response.status);
            console.error('Data:', JSON.stringify(e.response.data));
        }
    }
}

testPagination();
