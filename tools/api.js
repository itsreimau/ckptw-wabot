const util = require("node:util");

// Daftar API gratis
const APIs = {
    archive: {
        baseURL: "https://archive.lick.eu.org"
    },
    bk9: {
        baseURL: "https://bk9.fun"
    },
    diibot: {
        baseURL: "https://api.diioffc.web.id"
    },
    falcon: {
        baseURL: "https://flowfalcon.dpdns.org"
    },
    nekorinn: {
        baseURL: "https://api.nekorinn.my.id"
    },
    nirkyy: {
        baseURL: "https://nirkyy-dev.hf.space"
    },
    paxsenix: {
        baseURL: "https://dev-paxsenix.koyeb.app"
    },
    siputzx: {
        baseURL: "https://api.siputzx.my.id"
    },
    skyzopedia: {
        baseURL: "https://restapi-v2.simplebot.my.id"
    },
    zell: {
        baseURL: "https://zellapi.autos"
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
        if (apiKeyParamName && api && "APIKey" in api) queryParams.set(apiKeyParamName, api.APIKey);

        const baseURL = api ? api.baseURL : apiNameOrURL.origin;
        const apiUrl = new URL(endpoint, baseURL);
        apiUrl.search = queryParams.toString();

        return apiUrl.toString();
    } catch (error) {
        consolefy.error(`Error: ${util.format(error)}`);
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