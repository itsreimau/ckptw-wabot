const {
    createAPIUrl
} = require("../tools/api.js");
const {
    bold,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const FormData = require("form-data");
const {
    JSDOM
} = require("jsdom");
const mime = require("mime-types");

module.exports = {
    name: "tovid",
    aliases: ["tomp4", "togif"],
    category: "converter",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true
        });
        if (status) return ctx.reply(message);

        const quotedMessage = ctx.quoted;
        if (!quotedMessage) return ctx.reply(quote(`${bold("[ ! ]")} Berikan atau balas media berupa sticker!`));

        try {
            if (quotedMessage) {
                const type = quotedMessage ? ctx.getContentType(quotedMessage) : null;
                const object = type ? quotedMessage[type] : null;
                const stream = await ctx.downloadContentFromMessage(object, type.slice(0, -7));
                let quotedBuffer = Buffer.from([]);
                for await (const chunk of stream) {
                    quotedBuffer = Buffer.concat([quotedBuffer, chunk]);
                }
            }
            const buffer = type === "stickerMessage" ? quotedBuffer : null;
            const vidUrl = await webp2mp4(buffer);

            return await ctx.reply({
                video: {
                    url: vidUrl
                },
                mimetype: ctx._used.command === "togif" ? mime.contentType("gif") : mime.contentType("mp4"),
                caption: null,
                gifPlayback: ctx._used.command === "togif" ? true : false
            });
        } catch (error) {
            console.error("Error", error);
            return ctx.reply(quote(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`));
        }
    }
};

async function webp2mp4(source) {
    const form = new FormData();
    const isUrl = typeof source === "string" && /https?:\/\//.test(source);
    const blob = !isUrl && Buffer.isBuffer(source) ? source : Buffer.from(source);

    form.append("new-image-url", isUrl ? blob : "");
    form.append("new-image", isUrl ? "" : blob, "image.webp");

    const res = await axios.post("https://ezgif.com/webp-to-mp4", form, {
        headers: form.getHeaders()
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

    const res2 = await axios.post(`https://ezgif.com/webp-to-mp4/${obj.file}`, form2, {
        headers: form2.getHeaders()
    });

    const html2 = res2.data;
    const {
        document: document2
    } = new JSDOM(html2).window;
    return new URL(document2.querySelector("div#output > p.outfile > video > source").src, res2.request.res.responseUrl).toString();
}