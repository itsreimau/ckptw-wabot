const {
    quote
} = require("@mengkodingan/ckptw");
const {
    MessageType
} = require("@mengkodingan/ckptw/lib/Constant");
const Jimp = require("jimp");

module.exports = {
    name: "setpp",
    aliases: ["seticon", "setprofile"],
    category: "group",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            admin: true,
            banned: true,
            botAdmin: true,
            cooldown: true,
            group: true
        });
        if (status) return ctx.reply(message);

        const msgType = ctx.getMessageType();

        if (msgType !== MessageType.imageMessage && !(await ctx.quoted.media.toBuffer())) return ctx.reply(quote(global.tools.msg.generateInstruction(["send", "reply"], ["image"])));

        try {
            const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted?.media.toBuffer();

            if (ctx.args[0] === "full") {
                const {
                    img
                } = await cropAndScaleImage(buffer)
                await ctx._client.query({
                    tag: "iq",
                    attrs: {
                        to: ctx.id,
                        type: "set",
                        xmlns: "w:profile:picture"
                    },
                    content: [{
                        tag: "picture",
                        attrs: {
                            type: "image"
                        },
                        content: img
                    }]
                })
            } else {
                await ctx._client.updateProfilePicture(ctx.id, buffer);
            }

            return ctx.reply(quote(`✅ Berhasil mengubah gambar profil foto grup!`));
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            return ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};

async function cropAndScaleImage(buffer) {
    try {
        const image = await Jimp.read(buffer);

        const cropped = image.crop(0, 0, image.getWidth(), image.getHeight());

        const img = await cropped.scaleToFit(720, 720).getBufferAsync(Jimp.MIME_JPEG);
        const preview = await cropped.normalize().getBufferAsync(Jimp.MIME_JPEG);

        return {
            img,
            preview
        };
    } catch (error) {
        console.error("Error:", error);
        return error;
    }
}