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
        
        // Exact CURL Payload
        const payload = {
          "doctorID": 0,
          "doctorTypeID": 0, // CURL had 0
          "clinicID": 0, // CURL had 0
          "regDate": "2026-01-14T07:06:49.429Z",
          "firstName": "string",
          "middleName": "string",
          "lastName": "string",
          "gender": "string",
          "email": "string" + Math.random(), // Randomize to avoid dupes
          "bloodGroup": "string",
          "mobile1": "string",
          "mobile2": "string",
          "residential_Address": "string",
          "line1": "string",
          "line2": "string",
          "countryID": 0,
          "stateID": 0,
          "cityID": 0,
          "locationID": 0,
          "modifiedDate": "string",
          "modifiedBy": 0,
          "isActive": true,
          "isDeleted": true, // CURL had true
          "otp": "string",
          "areaPin": "string",
          "userName": "string",
          "password": "string",
          "dob": "string",
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
          "createdDate": "string",
          "inTime": "string",
          "outTime": "string",
          "isExistUser": true,
          "isTermAccept": true,
          "specialityID": "string",
          "basicDegree": "string",
          "degreeUpload1": "string",
          "degreeUpload2": "string"
        };
        
        console.log("Sending EXACT CURL-like Payload...");
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
