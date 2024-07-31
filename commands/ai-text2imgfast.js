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
    name: "text2imgfast",
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
                image: result.image
                mimetype: mime.contentType("png"),
                caption: `❖ ${bold("TEXT2IMG (Fast)")}\n` +
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
async function text2imageFast(prompt) {
    return new Promise((resolve, reject) => {
        if (!prompt) return reject({
            status: false,
            message: "Undefined reading prompt"
        });

        const formData = new FormData();
        formData.append("prompt", prompt);
        formData.append("output_format", "bytes");
        formData.append("user_profile_id", "null");
        formData.append("anonymous_user_id", "445fe25d-91dd-46f9-9731-edcd0845ddde");
        formData.append("request_timestamp", Date.now().toString());
        formData.append("user_is_subscribed", "false");
        formData.append("client_id", "pSgX7WgjukXCBoYwDM8G8GLnRRkvAoJlqa5eAVvj95o");

        axios.post("https://ai-api.magicstudio.com/api/ai-art-generator", formData, {
                responseType: "arraybuffer"
            })
            .then(async res => {
                const image = res.data;

                if (!Buffer.isBuffer(image)) return reject({
                    status: false,
                    message: "Failed generating image"
                });

                resolve({
                    status: true,
                    image
                });
            })
            .catch(error => {
                reject({
                    status: false,
                    message: error
                });
            });
    });
}