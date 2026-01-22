const axios = require('axios');

const API_URL = "https://bmetrics.in/APIDemo/api/Doctor/AddDoctor";
const TOKEN = "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiMSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6IkFkbWluIiwiSXNDdXN0b21lciI6ImZhbHNlIiwiZXhwIjoxNzY4ODI4OTQ5LCJpc3MiOiJodHRwczovL215d2ViYXBpLmNvbSIsImF1ZCI6Imh0dHBzOi8vbXl3ZWJhcGkuY29tIn0.wFnksb3ThQwk7M1H2UFWc_hKN28xfehcjrKEaCiReoc";

const uniqueId = Math.floor(Math.random() * 10000);
const email = "test.min" + uniqueId + "@gmail.com";

const payload = {
  "doctorID": 0,
  "clinicID": 4,
  "firstName": "Mini",
  "lastName": "Mal",
  "email": email,
  "mobile1": "9" + Math.floor(100000000 + Math.random() * 900000000),
  "inTime": "09:00",
  "outTime": "18:00",
  
  // Likely required but trying minimum
  "doctorTypeID": 1, 
  "gender": "Male",
  "bloodGroup": "O+",
  
  // Trying to avoid user fields or complex dates
  "isExistUser": false,
  "userName": email, 
  "password": "Password123"
};

async function testAdd() {
    try {
        console.log("Sending minimal payload...", JSON.stringify(payload, null, 2));
        
        const response = await axios.post(API_URL, payload, {
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

testAdd();
