const {
    createAPIUrl
} = require('./api.js');
const {
    googleIt
} = require('@bochilteam/scraper');
const axios = require('axios');
const cheerio = require('cheerio');
const jsdom = require("jsdom");
const {
    JSDOM
} = jsdom;

/**
 * Search for Bible verses on Alkitab.me.
 * @param {string} q The search query.
 * @returns {Array<Object>} An array of objects containing search results with text, link, and title.
 */
exports.alkitab = async (q) => {
    const apiUrl = createAPIUrl('https://alkitab.me', '/search', {
        q: q
    });

    try {
        const res = await axios.get(apiUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36'
            }
        });

        const $ = cheerio.load(res.data);
        const result = [];

        $('div.vw').each(function(a, b) {
            const text = $(b).find('p').text().trim();
            const link = $(b).find('a').attr('href');
            const title = $(b).find('a').text().trim();

            result.push({
                text,
                link,
                title
            });
        });

        return result;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

/**
 * Search for icons on Flaticon based on query.
 * @param {string} query The search query.
 * @returns {Array<string>|null} An array of icon image URLs from the search results, or null if no images found.
 */
exports.flaticon = async (query) => {
    const apiUrl = createAPIUrl('https://www.flaticon.com', `/free-icons/${query}`, {});

    try {
        const res = await fetch(apiUrl)
        const html = await res.text()
        const dom = new JSDOM(html)
        var collection = dom.window.document.querySelectorAll('.icon--item');
        let img = []

        for (var i = 0; i < collection.length; i++) {
            img.push(collection[i].getAttribute('data-png'))
        }

        const newArr = img.filter(el => el != null);
        return newArr
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

/**
 * Search for designs on Freepik based on query.
 * @param {string} query The search query.
 * @returns {Array<string>|null} An array of design image URLs from the search results, or null if no images found.
 */
exports.freepik = async (query) => {
    const apiUrl = createAPIUrl('https://www.freepik.com', '/search', {
        query: query,
        type: 'psd'
    });

    try {
        const res = await fetch(apiUrl)
        const html = await res.text()
        const dom = new JSDOM(html)
        var collection = dom.window.document.getElementsByTagName('img');
        let img = []

        for (var i = 0; i < collection.length; i++) {
            if (collection[i].getAttribute('src').startsWith('https://img.freepik.com')) img.push(collection[i].getAttribute('src'))
        }

        const newArr = img.filter(el => el != null);
        return newArr
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

/**
 * Download a GitHub repository in ZIP format.
 * @param {string} owner The username of the repository owner.
 * @param {string} repo The name of the repository.
 * @returns {Promise<Buffer>} A buffer containing the ZIP data of the repository.
 */
exports.ghdl = async (owner, repo) => {
    const apiUrl = createAPIUrl('https://api.github.com', `/repos/${owner}/${repo}/zipball/master`, {});

    try {
        const response = await axios({
            method: 'GET',
            url: apiUrl,
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Node.js'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

/*
 * The `googlesearch` function is used to perform text search using Google or similar API.
 * If search data is available from Google, this function returns an array of search results in JSON format.
 * Each object contains an index, title, URL, and snippet of the search result.
 * If search data is not available from Google, the function attempts to use a similar API for web search.
 * If successful, the search results are structured into an array of objects similar to Google's results.
 * If unsuccessful, the function returns null.
 *
 * @param {string} text - The text to be searched.
 * @returns {Array|null} - An array of JSON objects of search results or null if an error occurs.
 */
exports.googlesearch = async (text) => {
    let searchResults = null;

    try {
        const search = await googleIt(text);
        if (search.articles.length > 0) searchResults = search.articles.map((v, index) => {
            return {
                index: index + 1,
                title: v.title || '-',
                url: v.url || '-',
                snippet: v.description || '-'
            };
        });
    } catch (error) {
        console.error('Error:', error);
        return null;
    }

    if (!searchResults) {
        const apiUrl = createAPIUrl('http://api.serpstack.com', `/search`, {
            access_key: '7d3eb92cb730ed676d5afbd6c902ac1f',
            type: 'web',
            query: text
        });

        try {
            const search = await fetch(apiUrl);
            const searchData = await search.json();
            if (searchData.organic_results.length > 0) searchResults = searchData.organic_results.map((v, index) => {
                return {
                    index: index + 1,
                    title: v.title || '-',
                    url: v.url || '-',
                    snippet: v.snippet || '-'
                };
            });
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }

    return searchResults;
}

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
            order_by: 'new',
            type: 'community',
            keyword: keyword,
            tags: []
        };
        const apiUrl = createAPIUrl('https://www.seaart.ai', '/api/v1/artwork/list');
        const response = await axios.post(apiUrl, requestData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const {
            data
        } = response.data;
        const items = data.items;

        if (!items || !Array.isArray(items) || items.length === 0) new Error('No items found.');

        const randomIndex = Math.floor(Math.random() * items.length);
        return items[randomIndex];
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

/**
 * Search for images on Pinterest based on query.
 * @param {string} query The query to search for images.
 * @returns {string|null} A random image URL from the search results, or null if no image found.
 */
exports.pinterest = async (query) => {
    try {
        const searchUrl = createAPIUrl('miwudev', `/api/v1/pinterest/search`, {
            query: query
        });
        const searchResponse = await axios.get(searchUrl);
        const searchData = searchResponse.data;

        let randomImageUrl = null;

        for (const searchResult of searchData.results) {
            const downloadUrl = createAPIUrl('miwudev', '/api/v1/pinterest/download', {
                url: searchResult
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
        console.error('Error:', error);
        return null;
    }
}