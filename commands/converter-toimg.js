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
const FormData = require("form-data");
const {
    JSDOM
} = require("jsdom");
const mime = require("mime-types");

module.exports = {
    name: "toimg",
    aliases: ["topng", "toimage"],
    category: "converter",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true
        });
        if (status) return ctx.reply(message);

        const quotedMessage = ctx._msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!quotedMessage) return ctx.reply(`${bold("[ ! ]")} Berikan atau balas media berupa sticker!`);

        try {
            const type = quotedMessage ? ctx._self.getContentType(quotedMessage) : null;
            const object = type ? quotedMessage[type] : null;
            const buffer = type === "stickerMessage" ? await download(object, type.slice(0, -7)) : null;
            const imgUrl = buffer ? await webp2png(buffer) : null;

            if (!imgUrl) return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: Media tidak valid.`);

            return await ctx.reply({
                image: {
                    url: imgUrl
                },
                mimetype: mime.contentType("png"),
                caption: null,
            });
        } catch (error) {
            console.error("Error", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    },
};

async function webp2png(source) {
    let form = new FormData();
    let isUrl = typeof source === "string" && /https?:\/\//.test(source);
    const blob = !isUrl && Buffer.isBuffer(source) ? source : Buffer.from(source);
    form.append("new-image-url", isUrl ? blob : "");
    form.append("new-image", isUrl ? "" : blob, "image.webp");

    try {
        const res = await axios.post("https://ezgif.com/webp-to-png", form, {
            headers: form.getHeaders(),
        });
        const html = res.data;
        const {
            document
        } = new JSDOM(html).window;
        const form2 = new FormData();
        const obj = {};
        for (const input of document.querySelectorAll("form input[name]")) {
            obj[input.name] = input.value;
            form2.append(input.name, input.value);
        }

        const res2 = await axios.post(`https://ezgif.com/webp-to-png/${obj.file}`, form2, {
            headers: form2.getHeaders(),
        });
        const html2 = res2.data;
        const {
            document: document2
        } = new JSDOM(html2).window;
        return new URL(document2.querySelector("div#output > p.outfile > img").src, res2.request.res.responseUrl).toString();
    } catch (error) {
        console.error("Error in webp2png function:", error);
        return null;
    }
}