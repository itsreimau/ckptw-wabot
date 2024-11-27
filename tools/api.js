// Daftar API gratis, gunakan dengan bijak!
const APIs = {
    agatz: {
        baseURL: "https://api.agatz.xyz"
    },
    cifumo: {
        baseURL: "https://rest.cifumo.biz.id"
    },
    itzpire: {
        baseURL: "https://itzpire.com"
    },
    neastooid: {
        baseURL: "https://api.neastooid.xyz"
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
    siputzx: {
        baseURL: "https://api.siputzx.my.id"
    },
    ssateam: {
        baseURL: "https://api.ssateam.my.id",
        APIKey: "root" // APIKey disediakan oleh Fainshe
    },
    vreden: {
        baseURL: "https://api.vreden.my.id"
    }
};

function createUrl(apiNameOrURL, endpoint, params = {}, apiKeyParamName = null, decodeParams = false) {
    try {
        const api = APIs[apiNameOrURL];
        const baseURL = api ? api.baseURL : new URL(apiNameOrURL).origin;
        const apiUrl = new URL(endpoint, baseURL);

        let queryParams;

        if (decodeParams) {
            queryParams = Object.entries(params).map(([key, value]) => `${encodeURIComponent(key)}=${decodeURIComponent(value)}`).join("&");
        } else {
            queryParams = new URLSearchParams(params).toString();
        }

        if (apiKeyParamName && api && "APIKey" in api) {
            const apiKeyValue = encodeURIComponent(api.APIKey);
            queryParams += (queryParams ? "&" : "") + `${encodeURIComponent(apiKeyParamName)}=${apiKeyValue}`;
        }

        apiUrl.search = queryParams;

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