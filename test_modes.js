const axios = require('axios');

async function testModes() {
    try {
        console.log('Testing Modes...');
        
        const FALLBACK_TOKEN = "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiMSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6IkFkbWluIiwiSXNDdXN0b21lciI6ImZhbHNlIiwiZXhwIjoxNzY3MTAwODE3LCJpc3MiOiJodHRwczovL215d2ViYXBpLmNvbSIsImF1ZCI6Imh0dHBzOi8vbXl3ZWJhcGkuY29tIn0.ed2joGgBAt2S4M4NZs0dl24N-rFbyCr9czX8GtnwGTo";
        const headers = { 'Authorization': `Bearer ${FALLBACK_TOKEN}` };

        // Test Mode=0
        try {
            console.log('Testing Mode=0 PageSize=50...');
            const res0 = await axios.get('http://localhost:3000/api/Appointments/getAppointments?PageSize=50&PageNumber=1&Mode=0&DoctorID=32&fromDate=1900-01-01&toDate=2100-01-01', { headers });
            console.log(`Mode=0 Result: ${Array.isArray(res0.data) ? res0.data.length : 'Not Array'} Status: ${res0.status}`);
        } catch(e) { console.log('Mode=0 Error:', e.message); }

        // Test Mode=1 (Base)
        try {
            console.log('Testing Mode=1 PageSize=50...');
            const res1 = await axios.get('http://localhost:3000/api/Appointments/getAppointments?PageSize=50&PageNumber=1&Mode=1&DoctorID=32&fromDate=1900-01-01&toDate=2100-01-01', { headers });
            console.log(`Mode=1 Result: ${Array.isArray(res1.data) ? res1.data.length : 'Not Array'} Status: ${res1.status}`);
        } catch(e) { console.log('Mode=1 Error:', e.message); }

         // Test Mode=2
         try {
            console.log('Testing Mode=2 PageSize=50...');
            const res2 = await axios.get('http://localhost:3000/api/Appointments/getAppointments?PageSize=50&PageNumber=1&Mode=2&DoctorID=32&fromDate=1900-01-01&toDate=2100-01-01', { headers });
            console.log(`Mode=2 Result: ${Array.isArray(res2.data) ? res2.data.length : 'Not Array'} Status: ${res2.status}`);
        } catch(e) { console.log('Mode=2 Error:', e.message); }

    } catch (e) {
        console.error('Error:', e.message);
    }
}

testModes();
