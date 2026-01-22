const axios = require('axios');

const BASE_URL = "https://bmetrics.in/APIDemo/api";
const AUTH_CREDS = {
    userId: "Admin",
    userPassword: "#Ortho#$Admin"
};

function formatCustomDate(date) {
    // Format: YYYY-MM-DD HH:mm:ss
    const pad = (n) => n.toString().padStart(2, '0');
    const yyyy = date.getFullYear();
    const MM = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const mm = pad(date.getMinutes());
    const ss = pad(date.getSeconds());
    return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`;
}

async function run() {
    try {
        console.log("Authenticating...");
        const authRes = await axios.post(`${BASE_URL}/Auth/Login`, AUTH_CREDS);
        const token = authRes.data.token || authRes.data.accessToken || authRes.data;

        // Clone/Minimal with correct date format
        const nowStr = formatCustomDate(new Date());
        console.log("Using Date Format:", nowStr);

        const payload = {
          "doctorID": 0,
          "doctorTypeID": 1,
          "clinicID": 4, 
          "regDate": nowStr,
          "firstName": "DateTest",
          "lastName": "Format",
          "middleName": null,
          "gender": "male",
          "email": `date.test.${Date.now()}@example.com`,
          "bloodGroup": null,
          "mobile1": `9${Math.floor(Math.random() * 1000000000)}`,
          "mobile2": null,
          "residential_Address": null,
          "line1": null,
          "line2": null,
          "countryID": 0,
          "stateID": 0,
          "cityID": 0,
          "locationID": 0,
          "modifiedDate": nowStr,
          "modifiedBy": 0,
          "isActive": true,
          "isDeleted": false,
          "otp": null,
          "areaPin": null,
          "userName": `date.test.${Date.now()}@example.com`,
          "password": "Password@123",
          "dob": nowStr, // Also use it here
          "registrationNo": "REGDATE1",
          "panCardNo": "PANDATE123",
          "panCardImageUrl": null,
          "adharCardNo": null,
          "adharCardImageUrl": null,
          "profileImageUrl": null,
          "registrationImageUrl": null,
          "identityPolicyNo": null,
          "identityPolicyImageUrl": null,
          "roleID": 2,
          "createdDate": nowStr,
          "inTime": "09:00",
          "outTime": "18:00",
          "isExistUser": false,
          "isTermAccept": true,
          "specialityID": "1",
          "basicDegree": "BDS",
          "degreeUpload1": null,
          "degreeUpload2": null
        };
        
        console.log("Sending Payload with Custom Date...");
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
