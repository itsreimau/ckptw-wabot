// Daftar API gratis, gunakan dengan bijak!
const APIs = {
    agatz: {
        baseURL: "https://api.agatz.xyz"
    },
    btch: {
        baseURL: "https://btch.us.kg"
    },
    fasturl: {
        baseURL: "https://fastrestapis.fasturl.cloud",
        APIKey: "ckptw-wabot" // APIKey disediakan oleh ItsReimau
    },
    itzpire: {
        baseURL: "https://itzpire.com"
    },
    nexoracle: {
        baseURL: "https://api.nexoracle.com",
        APIKey: "free_key@maher_apis" // APIKey disediakan oleh Maher Zubair
    },
    nyxs: {
        baseURL: "https://api.nyxs.pw"
    },
    sandipbaruwal: {
        baseURL: "https://sandipbaruwal.onrender.com"
    },
    siputzx: {
        baseURL: "https://api.siputzx.my.id"
    },
    ssateam: {
        baseURL: "https://api.ssateam.my.id",
        APIKey: "root" // APIKey disediakan oleh Fainshe
    },
    toxicdevil: {
        baseURL: "https://toxicdevilapi.vercel.app"
    },
    vreden: {
        baseURL: "https://api.vreden.my.id"
    }
};

function createUrl(apiNameOrURL, endpoint, params = {}, apiKeyParamName, noEncodeParams = []) {
    try {
        const api = APIs[apiNameOrURL];
        if (!api) {
            const url = new URL(apiNameOrURL);
            apiNameOrURL = url;
        }

        const queryParams = [];
        for (const [key, value] of Object.entries(params)) {
            if (noEncodeParams.includes(key)) {
                queryParams.push(`${key}=${value}`);
            } else {
                queryParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
            }
        }

        if (apiKeyParamName && api && "APIKey" in api) {
            queryParams.push(`${encodeURIComponent(apiKeyParamName)}=${encodeURIComponent(api.APIKey)}`);
        }

        const baseURL = api ? api.baseURL : apiNameOrURL.origin;
        const apiUrl = new URL(endpoint, baseURL);
        apiUrl.search = queryParams.join('&');

        return apiUrl.toString();
    } catch (error) {
        console.error(`[${config.pkg.name}] Error:`, error);
        return null;
    }
}

function listUrl() {
    return APIs;
}

module.exports = {
    createUrl,
    listUrl
};