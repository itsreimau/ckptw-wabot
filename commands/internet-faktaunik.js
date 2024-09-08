const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "faktaunik",
    aliases: ["fakta"],
    category: "internet",
    code: async (ctx) => {
        const [userLanguage] = await Promise.all([
            global.db.get(`user.${ctx.sender.jid.replace(/@.*|:.*/g, "")}.language`)
        ]);

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
            const faktaResponse = await axios.get(faktaApiUrl);
            const faktaData = faktaResponse.data;
            const faktaText = faktaData.text;

            const translationApiUrl = global.tools.api.createUrl("fasturl", "/tool/translate", {
                text: faktaText,
                target: "id"
            });
            const translationResponse = await axios.get(translationApiUrl, {
                headers: {
                    "x-api-key": global.tools.api.listUrl().fasturl.APIKey
                }
            });
            const translationData = translationResponse.data;
            const translatedText = translationData.translatedText;

            return ctx.reply(translatedText);
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(`⛔ ${await global.tools.msg.translate(global.msg.notFound, userLanguage)}`);
            return ctx.reply(quote(`⚠ ${await global.tools.msg.translate("Terjadi kesalahan", userLanguage)}: ${error.message}`));
        }
    }
};