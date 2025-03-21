const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "transfer",
    aliases: ["tf"],
    category: "profile",
    permissions: {},
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

            const userCoin = await db.get(`user.${senderId}.coin`) || {};

            if (senderCoin >= coinAmount) return await ctx.reply(quote(`❎ Koin Anda tidak mencukupi untuk transfer ini!`));

            await db.add(`user.${tools.general.getID(userJid)}.coin`, coinAmount);
            await db.subtract(`user.${senderId}.coin`, coinAmount);

            return await ctx.reply(quote(`✅ Berhasil mentransfer ${coinAmount} koin ke pengguna!`));
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};