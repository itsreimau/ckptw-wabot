const {
    quote
} = require("@mengkodingan/ckptw");
const {
    MessageType
} = require("@mengkodingan/ckptw/lib/Constant");
const Jimp = require("jimp");
const mime = require("mime-types");

module.exports = {
    name: "blur",
    category: "tools",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            cooldown: true,
            coin: [10, "image", 3]
        });
        if (status) return ctx.reply(message);

        const msgType = ctx.getMessageType();
        const [checkMedia, checkQuotedMedia] = await Promise.all([
            global.tools.general.checkMedia(msgType, "image", ctx),
            global.tools.general.checkQuotedMedia(ctx.quoted, "image")
        ]);

        if (!checkMedia && !checkQuotedMedia) return ctx.reply(quote(global.tools.msg.generateInstruction(["send", "reply"], "image")));;

        try {
            const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted?.media.toBuffer();
            let level = ctx.args[0] || "5";
            let img = await Jimp.read(buffer);
            img.blur(isNaN(level) ? 5 : parseInt(level));
            img.getBuffer(Jimp.MIME_JPEG, async (err, buffer) => {
                if (error) return ctx.reply(quote(`❎ Tidak dapat mengaburkan gambar!`));

                return await ctx.reply({
                    image: buffer,
                    caption: `${quote("Anda bisa mengaturnya. Semua level tersedia, defaultnya adalah 5.")}\n` +
                        quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "10")),
                    mimetype: mime.contentType("jpeg")
                });
            });
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            return ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};