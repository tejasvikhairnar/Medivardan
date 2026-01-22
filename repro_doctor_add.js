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
        
        if (!token) throw new Error("No token received");
        console.log("Token received:", token.substring(0, 20) + "...");

        const payload = {
            mode: 1,
            doctorID: 0,
            clinicID: 1,
            doctorTypeID: 1,
            firstName: "Debug",
            lastName: "User",
            middleName: "", // Tried "" instead of "string"
            gender: "male",
            dob: new Date().toISOString(),
            bloodGroup: "",
            mobile1: "1234567890", // Mandatory
            mobile2: "",
            email: "debug.user@example.com", // Mandatory
            residential_Address: "",
            line1: "",
            line2: "",
            areaPin: "",
            cityID: 0,
            stateID: 0,
            countryID: 0,
            locationID: 0,
            specialityID: "1",
            basicDegree: "BDS",
            degreeUpload1: "",
            degreeUpload2: "",
            registrationNo: "REG123", // Mandatory
            registrationImageUrl: "",
            panCardNo: "ABCDE1234F", // Mandatory
            panCardImageUrl: "",
            adharCardNo: "",
            adharCardImageUrl: "",
            identityPolicyNo: "POL123", // Mandatory
            identityPolicyImageUrl: "",
            profileImageUrl: "",
            inTime: "09:00:00",
            outTime: "18:00:00",
            regDate: new Date().toISOString(),
            userName: "debug.user@example.com",
            password: "Password@123",
            roleID: 2,
            isActive: true,
            isDeleted: false,
            isExistUser: true,
            isTermAccept: true,
            modifiedDate: new Date().toISOString(),
            modifiedBy: 0,
            createdDate: new Date().toISOString(),
            otp: ""
        };

        console.log("2. Sending Payload to AddDoctor...");
        console.log(JSON.stringify(payload, null, 2));

        const res = await axios.post(`${BASE_URL}/Doctor/AddDoctor`, payload, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log("SUCCESS!");
        console.log(res.status, res.data);

    } catch (error) {
        console.error("FAILED!");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    }
}

run();
