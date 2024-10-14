const {
    quote
} = require("@mengkodingan/ckptw");
const {
    jidDecode,
    jidEncode,
    S_WHATSAPP_NET
} = require("@whiskeysockets/baileys");

module.exports = {
    name: "unban",
    aliases: ["unbanuser"],
    category: "owner",
    handler: {
        owner: true
    },
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, module.exports.handler);
        if (status) return ctx.reply(message);

        const userId = ctx.args.join(" ") || null;

        const senderJidDecode = jidDecode(ctx.sender.jid);
        const senderJid = jidEncode(senderJidDecode.user, senderJidDecode.server);
        const senderNumber = senderJidDecode.user;
        const mentionedJids = ctx.msg?.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const user = Array.isArray(mentionedJids) && mentionedJids.length > 0 ? mentionedJids[0] : jidEncode(userId, S_WHATSAPP_NET);

        if (!userId && !user) return ctx.reply({
            text: `${quote(global.tools.msg.generateInstruction(["send"], ["text"]))}\n` +
                quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, `@${senderNumber}`)),
            mentions: [senderJid]
        });

        try {
            const [result] = await ctx._client.onWhatsApp(user);
            if (!result.exists) return ctx.reply(quote(`❎ Akun tidak ada di WhatsApp.`));

            const userDecode = jidDecode(user);
            await global.db.set(`user.${userDecode.user}.isBanned`, false);

            ctx.sendMessage(user, {
                text: quote(`🎉 Anda telah diunbanned oleh Owner!`)
            });
            ctx.reply(quote(`✅ Berhasil diunbanned!`));
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            return ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};