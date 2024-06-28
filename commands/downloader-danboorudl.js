const {
    createAPIUrl
} = require("./api.js");
const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const cheerio = require("cheerio");
const mime = require("mime-types");

module.exports = {
    name: "danboorudl",
    aliases: ["danbooru"],
    category: "downloader",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true,
            coin: 3
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const input = ctx._args.join(" ");

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} https://example.com/`)}`
        );

        const urlRegex = /danbooru\.donmai\.us\/posts\/[0-9]+$/i;
        if (!urlRegex.test(input)) return ctx.reply(global.msg.urlInvalid);

        try {
            const result = await danbooru(input)

            if (!result) return ctx.reply(global.msg.notFound);

            return await ctx.reply({
                image: {
                    url: result.url
                },
                mimetype: mime.contentType("png"),
                caption: `❖ ${bold("Danbooru Downloader")}\n` +
                    "\n" +
                    `➲ URL: ${input}\n` +
                    "\n" +
                    global.msg.footer,
                gifPlayback: false
            });
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};

async function danbooru(url) {
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