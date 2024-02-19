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

exports.instagram = (url) => {
    return new Promise(async (resolve, reject) => {
        try {
            const encodeUrl = encodeURIComponent(url);
            const html = await axios.get('https://igram.vip/id-ID/search?url=' + encodeUrl);
            const $ = cheerio.load(html.data);
            const footerElement = $('.layui-card-footer a');
            const bodyElement = $('.layui-card-body img')
            const footerArray = footerElement.toArray().map((e) => $(e).attr('href'));
            const filterFooterArray = footerArray.filter(url => url.includes('https://downloader.twdown.online'));
            const bodyArray = bodyElement.toArray().map((e) => $(e).attr('src'));
            const newArray = [];
            for (let i = 0; i < filterFooterArray.length; i++) {
                const imgUrl = bodyArray[i];
                const urlOri = filterFooterArray[i];
                const idUrl = urlOri.replace(/.*?ref=#url=/, '');
                const reqUrl = (await axios.get('https://downloader.twdown.online/load_url?url=' + idUrl)).data;
                newArray.push({
                    url: reqUrl,
                    thumbnail: imgUrl
                });
            }
            resolve({
                creator: 'Muhamad Ikbal Maulana | ItsReimau',
                status: true,
                data: newArray
            });
        } catch (e) {
            console.log(e);
            reject({
                creator: 'Muhamad Ikbal Maulana | ItsReimau',
                status: false
            });
        }
    })
};