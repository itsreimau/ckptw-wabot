const {
    createAPIUrl
} = require("../tools/api.js");
const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "tts",
    category: "tools",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            coin: 3
        });
        if (status) return ctx.reply(message);

        const [lang = "id", ...text] = ctx._args;

        if (!text.length) return ctx.reply(
            `${global.msg.argument}\n` +
            `Example: ${monospace(`${ctx._used.prefix + ctx._used.command} en hello world!`)}`
        );

        try {
            const apiUrl = createAPIUrl("nyxs", "/tools/tts", {
                text: text.join(" "),
                to: lang,
            });
            const {
                data
            } = await axios.get(apiUrl);

            return await ctx.reply({
                audio: {
                    url: data.result,
                },
                mimetype: mime.contentType("mp3"),
                ptt: false,
            });
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};