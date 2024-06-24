const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "unban",
    aliases: ["unbanuser"],
    category: "owner",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            owner: true
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const input = ctx._args.join(" ");

        const senderNumber = ctx.sender.jid.split("@")[0];
        const senderJid = ctx._sender.jid;
        const mentionedJids = ctx._msg?.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        const inputUser = `${input}@s.whatsapp.net`;
        const user = mentionedJids[0] || inputUser || null;

        if (!user) return ctx.reply({
            text: `${global.msg.argument}\n` +
                `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} @${senderNumber}`)}`,
            mentions: [senderJid]
        });

        try {
            const {
                exists
            } = await ctx._client.onWhatsApp(user)
            if (!exists) return ctx.reply(`${bold("[ ! ]")} Pengguna tidak ada di WhatsApp.`);

            if (user === senderJid) return ctx.reply(`${bold("[ ! ]")} Tidak dapat digunakan pada diri Anda sendiri.`);

            await global.db.set(`user.${user.split("@")[0]}.isBanned`, false);

            ctx.sendMessage(user, {
                text: "Anda telah diunbanned oleh Owner!"
            });
            ctx.reply(`${bold("[ ! ]")} Berhasil diunbanned!`);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};