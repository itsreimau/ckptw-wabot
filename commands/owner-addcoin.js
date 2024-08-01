const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "addcoin",
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

        const userId = ctx._args[0];
        const coinAmount = parseInt(ctx._args[1], 10);

        const senderNumber = ctx.sender.jid.split("@")[0];
        const senderJid = ctx._sender.jid;
        const user = ctx._msg?.message?.extendedTextMessage?.contextInfo?.mentionedJid[0] || `${userId}@s.whatsapp.net`;

        if (!input || !user || isNaN(coinAmount)) return ctx.reply({
            text: `${global.msg.argument}\n` +
                `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} @${senderNumber} 4`)}`,
            mentions: [senderJid]
        });

        try {
            const [result] = await ctx._client.onWhatsApp(input.replace(/[^\d]/g, ""));
            if (!result.exists) return ctx.reply(`${bold("[ ! ]")} Akun tidak ada di WhatsApp.`);

            await global.db.add(`user.${user.split("@")[0]}.coin`, coinAmount);

            ctx.sendMessage(user, {
                text: `Anda telah menerima ${coinAmount} koin dari Owner!`
            });
            ctx.reply(`${bold("[ ! ]")} Berhasil menambahkan ${coinAmount} koin kepada pengguna!`);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};