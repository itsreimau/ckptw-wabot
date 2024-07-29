const {
    api,
    general
} = require("../tools/exports.js");
const {
    bold
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const FormData = require("form-data");
const jsdom = require("jsdom");
const {
    JSDOM
} = jsdom;
const mime = require("mime-types");

module.exports = {
    name: "toimg",
    aliases: ["topng", "toimage"],
    category: "converter",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const quotedMessage = ctx._msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        if (!quotedMessage) return ctx.reply(`${bold("[ ! ]")} Berikan atau balas media berupa sticker!`);

        try {
            const type = quotedMessage ? ctx._self.getContentType(quotedMessage) : null;
            const object = type ? quotedMessage[type] : null;
            const buffer = type === "stickerMessage" ? await general.download(object, type.slice(0, -7)) : null;
            const imgUrl = await webp2png(buffer);

            return await ctx.reply({
                image: {
                    url: imgUrl
                },
                mimetype: mime.contentType("png"),
                caption: null
            });
        } catch (error) {
            console.error("Error", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};

async function webp2png(source) {
    let form = new FormData();
    let isUrl = typeof source === "string" && /https?:\/\//.test(source);
    const blob = !isUrl && Buffer.isBuffer(source) ? source : Buffer.from(source);
    form.append("new-image-url", isUrl ? blob : "");
    form.append("new-image", isUrl ? "" : blob, "image.webp");

    let res = await axios.post("https://ezgif.com/webp-to-png", form, {
        headers: form.getHeaders()
    });
    let html = res.data;
    let {
        document
    } = new JSDOM(html).window;
    let form2 = new FormData();
    let obj = {};
    for (let input of document.querySelectorAll("form input[name]")) {
        obj[input.name] = input.value;
        form2.append(input.name, input.value);
    }

    let res2 = await axios.post("https://ezgif.com/webp-to-png/" + obj.file, form2, {
        headers: form2.getHeaders()
    });
    let html2 = res2.data;
    let {
        document: document2
    } = new JSDOM(html2).window;
    return new URL(document2.querySelector("div#output > p.outfile > img").src, res2.request.res.responseUrl).toString();
}