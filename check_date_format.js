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

        console.log("Fetching one doctor...");
        const res = await axios.get(`${BASE_URL}/Doctor/search`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.data && res.data.length > 0) {
            const doc = res.data[0];
            console.log("Raw regDate:", doc.regDate);
            console.log("Raw createdDate:", doc.createdDate);
            console.log("Raw dob:", doc.dob);
            console.log("Full Doctor Object:", JSON.stringify(doc, null, 2));
        } else {
            console.log("No doctors found.");
        }

    } catch (error) {
        console.error("FAILED!", error.message);
    }
}

run();
