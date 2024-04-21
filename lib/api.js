const APIs = {
    aemt: {
        baseURL: 'https://aemt.me'
    },
    itzpire: {
        baseURL: 'https://itzpire.site'
    },
    miwudev: {
        baseURL: 'https://openapi.miwudev.my.id'
    },
    sandipbaruwal: {
        baseURL: 'https://sandipbaruwal.onrender.com'
    }
};

/**
 * Creates an API URL based on the provided API name, endpoint, and optional parameters.
 * If the provided API name is not found in the predefined APIs, it assumes the API name is a custom URL.
 * @param {string} apiNameOrURL The name of the API or a custom URL.
 * @param {string} endpoint The endpoint of the API.
 * @param {Object} params (Optional) Query parameters to be appended to the URL.
 * @param {string} apiKeyParamName (Optional) The name of the API key parameter.
 * @returns {string} The generated API URL.
 * @throws {Error} If the provided API name or custom URL is invalid.
 */
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