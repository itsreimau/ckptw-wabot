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

exports.instagram = async (url) => {
    try {
        const encodeUrl = encodeURIComponent(url);
        const html = await axios.get('https://igram.vip/id-ID/search?url=' + encodeUrl);
        const $ = cheerio.load(html.data);
        const footerArray = $('.layui-card-footer a[href*="https://downloader.twdown.online"]').toArray().map((e) => $(e).attr('href'));
        const bodyArray = $('.layui-card-body img').toArray().map((e) => $(e).attr('src'));
        const newArray = [];
        for (let i = 0; i < footerArray.length; i++) {
            const idUrl = footerArray[i].replace(/.*?ref=#url=/, '');
            const reqUrl = (await axios.get('https://downloader.twdown.online/load_url?url=' + idUrl)).data;
            newArray.push({
                url: reqUrl,
                thumbnail: bodyArray[i]
            });
        }
        return newArray.length > 0 ? newArray : null;
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

        const randomResultUrl = searchData.results[Math.floor(Math.random() * searchData.results.length)];

        const downloadUrl = createAPIUrl('miwudev', `/api/v1/pinterest/download`, {
            url: randomResultUrl
        });
        const downloadResponse = await fetch(downloadUrl);
        const downloadData = await downloadResponse.json();

        const randomImageUrl = downloadData.results[Math.floor(Math.random() * downloadData.results.length)].url;

        return randomImageUrl;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

exports.waifuim = async (tags, height) => {
    const apiUrl = createAPIUrl('https://api.waifu.im', '/search', {});
    const params = {
        included_tags: tags,
        height: '>=' + height
    };

    const queryParams = new URLSearchParams();

    for (const key in params) {
        if (Array.isArray(params[key])) {
            params[key].forEach(value => {
                queryParams.append(key, value);
            });
        } else {
            queryParams.set(key, params[key]);
        }
    }
    const requestUrl = `${apiUrl}?${queryParams.toString()}`;

    fetch(requestUrl)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Request failed with status code: ' + response.status);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            return null;
        });
}