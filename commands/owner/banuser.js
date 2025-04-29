const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "banuser",
    aliases: ["ban", "bu"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const userId = ctx.args[0];

        const userJid = ctx.msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || (userId ? `${userId}@s.whatsapp.net` : null) || ctx.quoted.senderJid;
        const senderJid = ctx.sender.jid;
        const senderId = tools.general.getID(senderJid);

        if (!userJid) return await ctx.reply({
            text: `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
                quote(tools.cmd.generateCommandExample(ctx.used, `@${senderId}`)),
            mentions: [senderJid]
        });

        const [isOnWhatsApp] = await ctx.core.onWhatsApp(userJid);
        if (!isOnWhatsApp.exists) return await ctx.reply(quote("❎ Akun tidak ada di WhatsApp!"));

        try {
            await db.set(`user.${tools.general.getID(userJid)}.banned`, true);

            await ctx.sendMessage(userJid, {
                text: quote("🎉 Anda telah dibanned oleh Owner!")
            });
            return await ctx.reply(quote("✅ Berhasil dibanned!"));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};