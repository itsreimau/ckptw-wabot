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