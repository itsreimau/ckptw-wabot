const axios = require("axios");
const mime = require("mime-types");

async function json(url, headers = {}) {
    try {
        const response = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
                ...headers
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error:", error);
    }
}

async function buffer(url, headers = {}) {
    try {
        const response = await axios.get(url, {
            responseType: "arraybuffer",
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
                ...headers
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error:", error);
    }
}

module.exports = {
    json,
    buffer
};