const axios = require('axios');

const BASE_URL = "https://bmetrics.in/APIDemo/api";
const AUTH_CREDS = {
    userId: "Admin",
    userPassword: "#Ortho#$Admin"
};

function getLocalISO(date) {
    // YYYY-MM-DDTHH:mm:ss
    const pad = (n) => n.toString().padStart(2, '0');
    return date.getFullYear() +
      '-' + pad(date.getMonth() + 1) +
      '-' + pad(date.getDate()) +
      'T' + pad(date.getHours()) +
      ':' + pad(date.getMinutes()) +
      ':' + pad(date.getSeconds());
}

async function tryDate(dateStr, label) {
    try {
        console.log(`Testing ${label}: ${dateStr}`);
        const authRes = await axios.post(`${BASE_URL}/Auth/Login`, AUTH_CREDS);
        const token = authRes.data.token || authRes.data.accessToken || authRes.data;

        const payload = {
          "doctorID": 0,
          "doctorTypeID": 1,
          "clinicID": 4, 
          "regDate": dateStr,
          "firstName": "DateTest",
          "lastName": label,
          "middleName": null,
          "gender": "male",
          "email": `date.${label}.${Date.now()}@example.com`,
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
          "modifiedDate": dateStr, // Use same date
          "modifiedBy": 0,
          "isActive": true,
          "isDeleted": false,
          "otp": null,
          "areaPin": null,
          "userName": `date.${label}.${Date.now()}@example.com`,
          "password": "Password@123",
          "dob": dateStr, 
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
          "createdDate": dateStr,
          "inTime": "09:00",
          "outTime": "18:00",
          "isExistUser": false,
          "isTermAccept": true,
          "specialityID": "1",
          "basicDegree": "BDS",
          "degreeUpload1": null,
          "degreeUpload2": null
        };
        
        const res = await axios.post(`${BASE_URL}/Doctor/AddDoctor`, payload, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log(`SUCCESS [${label}]!`, res.status);
        return true;
    } catch (error) {
        console.error(`FAILED [${label}]`, error.response ? error.response.status : error.message);
        if (error.response && error.response.status !== 500) {
            console.log(JSON.stringify(error.response.data).substring(0, 200));
        }
        return false;
    }
}

async function run() {
    const d = new Date();
    
    // 1. ISO No Z
    await tryDate(getLocalISO(d), "ISO_NoZ");

    // 2. Simple Date
    const simple = d.toISOString().split('T')[0];
    await tryDate(simple, "SimpleDate");

    // 3. Simple Date + T00:00:00
    await tryDate(simple + "T00:00:00", "Midnight");
}

run();
