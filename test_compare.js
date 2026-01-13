const axios = require('axios');

async function comparePagination() {
    try {
        console.log('Comparing Pagination...');
        
        const FALLBACK_TOKEN = "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiMSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6IkFkbWluIiwiSXNDdXN0b21lciI6ImZhbHNlIiwiZXhwIjoxNzY3MTAwODE3LCJpc3MiOiJodHRwczovL215d2ViYXBpLmNvbSIsImF1ZCI6Imh0dHBzOi8vbXl3ZWJhcGkuY29tIn0.ed2joGgBAt2S4M4NZs0dl24N-rFbyCr9czX8GtnwGTo";
        const headers = { 'Authorization': `Bearer ${FALLBACK_TOKEN}` };

        // Test Leads (Known Good?)
        console.log('Testing Leads PageSize=5...');
        // Leads requires fromDate/toDate usually?
        try {
            const resLeads = await axios.get('http://localhost:3000/api/Leads/getLeads?PageSize=5&PageNumber=1&fromDate=1900-01-01&toDate=2100-01-01', { headers });
            console.log(`Leads PageSize=5 Result: ${Array.isArray(resLeads.data) ? resLeads.data.length : 'Not Array'}`);
        } catch(e) { console.log('Leads Error:', e.message); }

        // Test Appointments
        console.log('Testing Appointments PageSize=5...');
        try {
            const resApt = await axios.get('http://localhost:3000/api/Appointments/getAppointments?PageSize=5&PageNumber=1&Mode=1&DoctorID=32&FromDate=1900-01-01&ToDate=2100-01-01', { headers });
            console.log(`Appointments PageSize=5 Result: ${Array.isArray(resApt.data) ? resApt.data.length : 'Not Array'}`);
        } catch(e) { console.log('Apt Error:', e.message); }

    } catch (e) {
        console.error('Error:', e.message);
    }
}

comparePagination();
