const {
    quote
} = require("@itsreimau/ckptw-mod");

module.exports = {
    name: "unbanuser",
    aliases: ["unban", "ubu"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const userJid = ctx.quoted.senderJid || ctx.msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || (ctx.args[0] ? `${ctx.args[0].replace(/[^\d]/g, "")}@s.whatsapp.net` : null);

        if (!userJid) return await ctx.reply({
            text: `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
                `${quote(tools.msg.generateCommandExample(ctx.used, `@${tools.cmd.getID(ctx.sender.jid)}`))}\n` +
                quote(tools.msg.generateNotes(["Balas atau kutip pesan untuk menjadikan pengirim sebagai akun target."])),
            mentions: [ctx.sender.jid]
        });

        const isOnWhatsApp = await ctx.core.onWhatsApp(userJid);
        if (isOnWhatsApp.length === 0) return await ctx.reply(quote("❎ Akun tidak ada di WhatsApp!"));

        try {
            await db.set(`user.${tools.cmd.getID(userJid)}.banned`, false);

            await ctx.sendMessage(userJid, {
                text: quote("🎉 Anda telah diunbanned oleh Owner!")
            });
            await ctx.reply(quote("✅ Berhasil diunbanned!"));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};