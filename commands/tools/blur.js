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
    handler: {
        banned: true,
        cooldown: true,
        coin: [10, "image", 3]
    },
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, module.exports.handler);
        if (status) return await ctx.reply(message);

        const input = ctx.args.join(" ") || null;

        const msgType = ctx.getMessageType();
        const [checkMedia, checkQuotedMedia] = await Promise.all([
            global.tools.general.checkMedia(msgType, "image", ctx),
            global.tools.general.checkQuotedMedia(ctx.quoted, "image")
        ]);

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(
            `${quote(global.tools.msg.generateInstruction(["send", "reply"], "image"))}\n` +
            quote(global.tools.msg.generatesFlagInformation({
                "-l <number>": "Tingkat keburaman."
            }))
        );

        try {
            const flag = global.tools.general.parseFlag(input, {
                "-l": {
                    type: "value",
                    key: "level",
                    validator: (val) => !isNaN(val) && /^[2|4|6|8|16]$/.test(val),
                    parser: (val) => parseInt(val, 10)
                }
            });

            const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted?.media.toBuffer();
            let level = flag.level || "5";
            let img = await Jimp.read(buffer);
            img.blur(isNaN(level) ? 5 : parseInt(level));
            img.getBuffer(Jimp.MIME_JPEG, async (err, buffer) => {
                if (error) return await ctx.reply(quote(`❎ Tidak dapat mengaburkan gambar!`));

                return await ctx.reply({
                    image: buffer,
                    mimetype: mime.lookup("jpeg")
                });
            });
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            return await ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};