const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const {
    MessageType
} = require("@mengkodingan/ckptw/lib/Constant");
const FormData = require("form-data");
const Jimp = require("jimp");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "hd",
    aliases: ["enhance", "enhancer", "hd", "hdr", "remini", "upscale", "upscaler"],
    category: "tools",
    code: async (ctx) => {
        const [userLanguage] = await Promise.all([
            global.db.get(`user.${ctx.sender.jid.replace(/@.*|:.*/g, "")}.language`)
        ]);

        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            coin: 3
        });
        if (status) return ctx.reply(message);

        const msgType = ctx.getMessageType();

        if (msgType !== MessageType.imageMessage && !(await ctx.quoted.media.toBuffer())) return ctx.reply(quote(`📌 ${await global.tools.msg.translate("Berikan atau balas media berupa gambar!", userLanguage)}`));

        try {
            const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted?.media.toBuffer();
            const result = await upscale(buffer, ctx.args[0], ctx.args[1] === "anime" ? true : false);

            return await ctx.reply({
                image: {
                    url: result.image
                },
                caption: `${quote(await global.tools.msg.translate(`Anda bisa mengaturnya. Tersedia ukuran 2, 4, 6, 8, dan 16, defaultnya adalah 2. Gunakan ${monospace("anime")} jika gambarnya anime.`, userLanguage))}\n` +
                    quote(`${await global.tools.msg.translate("Contoh", userLanguage)}: ${monospace(`${ctx._used.prefix + ctx._used.command} 16 anime`)}`),
                mimetype: mime.contentType("png")
            });
        } catch (error) {
            console.error("Error", error);
            return ctx.reply(quote(`⚠ ${await global.tools.msg.translate("Terjadi kesalahan", userLanguage)}: ${error.message}`));
        }
    }
};

// Created by https://github.com/ZTRdiamond
async function upscale(buffer, size = 2, anime = false) {
    if (!buffer) throw new Error("undefined buffer input!");
    if (!Buffer.isBuffer(buffer)) throw new Error("invalid buffer input");
    if (!/(2|4|6|8|16)/.test(size.toString())) throw new Error("invalid upscale size!");

    const image = await Jimp.read(buffer);
    const {
        width,
        height
    } = image.bitmap;
    const newWidth = width * size;
    const newHeight = height * size;

    const form = new FormData();
    form.append("name", "upscale-" + Date.now());
    form.append("imageName", "upscale-" + Date.now());
    form.append("desiredHeight", newHeight.toString());
    form.append("desiredWidth", newWidth.toString());
    form.append("outputFormat", "png");
    form.append("compressionLevel", "none");
    form.append("anime", anime.toString());
    form.append("image_file", buffer, {
        filename: "upscale-" + Date.now() + ".png",
        contentType: 'image/png',
    });

    const apiUrl = global.tools.api.createUrl("https://api.upscalepics.com", "/upscale-to-size", {});
    const response = await axios.post(apiUrl, form, {
        headers: {
            ...form.getHeaders(),
            origin: "https://upscalepics.com",
            referer: "https://upscalepics.com"
        }
    });

    const data = response.data;
    if (data.error) throw new Error("Error from upscaler API!");

    return {
        status: true,
        image: data.bgRemoved
    };
}