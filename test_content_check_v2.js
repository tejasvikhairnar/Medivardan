const axios = require('axios');

async function testContentV2() {
    try {
        console.log('Checking Content V2...');
        const FALLBACK_TOKEN = "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiMSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6IkFkbWluIiwiSXNDdXN0b21lciI6ImZhbHNlIiwiZXhwIjoxNzY3MTAwODE3LCJpc3MiOiJodHRwczovL215d2ViYXBpLmNvbSIsImF1ZCI6Imh0dHBzOi8vbXl3ZWJhcGkuY29tIn0.ed2joGgBAt2S4M4NZs0dl24N-rFbyCr9czX8GtnwGTo";
        const headers = { 'Authorization': `Bearer ${FALLBACK_TOKEN}` };

        // Check DoctorID=32 with FromDate/ToDate
        console.log('--- DoctorID=32 ---');
        // Using Mode=1
        const res32 = await axios.get('http://localhost:3000/api/Appointments/getAppointments?PageSize=10&PageNumber=1&Mode=1&DoctorID=32&FromDate=1900-01-01&ToDate=2100-01-01', { headers });
        if (Array.isArray(res32.data)) {
            console.log(`Count: ${res32.data.length}`);
            res32.data.slice(0, 5).forEach(apt => {
                console.log(`Doc: ${apt.DoctorName}`);
            });
        }

    } catch (e) {
        console.error('Error:', e.message);
        if (e.response) console.log('Status', e.response.status);
    }
}

testContentV2();
