const {
    quote
} = require("@im-dims/baileys-library");

module.exports = {
    name: "addcoinuser",
    aliases: ["addcoin", "acu"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const mentionedJid = ctx.msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        const userId = ctx.args[0];
        const userJid = ctx.quoted.senderJid || mentionedJid || (userId ? `${userId}@s.whatsapp.net` : null);
        const senderId = tools.general.getID(ctx.sender.jid);
        const coinAmount = parseInt(ctx.args[mentionedJid ? 1 : 0], 10);

        if ((!userJid || !coinAmount) || isNaN(coinAmount)) return await ctx.reply({
            text: `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
                `${quote(tools.cmd.generateCommandExample(ctx.used, `@${senderId} 8`))}\n` +
                quote(tools.cmd.generateNotes(["Balas atau kutip pesan untuk menjadikan pengirim sebagai akun target."])),
            mentions: [senderJid]
        });

        const [isOnWhatsApp] = await ctx.core.onWhatsApp(userJid);
        if (!isOnWhatsApp.exists) return await ctx.reply(quote("❎ Akun tidak ada di WhatsApp!"));

        try {
            await db.add(`user.${tools.general.getID(userJid)}.coin`, coinAmount);

            await ctx.sendMessage(userJid, {
                text: quote(`🎉 Anda telah menerima ${coinAmount} koin dari Owner!`)
            });
            return await ctx.reply(quote(`✅ Berhasil menambahkan ${coinAmount} koin kepada pengguna!`));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};