const {
    createAPIUrl
} = require("../tools/api.js");
const {
    download
} = require("../tools/general.js");
const {
    bold
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");
const {
    uploadByBuffer
} = require("telegraph-uploader");

module.exports = {
    name: "whatsmusic",
    aliases: ["musicrecognition", "musrec", "mr", "whatmusic"],
    category: "ai",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true
        });
        if (status) return ctx.reply(message);

        const quotedMessage = ctx._msg.message?.extended?.contextInfo?.quotedMessage;
        if (!quotedMessage) return ctx.reply(`${bold("[ ! ]")} Berikan atau balas media berupa audio!`);

        try {
            const type = quotedMessage ? ctx._self.getContentType(quotedMessage) : null;
            const object = type ? quotedMessage[type] : null;
            const buffer = type === "audioMessage" ? await download(object, type.slice(0, -7)) : null;
            const uplRes = await uploadByBuffer(buffer, mime.contentType("png"));
            const musrecRes = await musicRecognition(uplRes.link);

            if (!musrecRes.status) return ctx.reply(global.msg.notFound);

            return await ctx.reply(
                `❖ ${bold("Whats Music")}\n` +
                "\n" +
                `Judul: ${musrecRes.data.title}\n` +
                "\n" +
                global.msg.footer
            );
        } catch (error) {
            console.error("Error", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};

/*
  Created by https://github.com/ztrdiamond !
  Source: https://whatsapp.com/channel/0029VagFeoY9cDDa9ulpwM0T
  "I promise that if I remove this watermark, I will be willing to be poor for 7 generations"
*/
async function musicRecognition(url) {
    try {
        return await new Promise(async (resolve, reject) => {
            if (!/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(url)) return reject("Invalid URL!");
            axios.post("https://imphnen-ai.vercel.app/api/asr/music_recognition", {
                audio: url
            }).then(res => {
                const data = res.data;
                if (!data.success) return reject(data.message);
                if (!data.data.title) return reject("Can't find any songs from that medium.");
                resolve({
                    status: true,
                    data: data.data
                })
            }).catch(reject)
        });
    } catch (e) {
        return {
            status: false,
            message: e
        };
    }
}