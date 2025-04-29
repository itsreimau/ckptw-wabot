const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "unbanuser",
    aliases: ["unban", "ubu"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const userId = ctx.args[0];

        const user = ctx.msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || (userId ? `${userId}@s.whatsapp.net` : null) || ctx.quoted.senderJid;
        const senderJid = ctx.sender.jid;
        const senderId = tools.general.getID(senderJid);

        if (!user) return await ctx.reply({
            text: `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
                quote(tools.cmd.generateCommandExample(ctx.used, `@${senderId}`)),
            mentions: [senderJid]
        });

        const [isOnWhatsApp] = await ctx.core.onWhatsApp(user);
        if (!isOnWhatsApp.exists) return await ctx.reply(quote("❎ Akun tidak ada di WhatsApp!"));

        try {
            await db.set(`user.${tools.general.getID(user)}.banned`, false);

            await ctx.sendMessage(user, {
                text: quote("🎉 Anda telah diunbanned oleh Owner!")
            });
            await ctx.reply(quote("✅ Berhasil diunbanned!"));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};