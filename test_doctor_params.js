const axios = require('axios');

async function testDoctorParams() {
    try {
        console.log('Testing DoctorID Params...');
        const FALLBACK_TOKEN = "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiMSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6IkFkbWluIiwiSXNDdXN0b21lciI6ImZhbHNlIiwiZXhwIjoxNzY3MTAwODE3LCJpc3MiOiJodHRwczovL215d2ViYXBpLmNvbSIsImF1ZCI6Imh0dHBzOi8vbXl3ZWJhcGkuY29tIn0.ed2joGgBAt2S4M4NZs0dl24N-rFbyCr9czX8GtnwGTo";
        const headers = { 'Authorization': `Bearer ${FALLBACK_TOKEN}` };

        // Test DoctorID=0
        try {
            console.log('Requesting DoctorID=0...');
            const res = await axios.get('http://localhost:3000/api/Appointments/getAppointments?PageSize=10&PageNumber=1&Mode=1&DoctorID=0&fromDate=1900-01-01&toDate=2100-01-01', { headers });
            console.log(`DoctorID=0 Result: ${Array.isArray(res.data) ? res.data.length : 'Not Array'} Status: ${res.status}`);
        } catch(e) { console.log('DoctorID=0 Error:', e.message, e.response?.status); }

        // Test Missing DoctorID (Again)
        try {
            console.log('Requesting Missing DoctorID...');
            const res = await axios.get('http://localhost:3000/api/Appointments/getAppointments?PageSize=10&PageNumber=1&Mode=1&fromDate=1900-01-01&toDate=2100-01-01', { headers });
            console.log(`Missing DoctorID Result: ${Array.isArray(res.data) ? res.data.length : 'Not Array'} Status: ${res.status}`);
        } catch(e) { console.log('Missing DoctorID Error:', e.message, e.response?.status); }

    } catch (e) {
        console.error('Fatal Error:', e.message);
    }
}

testDoctorParams();
