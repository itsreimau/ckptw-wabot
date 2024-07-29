const {
    api
} = require("../tools/exports.js");
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
        const handlerObj = await global.handler(ctx, {
            banned: true,
            coin: 3
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        if (!ctx._args.length) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} en halo dunia!`)}`
        );

        try {
            let lang = "id";
            let inp = ctx._args;

            if (ctx._args.length > 2) {
                lang = ctx._args[0];
                inp = ctx._args.slice(1);
            }

            const apiUrl = api.createUrl("nyxs", "/tools/tts", {
                text: inp.join(" "),
                to: lang
            });
            const response = await axios.get(apiUrl);

            const data = await response.data;

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