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
    name: "photoleap",
    aliases: ["pl"],
    category: "ai",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            coin: 3
        });
        if (status) return ctx.reply(message);

        const input = ctx._args.join(" ") || null;

        if (!input) {
            return ctx.reply(
                `${global.msg.argument}\n` +
                `Example: ${monospace(`${ctx._used.prefix + ctx._used.command} cat`)}`
            );
        }

        try {
            const apiUrl = createAPIUrl("https://tti.photoleapapp.com", "/api/v1/generate", {
                prompt: input,
            });
            const {
                data
            } = await axios.get(apiUrl);
            const {
                result_url
            } = data;

            return await ctx.reply({
                image: {
                    url: result_url,
                },
                mimetype: mime.contentType("png"),
                caption: `❖ ${bold("Photoleap")}\n\n➲ Prompt: ${input}\n\n${global.msg.footer}`,
            });
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};