const axios = require('axios');

async function testLeadsResponse() {
    try {
        console.log('Fetching leads...');
        const FALLBACK_TOKEN = "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiMSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6IkFkbWluIiwiSXNDdXN0b21lciI6ImZhbHNlIiwiZXhwIjoxNzY3MTAwODE3LCJpc3MiOiJodHRwczovL215d2ViYXBpLmNvbSIsImF1ZCI6Imh0dHBzOi8vbXl3ZWJhcGkuY29tIn0.ed2joGgBAt2S4M4NZs0dl24N-rFbyCr9czX8GtnwGTo";
        const headers = { 'Authorization': `Bearer ${FALLBACK_TOKEN}` };

        const res = await axios.get('http://localhost:3000/api/Leads/getLeads?PageSize=5&PageNumber=1', { headers });

        console.log('Response Status:', res.status);
        if (Array.isArray(res.data) && res.data.length > 0) {
            const firstLead = res.data[0];
            console.log('--- First Lead Structure ---');
            console.log(JSON.stringify(firstLead, null, 2));
            
            // Check specific keys
            console.log('--- Key Checks ---');
            console.log('clinicName:', firstLead.clinicName);
            console.log('ClinicName:', firstLead.ClinicName);
            console.log('sourceName:', firstLead.sourceName);
            console.log('SourceName:', firstLead.SourceName);
        } else {
            console.log('No leads found or data is not an array.');
        } 

    } catch (e) {
        console.error('Error:', e.message);
        if (e.response) {
            console.log('Data:', JSON.stringify(e.response.data));
        }
    }
}

testLeadsResponse();
