const APIs = {
    agatz: {
        baseURL: "https://api.agatz.xyz"
    },
    aggelos_007: {
        baseURL: "https://api.aggelos-007.xyz"
    },
    ai_xterm: {
        baseURL: "https://ai.xterm.codes"
    },
    alpis: {
        baseURL: "https://alpis.eu.org"
    },
    betabotz: {
        baseURL: "https://api.betabotz.eu.org"
    },
    botcahx: {
        baseURL: "https://api.botcahx.eu.org"
    },
    chiwa: {
        baseURL: "https://api.chiwa.my.id"
    },
    deku: {
        baseURL: "https://deku-rest-api.gleeze.com"
    },
    fasturl: {
        baseURL: "https://fastrestapis.fasturl.cloud"
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
    maher_zubair: {
        baseURL: "https://api.maher-zubair.tech"
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
    ngodingaja: {
        baseURL: "https://api.ngodingaja.my.id"
    },
    nyxs: {
        baseURL: "https://api.nyxs.pw"
    },
    ryzendesu: {
        baseURL: "https://apis.ryzendesu.vip"
    },
    sanzy: {
        baseURL: "https://api.sanzy.co"
    },
    sandipbaruwal: {
        baseURL: "https://sandipbaruwal.onrender.com"
    },
    skizo: {
        baseURL: "https://skizo.tech"
    },
    ssa: {
        baseURL: "https://ssa-api.vercel.app"
    },
    tiklydown: {
        baseURL: "https://api.tiklydown.eu.org"
    },
    vihangayt: {
        baseURL: "https://api.vihangayt.asia"
    },
    vkrdownloader: {
        baseURL: "https://vkrdownloader.vercel.app"
    },
    widipe: {
        baseURL: "https://widipe.com"
    },
    xfarr: {
        baseURL: "https://api.xfarr.com"
    },
    yanzbotz: {
        baseURL: "https://api.yanzbotz.my.id"
    }
};

exports.createAPIUrl = (apiNameOrURL, endpoint, params = {}, apiKeyParamName) => {
    const api = APIs[apiNameOrURL];

    if (!api) {
        try {
            const url = new URL(apiNameOrURL);
            apiNameOrURL = url;
        } catch (error) {
            throw new Error(`Invalid API name or custom URL: ${apiNameOrURL}`);
        }
    }

    const queryParams = new URLSearchParams(params);

    if (apiKeyParamName && api && "APIKey" in api) queryParams.set(apiKeyParamName, api.APIKey);

    const apiUrl = new URL(endpoint, api ? api.baseURL : apiNameOrURL.origin);
    apiUrl.search = queryParams.toString();

    return apiUrl.toString();
};

exports.listAPIUrl = () => {
    return APIs;
}