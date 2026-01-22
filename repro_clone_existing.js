const axios = require('axios');

const BASE_URL = "https://bmetrics.in/APIDemo/api";
const AUTH_CREDS = {
    userId: "Admin",
    userPassword: "#Ortho#$Admin"
};

async function run() {
    try {
        console.log("Authenticating...");
        const authRes = await axios.post(`${BASE_URL}/Auth/Login`, AUTH_CREDS);
        const token = authRes.data.token || authRes.data.accessToken || authRes.data;

        console.log("Getting existing doctor...");
        const getRes = await axios.get(`${BASE_URL}/Doctor/search`, {
             headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!getRes.data || getRes.data.length === 0) {
            console.log("No doctors found to clone.");
            return;
        }

        const validDoctor = getRes.data[0];
        console.log("Found valid doctor ID:", validDoctor.doctorID);

        // CLONE IT
        const payload = {
            ...validDoctor,
            doctorID: 0, // Create new
            firstName: "CloneTest",
            email: `clone.${Date.now()}@test.com`,
            mobile1: `9${Math.floor(Math.random() * 1000000000)}`,
            userName: `clone.${Date.now()}@test.com`,
            regDate: new Date().toISOString(), // Use fresh date
            createdDate: new Date().toISOString(),
            modifiedDate: new Date().toISOString(),
        };

        // Ensure we don't send ID fields that shouldn't be sent?
        // Usually sending everything is fine if ignored.
        
        console.log("Sending CLONED Payload...");
        const res = await axios.post(`${BASE_URL}/Doctor/AddDoctor`, payload, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        console.log("SUCCESS!", res.status);
    } catch (error) {
        console.error("FAILED!", error.response ? error.response.status : error.message);
        if (error.response) console.log(JSON.stringify(error.response.data, null, 2));
    }
}

run();
