const axios = require('axios');

const BASE_URL = "https://bmetrics.in/APIDemo/api";
const AUTH_CREDS = {
    userId: "Admin",
    userPassword: "#Ortho#$Admin"
};

async function run() {
    try {
        console.log("1. Authenticating...");
        const authRes = await axios.post(`${BASE_URL}/Auth/Login`, AUTH_CREDS);
        const token = authRes.data.token || authRes.data.accessToken || authRes.data;
        
        console.log("Token received.");

        // Try payload closer to the original CURL example
        const payload = {
            "doctorID": 0,
            "doctorTypeID": 1,
            "clinicID": 1,
            "regDate": new Date().toISOString(),
            "firstName": "DebugUser",
            "middleName": "string", // Reverted to "string"
            "lastName": "DebugLast",
            "gender": "male",
            "email": "debug.user2@example.com",
            "bloodGroup": "string",
            "mobile1": "1234567890",
            "mobile2": "string",
            "residential_Address": "string",
            "line1": "string",
            "line2": "string",
            "countryID": 0,
            "stateID": 0,
            "cityID": 0,
            "locationID": 0,
            "modifiedDate": new Date().toISOString(),
            "modifiedBy": 0,
            "isActive": true,
            "isDeleted": false, // CURL had true, but usually false for create
            "otp": "string",
            "areaPin": "string",
            "userName": "string",
            "password": "string",
            "dob": new Date().toISOString(),
            "registrationNo": "string",
            "panCardNo": "string",
            "panCardImageUrl": "string",
            "adharCardNo": "string",
            "adharCardImageUrl": "string",
            "profileImageUrl": "string",
            "registrationImageUrl": "string",
            "identityPolicyNo": "string",
            "identityPolicyImageUrl": "string",
            "roleID": 0,
            "createdDate": new Date().toISOString(),
            "inTime": "string",
            "outTime": "string",
            "isExistUser": true,
            "isTermAccept": true,
            "specialityID": "string",
            "basicDegree": "string",
            "degreeUpload1": "string",
            "degreeUpload2": "string"
        };
        
        // NOTE: I am trying "active: true, isDeleted: false"
        // Also reverted optional fields to "string" to match the CURL exactly

        console.log("2. Sending Payload (Mocking CURL)...");
        const res = await axios.post(`${BASE_URL}/Doctor/AddDoctor`, payload, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        console.log("SUCCESS!", res.status, res.data);

    } catch (error) {
        console.error("FAILED!", error.response ? error.response.status : error.message);
        if (error.response) console.log(JSON.stringify(error.response.data, null, 2));
    }
}

run();
