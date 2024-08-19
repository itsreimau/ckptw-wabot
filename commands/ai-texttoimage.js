const {
    createAPIUrl
} = require("../tools/api.js");
const {
    getList
} = require("../tools/list");
const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "texttoimage",
    aliases: ["text2img"],
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

        const [model, style, ...promptParts] = ctx._args.join(" ").split(", ");
        const prompt = promptParts.join(", ");

        if (!ctx._args.length || model || style || prompt) return ctx.reply(
            `${quote(global.msg.argument)} Bingung? Ketik ${monospace(`${ctx._used.prefix + ctx._used.command} list`)} untuk melihat daftar.\n` +
            quote(`Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} juggernaut, anime, rei ayanami`)}`)
        );

        if (ctx._args[0] === "list") {
            const listText = await getList("texttoimage");
            return ctx.reply(listText);
        }

        try {
            const apiUrl = createAPIUrl("fasturl", "/ai/texttoimage", {
                prompt: prompt,
                negativePrompt: "bad anatomy, blurry, low quality, distorted",
                typeModel: "SDXL",
                model: model,
                style: style,
                resolution: "auto",
                upscale: false
            });

            return await ctx.reply({
                image: {
                    url: apiUrl
                },
                mimetype: mime.contentType("png"),
                caption: `${quote(`Prompt: ${prompt}`)}\n` +
                    `${quote(`Model: ${model}`)}\n` +
                    `${quote(`Style: ${style}`)}\n` +
                    "\n" +
                    global.msg.footer
            });
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};