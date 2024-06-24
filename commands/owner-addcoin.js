const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "addcoin",
    category: "owner",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            owner: true
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const input = ctx._args;

        const userId = input[0];
        const coinAmount = parseInt(input[1], 10);

        const senderNumber = ctx.sender.jid.split("@")[0];
        const senderJid = ctx._sender.jid;
        const mentionedJids = ctx._msg?.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        const inputUser = `${input}@s.whatsapp.net`;
        const user = mentionedJids[0] || inputUser || null;

        if (!user || isNaN(coinAmount)) return ctx.reply({
            text: `${global.msg.argument}\n` +
                `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} @${senderNumber} 4`)}`,
            mentions: [senderJid]
        });

        try {
            const {
                exists
            } = await ctx._client.onWhatsApp(user)
            if (!exists) return ctx.reply(`${bold("[ ! ]")} Pengguna tidak ada di WhatsApp.`);

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