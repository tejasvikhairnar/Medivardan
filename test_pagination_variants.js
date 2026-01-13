const axios = require('axios');

async function testPaginationVariants() {
    try {
        console.log('Testing Parameter Variants...');
        
        const FALLBACK_TOKEN = "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiMSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6IkFkbWluIiwiSXNDdXN0b21lciI6ImZhbHNlIiwiZXhwIjoxNzY3MTAwODE3LCJpc3MiOiJodHRwczovL215d2ViYXBpLmNvbSIsImF1ZCI6Imh0dHBzOi8vbXl3ZWJhcGkuY29tIn0.ed2joGgBAt2S4M4NZs0dl24N-rFbyCr9czX8GtnwGTo";
        const headers = { 'Authorization': `Bearer ${FALLBACK_TOKEN}` };

        const base = 'http://localhost:3000/api/Appointments/getAppointments?Mode=1&DoctorID=32&PageNumber=1';

        // Variant 1: pageSize (camelCase)
        console.log('Testing pageSize=5...');
        const res1 = await axios.get(`${base}&pageSize=5`, { headers });
        console.log(`pageSize=5 Result: ${Array.isArray(res1.data) ? res1.data.length : 'Not Array'}`);

        // Variant 2: limit
        console.log('Testing limit=5...');
        const res2 = await axios.get(`${base}&limit=5`, { headers });
        console.log(`limit=5 Result: ${Array.isArray(res2.data) ? res2.data.length : 'Not Array'}`);

        // Variant 3: PageSize (verify failure again)
        console.log('Testing PageSize=5...');
        const res3 = await axios.get(`${base}&PageSize=5`, { headers });
        console.log(`PageSize=5 Result: ${Array.isArray(res3.data) ? res3.data.length : 'Not Array'}`);

    } catch (e) {
        console.error('Error:', e.message);
    }
}

testPaginationVariants();
