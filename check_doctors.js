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

        console.log("Listing Doctors...");
        const res = await axios.get(`${BASE_URL}/Doctor/search`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        console.log("Status:", res.status);
        if (Array.isArray(res.data) && res.data.length > 0) {
            console.log("First Doctor:", JSON.stringify(res.data[0], null, 2));
        } else {
             console.log("Data:", JSON.stringify(res.data, null, 2));
        }

    } catch (error) {
        console.error("FAILED!", error.response ? error.response.status : error.message);
    }
}

run();
