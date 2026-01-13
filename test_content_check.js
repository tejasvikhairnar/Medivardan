const axios = require('axios');

async function testContent() {
    try {
        console.log('Checking Content...');
        const FALLBACK_TOKEN = "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiMSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6IkFkbWluIiwiSXNDdXN0b21lciI6ImZhbHNlIiwiZXhwIjoxNzY3MTAwODE3LCJpc3MiOiJodHRwczovL215d2ViYXBpLmNvbSIsImF1ZCI6Imh0dHBzOi8vbXl3ZWJhcGkuY29tIn0.ed2joGgBAt2S4M4NZs0dl24N-rFbyCr9czX8GtnwGTo";
        const headers = { 'Authorization': `Bearer ${FALLBACK_TOKEN}` };

        // Check DoctorID=32
        console.log('--- DoctorID=32 ---');
        const res32 = await axios.get('http://localhost:3000/api/Appointments/getAppointments?PageSize=10&PageNumber=1&Mode=1&DoctorID=32&fromDate=1900-01-01&toDate=2100-01-01', { headers });
        if (Array.isArray(res32.data)) {
            res32.data.forEach(apt => {
                console.log(`ID: ${apt.AppointmentID}, Doc: ${apt.DoctorName} (ID: ${apt.DoctorID})`);
            });
        }

        // Check DoctorID=1
        console.log('--- DoctorID=1 ---');
        const res1 = await axios.get('http://localhost:3000/api/Appointments/getAppointments?PageSize=10&PageNumber=1&Mode=1&DoctorID=1&fromDate=1900-01-01&toDate=2100-01-01', { headers });
        if (Array.isArray(res1.data)) {
            res1.data.forEach(apt => {
                console.log(`ID: ${apt.AppointmentID}, Doc: ${apt.DoctorName} (ID: ${apt.DoctorID})`);
            });
        }

    } catch (e) {
        console.error('Error:', e.message);
    }
}

testContent();
