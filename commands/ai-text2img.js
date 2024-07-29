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
    name: "text2img",
    category: "ai",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true,
            coin: 3
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        let input = ctx._args.length ? ctx._args.join(" ") : null;

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} cat`)}`
        );

        let apiPath = "/ai/text2img";

        const versionRegex = /^\(v(\d+)\)\s*(.*)$/;
        const match = input.match(versionRegex);

        if (match) {
            const version = match[1];
            apiPath = `/v${version}/text2img`;
            input = match[2];
        }

        try {
            const apiUrl = api.createUrl("widipe", apiPath, {
                text: input
            });

            return await ctx.reply({
                image: {
                    url: apiUrl
                },
                mimetype: mime.contentType("png"),
                caption: `❖ ${bold("TEXT2IMG")}\n` +
                    "\n" +
                    `➲ Prompt: ${input}\n` +
                    "\n" +
                    global.msg.footer
            });
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};