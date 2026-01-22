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

        const payload = {
          "doctorID": 0,
          "doctorTypeID": 1,
          "clinicID": 4, // Using 4 as seen in valid data
          "regDate": new Date().toISOString(),
          "firstName": "Minimal",
          "lastName": "Test",
          "middleName": null,
          "gender": "male",
          "email": `test.min.${Date.now()}@example.com`,
          "bloodGroup": null,
          "mobile1": "9876543210",
          "mobile2": null,
          "residential_Address": null,
          "line1": null,
          "line2": null,
          "countryID": 0,
          "stateID": 0,
          "cityID": 0,
          "locationID": 0,
          "modifiedDate": new Date().toISOString(),
          "modifiedBy": 0,
          "isActive": true,
          "isDeleted": false,
          "otp": null,
          "areaPin": null,
          "userName": `test.min.${Date.now()}@example.com`,
          "password": "Password@123",
          "dob": new Date().toISOString(),
          "registrationNo": "REG999",
          "panCardNo": "PAN999999",
          "panCardImageUrl": null,
          "adharCardNo": null,
          "adharCardImageUrl": null,
          "profileImageUrl": null,
          "registrationImageUrl": null,
          "identityPolicyNo": null,
          "identityPolicyImageUrl": null,
          "roleID": 2,
          "createdDate": new Date().toISOString(),
          "inTime": "09:00",
          "outTime": "18:00",
          "isExistUser": false, // False for new user?
          "isTermAccept": true,
          "specialityID": "1",
          "basicDegree": "BDS",
          "degreeUpload1": null,
          "degreeUpload2": null
        };
        
        console.log("Sending Minimal Payload...");
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
