const {
    createAPIUrl
} = require("../tools/api.js");
const {
    quote
} = require("@mengkodingan/ckptw");
const FormData = require("form-data");
const {
    JSDOM
} = require("jsdom");
const mime = require("mime-types");
const fetch = require("node-fetch");

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

        if (!quotedMessage) return ctx.reply(quote(`📌 Berikan atau balas media berupa sticker!`));

        try {
            const buffer = await quotedMessage.media.toBuffer()
            const vidUrl = buffer ? await webp2mp4(buffer) : null;

            if (!vidUrl) return ctx.reply(quote(`⚠ Terjadi kesalahan: Media tidak valid.`));

            return await ctx.reply({
                video: {
                    url: vidUrl
                },
                mimetype: ctx._used.command === "togif" ? mime.contentType("gif") : mime.contentType("mp4"),
                gifPlayback: ctx._used.command === "togif" ? true : false
            });
        } catch (error) {
            console.error("Error", error);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};

async function webp2mp4(source) {
    const form = new FormData();
    const isUrl = typeof source === "string" && /https?:\/\//.test(source);
    const blob = !isUrl && Buffer.isBuffer(source) ? source : Buffer.from(source);

    form.append("new-image-url", isUrl ? blob : "");
    form.append("new-image", isUrl ? "" : blob, "image.webp");

    const res = await fetch("https://ezgif.com/webp-to-mp4", {
        method: "POST",
        body: form
    });

    const html = await res.text();
    const {
        document
    } = new JSDOM(html).window;
    const form2 = new FormData();
    const obj = {};

    for (const input of document.querySelectorAll("form input[name]")) {
        obj[input.name] = input.value;
        form2.append(input.name, input.value);
    }

    const res2 = await fetch(`https://ezgif.com/webp-to-mp4/${obj.file}`, {
        method: "POST",
        body: form2
    });

    const html2 = await res2.text();
    const {
        document: document2
    } = new JSDOM(html2).window;
    return new URL(document2.querySelector("div#output > p.outfile > video > source").src, res2.url).toString();
}