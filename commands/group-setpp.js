const {
    quote
} = require("@mengkodingan/ckptw");
const {
    MessageType
} = require("@mengkodingan/ckptw/lib/Constant");

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
            group: true
        });
        if (status) return ctx.reply(message);

        const msgType = ctx.getMessageType();
        const media = ctx.msg.media || ctx.quoted?.media;

        if (msgType !== MessageType.imageMessage && !ctx.quoted) return ctx.reply(quote(`📌 Berikan atau balas media berupa gambar!`));

        try {
            const buffer = await media.toBuffer();
            await ctx._client.updateProfilePicture(ctx.id, buffer);

            return ctx.reply(quote(`✅ Berhasil mengubah gambar profil foto grup!`));
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};