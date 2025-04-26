const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "transfer",
    aliases: ["tf"],
    category: "profile",
    permissions: {},
    code: async (ctx) => {
        const mentionedJid = ctx.msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        const userId = ctx.args[0];
        const userJid = mentionedJid || (userId ? `${userId}@s.whatsapp.net` : null) || ctx.quoted.senderJid;
        const senderId = tools.general.getID(ctx.sender.jid);
        const coinAmount = parseInt(ctx.args[mentionedJid ? 1 : 0], 10);

        if ((!userJid || !coinAmount) || isNaN(coinAmount)) return await ctx.reply({
            text: `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
                quote(tools.cmd.generateCommandExample(ctx.used, `@${senderId} 8`)),
            mentions: [senderJid]
        });

        const [isOnWhatsApp] = await ctx.core.onWhatsApp(userJid);
        if (isOnWhatsApp.length < 0) return await ctx.reply(quote("❎ Akun tidak ada di WhatsApp!"));

        try {
            const senderCoin = await db.get(`user.${senderId}.coin`) || {};

            if (senderCoin < coinAmount) return await ctx.reply(quote("❎ Koin Anda tidak mencukupi untuk transfer ini!"));

            await db.add(`user.${tools.general.getID(userJid)}.coin`, coinAmount);
            await db.subtract(`user.${senderId}.coin`, coinAmount);

            return await ctx.reply(quote(`✅ Berhasil mentransfer ${coinAmount} koin ke pengguna!`));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};