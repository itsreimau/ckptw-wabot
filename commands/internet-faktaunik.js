const {
    createAPIUrl
} = require("../tools/api.js");
const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const {
    translate
} = require("bing-translate-api");

module.exports = {
    name: "faktaunik",
    aliases: ["fakta"],
    category: "internet",
    code: async (ctx) => {
        const {
            banned,
            coin
        } = {
            banned: true,
            coin: 3
        };
        const handlerObj = await global.handler(ctx, {
            banned,
            coin
        });
        if (handlerObj.status) return ctx.reply(handlerObj.message);

        try {
            const apiUrl = await createAPIUrl("https://uselessfacts.jsph.pl", "/api/v2/facts/random", {});
            const {
                data
            } = await axios.get(apiUrl);
            const {
                translation
            } = await translate(data.text, "en", "id");

            return ctx.reply(translation);
        } catch (error) {
            console.error("Error:", error);
            if (error.response && error.response.status === 404) return ctx.reply(global.msg.notFound);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    },
};