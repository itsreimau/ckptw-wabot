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
    name: "tovideo",
    aliases: ["togif", "tomp4", "tovid"],
    category: "converter",
    permissions: {},
    code: async (ctx) => {
        if (!await tools.general.checkQuotedMedia(ctx.quoted, ["sticker"])) return await ctx.reply(quote(tools.msg.generateInstruction(["reply"], ["sticker"])));

        try {
            const buffer = await ctx.quoted?.media.toBuffer()
            const result = buffer ? await webp2mp4(buffer) : null;

            if (!result) return await ctx.reply(config.msg.notFound);

            return await ctx.reply({
                video: {
                    url: result
                },
                mimetype: ctx.used.command === "togif" ? mime.lookup("gif") : mime.lookup("mp4"),
                gifPlayback: ctx.used.command === "togif" ? true : false
            });
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};

// Oleh UdeanDev (https://github.com/udeannn)
async function webp2mp4(blob) {
    try {
        const form = new FormData();
        form.append("new-image", blob, "image.webp");

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
    } catch (error) {
        consolefy.error(`Error: ${error}`);
        return null;
    }
}