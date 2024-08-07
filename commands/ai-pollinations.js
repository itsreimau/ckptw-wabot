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
    name: "pollinations",
    aliases: ["poll"],
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

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(example)}`
        );

        try {
            const apiUrl = createAPIUrl("https://image.pollinations.ai", `/prompt/${input}`, {});
            const {
                url
            } = await axios.get(apiUrl);

            return ctx.reply({
                image: {
                    url
                },
                mimetype: mime.contentType("png"),
                caption: `❖ ${bold("Pollinations")}\n\n➲ Prompt: ${input}\n\n${global.msg.footer}`,
            });
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};