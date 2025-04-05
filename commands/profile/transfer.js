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

        const userJid = ctx.msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || (userId ? `${userId}@s.whatsapp.net` : null) || ctx.quoted.senderJid;
        const senderJid = ctx.sender.jid;
        const senderId = tools.general.getID(senderJid);

        if ((!userJid || !coinAmount) || isNaN(coinAmount)) return await ctx.reply({
            text: `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
                quote(tools.cmd.generateCommandExample(ctx.used, `@${senderId} 8`)),
            mentions: [senderJid]
        });

        try {
            const [isOnWhatsApp] = await ctx.core.onWhatsApp(userJid);
            if (!isOnWhatsApp.exists) return await ctx.reply(quote(`❎ Akun tidak ada di WhatsApp!`));

            const senderCoin = await db.get(`user.${senderId}.coin`) || {};

            if (senderCoin < coinAmount) return await ctx.reply(quote(`❎ Koin Anda tidak mencukupi untuk transfer ini!`));

            await db.add(`user.${tools.general.getID(userJid)}.coin`, coinAmount);
            await db.subtract(`user.${senderId}.coin`, coinAmount);

            return await ctx.reply(quote(`✅ Berhasil mentransfer ${coinAmount} koin ke pengguna!`));
        } catch (error) {
            tools.cmd.handleError(ctx, error, false)
        }
    }
};