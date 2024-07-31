const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "ban",
    aliases: ["banuser"],
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

        const senderNumber = ctx.sender.jid.split("@")[0];
        const senderJid = ctx._sender.jid;
        const mentionedJids = ctx._msg?.message?.extendedTextMessage?.contextInfo?.mentionedJid.length ? ctx._msg?.message?.extendedTextMessage?.contextInfo?.mentionedJid : null;
        const inputUser = input ? `${input}@s.whatsapp.net` : null;
        const user = mentionedJids[0] || inputUser;

        if (!user) return ctx.reply({
            text: `${global.msg.argument}\n` +
                `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} @${senderNumber}`)}`,
            mentions: [senderJid]
        });

        try {
            const onWhatsApp = await ctx._client.onWhatsApp(user);
            if (!onWhatsApp || !onWhatsApp[0] || !onWhatsApp[0].exists) return ctx.reply(`${bold("[ ! ]")} Pengguna tidak ada di WhatsApp.`);

            if (user === senderJid) return ctx.reply(`${bold("[ ! ]")} Tidak dapat digunakan pada diri Anda sendiri.`);

            await global.db.set(`user.${user.split("@")[0]}.isBanned`, true);

            ctx.sendMessage(user, {
                text: "Anda telah dibanned oleh Owner!"
            });
            ctx.reply(`${bold("[ ! ]")} Berhasil dibanned!`);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};