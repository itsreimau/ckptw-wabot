const {
    quote
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
            banned: true,
            cooldown: true
        });
        if (status) return ctx.reply(message);

        const quotedMessage = ctx.quoted;

        if (!(await quotedMessage.media.toBuffer())) return ctx.reply(quote(global.tools.msg.generateInstruction(["reply"], ["sticker"])));

        try {
            const buffer = await quotedMessage.media.toBuffer()
            const imgUrl = buffer ? await webp2png(buffer) : null;

            if (!imgUrl) return ctx.reply(global.config.msg.notFound);

            return await ctx.reply({
                image: {
                    url: imgUrl
                },
                mimetype: mime.contentType("png")
            });
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            return ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};

async function webp2png(source) {
    try {
        const isUrl = typeof source === "string" && /https?:\/\//.test(source);
        const blob = isUrl ? Buffer.from(source) : source;

        const form = new FormData();
        form.append("new-image-url", isUrl ? "" : "");
        form.append("new-image", blob, "image.webp");

        const res = await axios.post("https://ezgif.com/webp-to-png", form, {
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

        const res2 = await axios.post(`https://ezgif.com/webp-to-png/${obj.file}`, form2, {
            headers: form2.getHeaders()
        });

        const html2 = res2.data;
        const {
            document: document2
        } = new JSDOM(html2).window;
        return new URL(document2.querySelector("div#output > p.outfile > img").src, res2.request.res.responseUrl).toString();
    } catch (error) {
        console.error(`[${global.config.pkg.name}] Error:`, error);
        return null;
    }
}