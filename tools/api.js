// Daftar API gratis, gunakan dengan bijak!
const APIs = {
    aemt: {
        baseURL: "https://aemt.uk.to"
    },
    agatz: {
        baseURL: "https://api.agatz.xyz"
    },
    aggelos_007: {
        baseURL: "https://api.aggelos-007.xyz"
    },
    chiwa: {
        baseURL: "https://api.chiwa.my.id"
    },
    exonity: {
        baseURL: "https://exonity.tech",
        APIKey: "adminsepuh"
    },
    itzpire: {
        baseURL: "https://itzpire.com"
    },
    lenwy: {
        baseURL: "https://api-lenwy.vercel.app"
    },
    miyan: {
        baseURL: "https://miyanapi.vercel.app"
    },
    nexoracle: {
        baseURL: "https://api.nexoracle.com",
        APIKey: "free_key@maher_apis" // APIKey disediakan oleh Maher Zubair
    },
    nyxs: {
        baseURL: "https://api.nyxs.pw"
    },
    ryzendesu: {
        baseURL: "https://api.ryzendesu.vip"
    },
    sandipbaruwal: {
        baseURL: "https://sandipbaruwal.onrender.com"
    },
    vreden: {
        baseURL: "https://api.vreden.my.id"
    },
    wudysoft: {
        baseURL: "https://wudysoft.us.kg"
    },
    zenith: {
        baseURL: "https://api-zenith.koyeb.app",
        APIKey: "zenkey" // APIKey disediakan oleh Zenith
    }
};

function createUrl(apiNameOrURL, endpoint, params = {}, apiKeyParamName) {
    try {
        const api = APIs[apiNameOrURL];

        if (!api) {
            const url = new URL(apiNameOrURL);
            apiNameOrURL = url;
        }

        const queryParams = new URLSearchParams(params);

        if (apiKeyParamName && api && "APIKey" in api) {
            queryParams.set(apiKeyParamName, api.APIKey);
        }

        const baseURL = api ? api.baseURL : apiNameOrURL.origin;
        const apiUrl = new URL(endpoint, baseURL);
        apiUrl.search = queryParams.toString();

        return apiUrl.toString();
    } catch (error) {
        console.error(`[${config.pkg.name}] Error:`, error);
    }
}

function listUrl() {
    return APIs;
}

module.exports = {
    createUrl,
    listUrl
};