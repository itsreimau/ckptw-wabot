const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "delprem",
    aliases: ["delpremuser"],
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
            if (user === senderJid) throw new Error("Tidak dapat digunakan pada diri Anda sendiri.");

            await global.db.set(`user.${user.split("@")[0]}.isPremium`, false);

            ctx.sendMessage(user, {
                text: "Anda telah dihapus sebagai pengguna Premium oleh Owner!"
            });
            ctx.reply(`${bold("[ ! ]")} Berhasil dihapus sebagai pengguna Premium!`);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};