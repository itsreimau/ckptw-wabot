const {
    createAPIUrl
} = require('./api.js');
const axios = require('axios');
const cheerio = require('cheerio');

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
};

exports.pinterest = async (query) => {
    try {
        const searchUrl = createAPIUrl('miwudev', `/api/v1/pinterest/search`, {
            query: query
        });
        const searchResponse = await axios.get(searchUrl);
        const searchData = searchResponse.data;

        let randomImageUrl = null;

        for (const searchResult of searchData.results) {
            const downloadUrl = createAPIUrl('miwudev', `/api/v1/pinterest/download`, {
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