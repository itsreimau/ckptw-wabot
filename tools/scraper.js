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
        q: q
    });

    try {
        const res = await axios.get(apiUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36",
            }
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
                title
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
                    priceChange: priceChange
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
 * Fetches image information from Danbooru based on the provided URL.
 * @param {string} url The URL of the image on Danbooru.
 * @returns {Object|null} An object containing image details such as tags and size, or null if an error occurs.
 */
exports.danbooru = async (url) => {
    try {
        const html = (await axios.get(url)).data;
        const $ = cheerio.load(html);
        const obj = {};

        $('#post-information > ul > li').each((idx, el) => {
            const str = $(el).text().trim().replace(/\n/g, '').split(': ');
            obj[str[0]] = str[1].replace('»', '').trim().split(' .')[0];
        });

        obj.url = $('#post-information > ul > li[id="post-info-size"] > a').attr('href');
        return obj;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

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
        headers: form.getHeaders()
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
        headers: form.getHeaders()
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
        headers: form2.getHeaders()
    });
    let html2 = res2.data;
    let {
        document: document2
    } = new JSDOM(html2).window;
    return new URL(document2.querySelector("div#output > p.outfile > img").src, res2.request.res.responseUrl).toString();
};