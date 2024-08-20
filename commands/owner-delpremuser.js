const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const {
    S_WHATSAPP_NET
} = require("@whiskeysockets/baileys");

module.exports = {
    name: "delprem",
    aliases: ["delpremuser"],
    category: "owner",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            owner: true
        });
        if (status) return ctx.reply(message);

        const input = ctx._args.join(" ") || null;

        const senderJid = ctx._sender.jid;
        const senderNumber = senderJid.replace(/@.*|:.*/g, "");
        const mentionedJids = ctx._msg?.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const user = Array.isArray(mentionedJids) && mentionedJids.length > 0 ? mentionedJids[0] : input + S_WHATSAPP_NET;

        if (!input || !user) return ctx.reply({
            text: `${quote(global.msg.argument)}\n` +
                quote(`Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} @${senderNumber}`)}`),
            mentions: [senderJid]
        });

        try {
            const [result] = await ctx._client.onWhatsApp(user);
            if (!result.exists) return ctx.reply(quote(`❎ Akun tidak ada di WhatsApp.`));

            await global.db.set(`user.${user.split("@")[0]}.isPremium`, false);

            ctx.sendMessage(user, {
                text: quote(`🎉 Anda telah dihapus sebagai pengguna Premium oleh Owner!`)
            });
            return ctx.reply(quote(`✅ Berhasil dihapus sebagai pengguna Premium!`));
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};