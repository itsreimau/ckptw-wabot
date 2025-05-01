const {
    quote
} = require("@mengkodingan/ckptw");
const Jimp = require("jimp");

module.exports = {
    name: "setpp",
    aliases: ["seticon"],
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        const msgType = ctx.getMessageType();
        const [checkMedia, checkQuotedMedia] = await Promise.all([
            tools.cmd.checkMedia(msgType, "image"),
            tools.cmd.checkQuotedMedia(ctx.quoted, "image")
        ]);

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(quote(tools.cmd.generateInstruction(["send", "reply"], "image")));

        try {
            const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted.media.toBuffer();

            if (ctx.args[0] === "full") {
                const content = await cropped(buffer);
                await ctx.core.query({
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
                        content
                    }]
                });

                return await ctx.reply(quote("✅ Berhasil mengubah gambar profil grup!"));
            }

            await ctx.core.updateProfilePicture(ctx.id, buffer);

            return await ctx.reply(quote("✅ Berhasil mengubah gambar profil grup!"));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};

async function cropped(buffer) {
    const image = await Jimp.read(buffer);
    return image.scaleToFit(720, 720).getBufferAsync(Jimp.MIME_JPEG);
}