const {
    createAPIUrl
} = require('./api.js');
const axios = require('axios');
const cheerio = require('cheerio');

exports.alkitab = async (input) => {
    const apiUrl = createAPIUrl('https://alkitab.me', '/search', {
        q: input
    });

    try {
        const res = await axios.get(apiUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36"
            }
        });

        const $ = cheerio.load(res.data);
        const result = [];

        $('div.vw').each(function(a, b) {
            const teks = $(b).find('p').text().trim();
            const link = $(b).find('a').attr('href');
            const title = $(b).find('a').text().trim();

            result.push({
                teks,
                link,
                title
            });
        });

        return result;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

exports.pinterest = async (query) => {
    try {
        const searchUrl = createAPIUrl('miwudev', `/api/v1/pinterest/search`, {
            query: query
        });
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();

        const randomResultUrl = searchData.results[Math.floor(Math.random() * searchData.results.length)];

        const downloadUrl = createAPIUrl('miwudev', `/api/v1/pinterest/download`, {
            url: randomResultUrl
        });
        const downloadResponse = await fetch(downloadUrl);
        const downloadData = await downloadResponse.json();

        const randomImageUrl = downloadData.results[Math.floor(Math.random() * downloadData.results.length)].url;

        return randomImageUrl;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
};