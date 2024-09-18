// Daftar API gratis, gunakan dengan bijak!
const APIs = {
    agatz: {
        baseURL: "https://api.agatz.xyz"
    },
    aggelos_007: {
        baseURL: "https://api.aggelos-007.xyz"
    },
    chiwa: {
        baseURL: "https://api.chiwa.my.id"
    },
    deku: {
        baseURL: "https://deku-rest-api.gleeze.com"
    },
    fasturl: {
        baseURL: "https://fastrestapis.fasturl.cloud",
        APIKey: "8f03c932-7c66-4194-a245-b3ba83e556a8" // Buat kunci API Anda sendiri, jangan gunakan yang ini!
    },
    firda: {
        baseURL: "https://api.firda.uz"
    },
    helixia: {
        baseURL: "https://api.helixia.xyz"
    },
    hercai: {
        baseURL: "https://hercai.onrender.com"
    },
    imphnen_ai: {
        baseURL: "https://imphnen-ai.vercel.app"
    },
    itzpire: {
        baseURL: "https://itzpire.site"
    },
    kyuurzy: {
        baseURL: "https://api.kyuurzy.site"
    },
    lolhuman: {
        baseURL: "https://api.lolhuman.xyz"
    },
    manaxu_seven: {
        baseURL: "https://manaxu-seven.vercel.app"
    },
    matbasing: {
        baseURL: "https://matbasing.glitch.me"
    },
    miwudev: {
        baseURL: "https://openapi.miwudev.my.id"
    },
    nyxs: {
        baseURL: "https://api.nyxs.pw"
    },
    sandipbaruwal: {
        baseURL: "https://sandipbaruwal.onrender.com"
    },
    ssa: {
        baseURL: "https://ssa-api.vercel.app"
    },
    vkrdownloader: {
        baseURL: "https://vkrdownloader.vercel.app"
    },
    widipe: {
        baseURL: "https://widipe.com"
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
        console.error(`[${global.config.pkg.name}] Error:`, error);
    }
}

function listUrl() {
    return APIs;
}

module.exports = {
    createUrl,
    listUrl
};