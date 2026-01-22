const axios = require('axios');

const ADD_URL = "https://bmetrics.in/APIDemo/api/DoctorRegistration/UpsertDoctor";
const TOKEN = "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiMSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6IkFkbWluIiwiSXNDdXN0b21lciI6ImZhbHNlIiwiZXhwIjoxNzY4ODI4OTQ5LCJpc3MiOiJodHRwczovL215d2ViYXBpLmNvbSIsImF1ZCI6Imh0dHBzOi8vbXl3ZWJhcGkuY29tIn0.wFnksb3ThQwk7M1H2UFWc_hKN28xfehcjrKEaCiReoc";

const uniqueId = Math.floor(Math.random() * 10000);
const email = "test.final" + uniqueId + "@gmail.com";

const payload = {
  "doctorID": 0,
  "doctorTypeID": 1,
  "clinicID": 4,
  "regDate": "2025-12-24T10:30:00", // Using a fixed valid date format
  "firstName": "TestFinal",
  "middleName": "",
  "lastName": "Doctor",
  "gender": "Male",
  "email": email,
  "bloodGroup": "O+",
  "mobile1": "9" + Math.floor(100000000 + Math.random() * 900000000), // Random 10 digit
  "mobile2": "",
  "residential_Address": "",
  "line1": "Test Address",
  "line2": "",
  "countryID": null,
  "stateID": null,
  "cityID": null,
  "locationID": null,
  "modifiedDate": new Date().toISOString(),
  "modifiedBy": null,
  "isActive": true,
  "isDeleted": false,
  "otp": null,
  "areaPin": "123456",
  
  // User fields
  "userName": email, 
  "password": "StrongPassword@123", // Strong password
  "isExistUser": false, // Creating new
  
  "dob": "1990-01-01T00:00:00",
  "registrationNo": "TESTFINAL",
  "panCardNo": "",
  "panCardImageUrl": "",
  "adharCardNo": "",
  "adharCardImageUrl": "",
  "profileImageUrl": "",
  "registrationImageUrl": "",
  "identityPolicyNo": "",
  "identityPolicyImageUrl": "",
  "roleID": 2, // Doctor Role
  "createdDate": new Date().toISOString(),
  "inTime": "09:00",
  "outTime": "18:00",
  "isTermAccept": true,
  "specialityID": null, // Verified valid
  "basicDegree": "BDS",
  "degreeUpload1": "",
  "degreeUpload2": ""
};

async function testFinal() {
    try {
        console.log("Sending FINAL payload...", JSON.stringify(payload, null, 2));
        
        const response = await axios.post(ADD_URL, payload, {
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log("Success! Status:", response.status);
        console.log("Response Data:", JSON.stringify(response.data, null, 2));

    } catch (error) {
        console.error("Error Status:", error.response ? error.response.status : "Unknown");
        console.error("Error Data:", error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    }
}

testFinal();
