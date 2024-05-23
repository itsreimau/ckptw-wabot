const {
    createAPIUrl
} = require("./api.js");
const {
    googleIt
} = require("@bochilteam/scraper");
const axios = require("axios");
const cheerio = require("cheerio");
const FormData = require("form-data");
const jsdom = require("jsdom");
const {
    JSDOM
} = jsdom;

/**
 * Search for Bible verses on Alkitab.me.
 * @param {string} q The search query.
 * @returns {Array<Object>|null} An array of objects containing search results with text, link, and title.
 */
exports.alkitab = async (q) => {
    const apiUrl = createAPIUrl("https://alkitab.me", "/search", {
        q: q,
    });

    try {
        const res = await axios.get(apiUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36",
            },
        });

        const $ = cheerio.load(res.data);
        const result = [];

        $("div.vw").each(function(a, b) {
            const text = $(b).find("p").text().trim();
            const link = $(b).find("a").attr("href");
            const title = $(b).find("a").text().trim();

            result.push({
                text,
                link,
                title,
            });
        });

        return result;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
};

/**
 * Fetches cryptocurrency data from an API based on the provided search term.
 * @param {string} search The search query.
 * @returns {Array<Object>|null} An array of objects containing cryptocurrency names and their price changes, or null if an error occurs.
 */
