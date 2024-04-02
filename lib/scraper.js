const {
    createAPIUrl
} = require('./api.js');
const axios = require('axios');
const cheerio = require('cheerio');
const https = require('https');
const {
    JSDOM
} = require('jsdom');

exports.alkitab = async (input) => {
    const apiUrl = createAPIUrl('https://alkitab.me', '/search', {
        q: input
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

exports.translate = async (text, fromLanguage, toLanguage) => {
    const apiUrl = createAPIUrl('https://translate.google.co.id', '/m', {
        sl: fromLanguage,
        tl: toLanguage,
        q: text,
        hl: 'en'
    });

    try {
        const response = await https.get(apiUrl);
        const data = await new Promise((resolve, reject) => {
            let rawData = '';
            response.on('data', chunk => rawData += chunk);
            response.on('end', () => resolve(rawData));
            response.on('error', error => reject(error));
        });

        const doc = new JSDOM(data).window.document;
        return doc.querySelector('div.result-container').textContent.replace(/\n/g, ' ');
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

exports.pinterest = async (query) => {
    try {
        const searchUrl = createAPIUrl('miwudev', `/api/v1/pinterest/search`, {
            query: query
        });
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();

        let randomImageUrl = null;

        for (const searchResult of searchData.results) {
            const downloadUrl = createAPIUrl('miwudev', `/api/v1/pinterest/download`, {
                url: searchResult
            });
            const downloadResponse = await fetch(downloadUrl);
            const downloadData = await downloadResponse.json();

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