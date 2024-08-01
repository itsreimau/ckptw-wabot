const {
    createAPIUrl
} = require("../tools/api.js");
const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const FormData = require("form-data");
const mime = require("mime-types");

module.exports = {
    name: "pixelart",
    aliases: ["pixel"],
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
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} cat`)}`
        );

        try {
            const result = pixelart(input);

            if (!result.status) return ctx.reply(global.msg.notFound);

            return await ctx.reply({
                image: result.image,
                mimetype: mime.contentType("png"),
                caption: `❖ ${bold("Pixel Art")}\n` +
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

/*
  Created by https://github.com/ztrdiamond !
  Source: https://whatsapp.com/channel/0029VagFeoY9cDDa9ulpwM0T
  "I promise that if I remove this watermark, I will be willing to be poor for 7 generations"
*/
async function pixelart(prompt) {
    const baseUrl = "https://aipixelartgenerator.com/wp-admin/admin-ajax.php";
    const form = new FormData();

    if (!prompt) return {
        status: false,
        message: "Undefined reading prompt!"
    };

    // Input
    form.append("action", "generate_pixel_art_image");
    form.append("user-input", prompt + " " + Math.random());

    // Execution
    try {
        const res = await axios.post(baseUrl, form)
        const result = res?.data;
        if (!result?.success) return {
            status: false,
            message: "Failed generate image!"
        };
        return {
            status: true,
            prompt,
            image: Buffer.from(result.data, "base64")
        };
    } catch (e) {
        return {
            status: false,
            message: e
        };
    }
}