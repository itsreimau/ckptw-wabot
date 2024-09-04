const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const fetch = require("node-fetch");

module.exports = {
    name: "faktaunik",
    aliases: ["fakta"],
    category: "internet",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            coin: 3
        });
        if (status) return ctx.reply(message);

        try {
            const faktaApiUrl = await global.tools.api.createUrl("https://uselessfacts.jsph.pl", "/api/v2/facts/random", {});
            const faktaResponse = await fetch(faktaApiUrl);
            const faktaData = await faktaResponse.json();
            const faktaText = faktaData.text;

            const translationApiUrl = global.tools.api.createUrl("fasturl", "/tool/translate", {
                text: faktaText,
                target: "id"
            });
            const translationResponse = await fetch(translationApiUrl, {
                headers: {
                    "x-api-key": global.tools.api.listAPIUrl().fasturl.APIKey
                }
            });
            const translationData = await translationResponse.json();
            const translatedText = translationData.translatedText;

            return ctx.reply(translatedText);
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};