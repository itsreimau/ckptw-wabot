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
        const handlerObj = await global.handler(ctx, {
            banned: true,
            coin: 3
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const input = ctx._args.join(" ");

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} cat`)}`
        );

        try {
            const apiUrl = createAPIUrl("https://image.pollinations.ai", `/prompt/${input}`, {});
            const response = await axios.get(apiUrl, {
                responseType: "arraybuffer"
            });

            if (response.status !== 200) throw new Error(global.msg.notFound);

            const buffer = Buffer.from(response.data, "binary");

            return await ctx.reply({
                image: buffer,
                mimetype: mime.contentType("png"),
                caption: `❖ ${bold("Pollinations")}\n` +
                    "\n" +
                    `➲ Prompt: ${input}\n` +
                    "\n" +
                    global.msg.footer
            });
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};