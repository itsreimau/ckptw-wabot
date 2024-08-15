const {
    bold,
    monospace,
    quote
} = require("@mengkodingan/ckptw");

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
        const senderNumber = senderJid.split("@")[0];
        const mentionedJids = ctx._msg?.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const user = Array.isArray(mentionedJids) && mentionedJids.length > 0 ? mentionedJids[0] : `${userId}@s.whatsapp.net`;

        if (!input || !user) return ctx.reply({
            text: `${quote(global.msg.argument)}\n` +
                `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} @${senderNumber}`)}`,
            mentions: [senderJid]
        });

        try {
            const [result] = await ctx._client.onWhatsApp(input.replace(/[^\d]/g, ""));
            if (!result.exists) return ctx.reply(quote(`${bold("[ ! ]")} Akun tidak ada di WhatsApp.`));

            await global.db.set(`user.${user.split("@")[0]}.isPremium`, false);

            ctx.sendMessage(user, {
                text: quote(`${bold("[ ! ]")} Anda telah dihapus sebagai pengguna Premium oleh Owner!`)
            });
            return ctx.reply(quote(`${bold("[ ! ]")} Berhasil dihapus sebagai pengguna Premium!`));
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(quote(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`));
        }
    }
};