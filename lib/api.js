const APIs = {
    ai_tools: {
        baseURL: 'https://ai-tools.replit.app'
    },
    vihangayt: {
        baseURL: 'https://vihangayt.me'
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

    if (apiKeyParamName && api && 'APIKey' in api) {
        queryParams.set(apiKeyParamName, api.APIKey);
    }

    const apiUrl = new URL(endpoint, api ? api.baseURL : apiNameOrURL.origin);
    apiUrl.search = queryParams.toString();

    return apiUrl.toString();
}