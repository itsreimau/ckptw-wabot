const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const {
    S_WHATSAPP_NET
} = require("@whiskeysockets/baileys");

module.exports = {
    name: "addcoin",
    category: "owner",
    code: async (ctx) => {
        const [userLanguage] = await Promise.all([
            global.db.get(`user.${ctx.sender.jid.replace(/@.*|:.*/g, "")}.language`)
        ]);

        const {
            status,
            message
        } = await global.handler(ctx, {
            owner: true
        });
        if (status) return ctx.reply(message);

        const userId = ctx.args[0];
        const coinAmount = parseInt(ctx.args[1], 10);

        const senderJid = ctx.sender.jid;
        const senderNumber = senderJid.replace(/@.*|:.*/g, "");
        const mentionedJids = ctx.msg?.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const user = Array.isArray(mentionedJids) && mentionedJids.length > 0 ? mentionedJids[0] : userId + S_WHATSAPP_NET;

        if (!ctx.args.length || !user || isNaN(coinAmount)) return ctx.reply({
            text: `${quote(`📌 ${await global.tools.msg.translate(global.msg.argument, userLanguage)}`)}\n` +
                quote(`${await global.tools.msg.translate("Contoh", userLanguage)}: ${monospace(`${ctx._used.prefix + ctx._used.command} @${senderNumber} 4`)}`),
            mentions: [senderJid]
        });

        try {
            const [result] = await ctx._client.onWhatsApp(user);
            if (!result.exists) return ctx.reply(quote(`❎ ${await global.tools.msg.translate("Akun tidak ada di WhatsApp.", userLanguage)}`));

            await global.db.add(`user.${user.replace(/@.*|:.*/g, "")}.coin`, coinAmount);

            ctx.sendMessage(user, {
                text: quote(`🎉 ${await global.tools.msg.translate(`Anda telah menerima ${coinAmount} koin dari Owner!`, userLanguage)}`)
            });
            return ctx.reply(quote(`✅ ${await global.tools.msg.translate(`Berhasil menambahkan ${coinAmount} koin kepada pengguna!`, userLanguage)}`));
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(quote(`⚠ ${await global.tools.msg.translate("Terjadi kesalahan", userLanguage)}: ${error.message}`));
        }
    }
};