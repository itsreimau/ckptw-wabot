const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const {
    MessageType
} = require("@mengkodingan/ckptw/lib/Constant");
const mime = require("mime-types");

module.exports = {
    name: "bard",
    category: "ai",
    handler: {
        banned: true,
        cooldown: true,
        coin: [10, "text", 1]
    },
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, module.exports.handler);
        if (status) return ctx.reply(message);

        const input = ctx.args.join(" ") || null;

        if (!input) return ctx.reply(
            `${quote(global.tools.msg.generateInstruction(["send"], ["text", "image"]))}\n` +
            `${quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "apa itu whatsapp"))}\n` +
            quote(global.tools.msg.generateNotes(["AI ini dapat melihat gambar dan menjawab pertanyaan tentangnya. Kirim gambar dan tanyakan apa saja!"]))
        );

        const msgType = ctx.getMessageType();
        const [checkMedia, checkQuotedMedia] = await Promise.all([
            global.tools.general.checkMedia(msgType, "image", ctx),
            global.tools.general.checkQuotedMedia(ctx.quoted, "image")
        ]);

        try {
            if (checkMedia || checkQuotedMedia) {
                const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted?.media.toBuffer();
                const uploadUrl = await global.tools.general.upload(buffer);
                const apiUrl = global.tools.api.createUrl("widipe", "/bardimg", {
                    url: uploadUrl,
                    text: input
                });
                const {
                    data
                } = await axios.get(apiUrl);

                return ctx.reply(data.result);
            } else {
                const apiUrl = global.tools.api.createUrl("widipe", "/bard", {
                    text: input
                });
                const {
                    data
                } = await axios.get(apiUrl);

                return ctx.reply(data.result);
            }
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            if (error.status !== 200) return ctx.reply(global.config.msg.notFound);
            return ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};