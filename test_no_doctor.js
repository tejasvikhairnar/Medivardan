const axios = require('axios');

async function testNoDoctor() {
    try {
        console.log('Testing without DoctorID...');
        
        const FALLBACK_TOKEN = "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiMSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6IkFkbWluIiwiSXNDdXN0b21lciI6ImZhbHNlIiwiZXhwIjoxNzY3MTAwODE3LCJpc3MiOiJodHRwczovL215d2ViYXBpLmNvbSIsImF1ZCI6Imh0dHBzOi8vbXl3ZWJhcGkuY29tIn0.ed2joGgBAt2S4M4NZs0dl24N-rFbyCr9czX8GtnwGTo";
        const headers = { 'Authorization': `Bearer ${FALLBACK_TOKEN}` };

        // Test without DoctorID
        try {
            console.log('Requesting without DoctorID...');
            const res = await axios.get('http://localhost:3000/api/Appointments/getAppointments?PageSize=10&PageNumber=1&Mode=1&fromDate=1900-01-01&toDate=2100-01-01', { headers });
            console.log(`Result: ${Array.isArray(res.data) ? res.data.length : 'Not Array'} Status: ${res.status}`);
        } catch(e) { 
            console.log('Error:', e.message); 
            if (e.response) {
                console.log('Status:', e.response.status);
                console.log('Data:', JSON.stringify(e.response.data));
            }
        }

    } catch (e) {
        console.error('Fatal Error:', e.message);
    }
}

testNoDoctor();
