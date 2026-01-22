const axios = require('axios');
const fs = require('fs');

async function downloadSwagger() {
    try {
        const url = "https://bmetrics.in/APIDemo/swagger/v1/swagger.json";
        console.log("Downloading Swagger from:", url);
        const response = await axios.get(url);
        fs.writeFileSync('swagger.json', JSON.stringify(response.data, null, 2));
        console.log("Saved swagger.json");
    } catch (error) {
        console.error("Error downloading swagger:", error.message);
    }
}

downloadSwagger();
