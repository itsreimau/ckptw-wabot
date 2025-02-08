const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "addcoinuser",
    aliases: ["addcoin", "acu"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const userId = ctx.args[0];
        const coinAmount = parseInt(ctx.args[1], 10);

        const userJid = ctx.quoted?.senderJid || ctx.msg?.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || (userId ? `${userId}@s.whatsapp.net` : null);
        const senderJid = ctx.sender.jid;
        const senderId = tools.general.getID(senderJid);

        if (!userJid && isNaN(coinAmount)) return await ctx.reply({
            text: `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
                quote(tools.msg.generateCommandExample(ctx.used, `@${senderId} 4`)),
            mentions: [senderJid]
        });

        try {
            const [result] = await ctx.core.onWhatsApp(userJid);
            if (!result.exists) return await ctx.reply(quote(`❎ Akun tidak ada di WhatsApp!`));

            await db.add(`user.${tools.general.getID(userJid)}.coin`, coinAmount);

            await ctx.sendMessage(userJid, {
                text: quote(`🎉 Anda telah menerima ${coinAmount} koin dari Owner!`)
            });
            return await ctx.reply(quote(`✅ Berhasil menambahkan ${coinAmount} koin kepada pengguna!`));
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};