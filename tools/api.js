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
    ochinpo: {
        baseURL: "https://ochinpo-helper.hf.space"
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