exports.coingecko = async (search) => {
    const apiUrl = createAPIUrl("https://api.coingecko.com", "/api/v3/coins/markets", {
        vs_currency: "usd",
    });

    try {
        const response = await axios.get(apiUrl);
        const data = response.data;
        const result = [];

        data.forEach((crypto) => {
            const cryptoName = `${crypto.name} (${crypto.symbol}) - $${crypto.current_price}`;
            const percentChange = crypto.price_change_percentage_24h.toFixed(2);
            const priceChange = percentChange >= 0 ? `+${percentChange}%` : `${percentChange}%`;

            if (crypto.name.toLowerCase().includes(search.toLowerCase())) {
                const cryptoResult = {
                    cryptoName: cryptoName,
                    priceChange: priceChange,
                };
                result.push(cryptoResult);
            }
        });

        return result;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
};

/**
 * Download a GitHub repository in ZIP format.
 * @param {string} owner The username of the repository owner.
 * @param {string} repo The name of the repository.
 * @returns {Promise<Buffer>|null} A buffer containing the ZIP data of the repository.
 */
exports.github = async (owner, repo) => {
    const apiUrl = createAPIUrl("https://api.github.com", `/repos/${owner}/${repo}/zipball/master`, {});

    try {
        const response = await axios({
            method: "GET",
            url: apiUrl,
            responseType: "arraybuffer",
            headers: {
                "User-Agent": "Node.js",
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
};

/*
 * Perform text search using Google or similar API.
 * @param {string} text - The text to be searched.
 * @returns {Array|null} - An array of JSON objects of search results or null if an error occurs.
 */
exports.googlesearch = async (text) => {
    let searchResults = null;

    try {
        const search = await googleIt(text);
        if (search.articles.length > 0)
            searchResults = search.articles.map((v, index) => {
                return {
                    index: index + 1,
                    title: v.title || "-",
                    url: v.url || "-",
                    snippet: v.description || "-",
                };
            });
    } catch (error) {
        console.error("Error:", error);
        return null;
    }

    if (!searchResults) {
        const apiUrl = createAPIUrl("http://api.serpstack.com", `/search`, {
            access_key: "7d3eb92cb730ed676d5afbd6c902ac1f",
            type: "web",
            query: text,
        });

        try {
            const response = await axios.get(apiUrl);
            const searchData = response.data;
            if (searchData.organic_results.length > 0)
                searchResults = searchData.organic_results.map((v, index) => {
                    return {
                        index: index + 1,
                        title: v.title || "-",
                        url: v.url || "-",
                        snippet: v.snippet || "-",
                    };
                });
        } catch (error) {
            console.error("Error:", error);
            return null;
        }
    }

    return searchResults;
};

/**
 * Search for artwork on SeaArt.ai based on keyword.
 * @param {string} keyword The keyword to search for artwork.
 * @returns {Object|null} A random artwork object, or null if no artwork found.
 */
exports.seaart = async (keyword) => {
    try {
        const requestData = {
            page: 1,
            page_size: 40,
            order_by: "new",
            type: "community",
            keyword: keyword,
            tags: [],
        };
        const apiUrl = createAPIUrl("https://www.seaart.ai", "/api/v1/artwork/list");
        const response = await axios.post(apiUrl, requestData, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        const {
            data
        } = response.data;
        const items = data.items;

        if (!items || !Array.isArray(items) || items.length === 0) new Error("No items found.");

        const randomIndex = Math.floor(Math.random() * items.length);
        return items[randomIndex];
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
};

/**
 * Search for images on Pinterest based on query.
 * @param {string} The query to search for images.
 * @returns {string|null} A random image URL from the search results, or null if no image found.
 */
exports.pinterest = async (query) => {
    try {
        const searchUrl = createAPIUrl("miwudev", `/api/v1/pinterest/search`, {
            query: query,
        });
        const searchResponse = await axios.get(searchUrl);
        const searchData = searchResponse.data;

        let randomImageUrl = null;

        for (const searchResult of searchData.results) {
            const downloadUrl = createAPIUrl("miwudev", "/api/v1/pinterest/download", {
                url: searchResult,
            });
            const downloadResponse = await axios.get(downloadUrl);
            const downloadData = downloadResponse.data;

            if (downloadData.results.length > 0) {
                randomImageUrl = downloadData.results[Math.floor(Math.random() * downloadData.results.length)].url;
                break;
            }
        }

        return randomImageUrl;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
};

/**
 * Convert WebP image to MP4 video using ezgif.com.
 * @param {Buffer|string} source The source image as a buffer or a URL string.
 * @returns {string} The URL of the converted MP4 video.
 */
exports.webp2mp4 = async (source) => {
    let form = new FormData();
    let isUrl = typeof source === "string" && /https?:\/\//.test(source);
    const blob = !isUrl && Buffer.isBuffer(source) ? source : Buffer.from(source);
    form.append("new-image-url", isUrl ? blob : "");
    form.append("new-image", isUrl ? "" : blob, "image.webp");

    let res = await axios.post("https://ezgif.com/webp-to-mp4", form, {
        headers: form.getHeaders(),
    });
    let html = res.data;
    let {
        document
    } = new JSDOM(html).window;
    let form2 = new FormData();
    let obj = {};
    for (let input of document.querySelectorAll("form input[name]")) {
        obj[input.name] = input.value;
        form2.append(input.name, input.value);
    }

    let res2 = await axios.post("https://ezgif.com/webp-to-mp4/" + obj.file, form2, {
        headers: form2.getHeaders(),
    });
    let html2 = res2.data;
    let {
        document: document2
    } = new JSDOM(html2).window;
    return new URL(document2.querySelector("div#output > p.outfile > video > source").src, res2.request.res.responseUrl).toString();
};

/**
 * Convert WebP image to PNG image using ezgif.com.
 * @param {Buffer|string} source The source image as a buffer or a URL string.
 * @returns {string} The URL of the converted PNG image.
 */
exports.webp2png = async (source) => {
    let form = new FormData();
    let isUrl = typeof source === "string" && /https?:\/\//.test(source);
    const blob = !isUrl && Buffer.isBuffer(source) ? source : Buffer.from(source);
    form.append("new-image-url", isUrl ? blob : "");
    form.append("new-image", isUrl ? "" : blob, "image.webp");

    let res = await axios.post("https://ezgif.com/webp-to-png", form, {
        headers: form.getHeaders(),
    });
    let html = res.data;
    let {
        document
    } = new JSDOM(html).window;
    let form2 = new FormData();
    let obj = {};
    for (let input of document.querySelectorAll("form input[name]")) {
        obj[input.name] = input.value;
        form2.append(input.name, input.value);
    }

    let res2 = await axios.post("https://ezgif.com/webp-to-png/" + obj.file, form2, {
        headers: form2.getHeaders(),
    });
    let html2 = res2.data;
    let {
        document: document2
    } = new JSDOM(html2).window;
    return new URL(document2.querySelector("div#output > p.outfile > img").src, res2.request.res.responseUrl).toString();
};