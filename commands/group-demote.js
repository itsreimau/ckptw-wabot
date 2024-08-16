const {
    isAdmin
} = require("../tools/general.js");
const {
    bold,
    monospace,
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "demote",
    category: "group",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            admin: true,
            banned: true,
            botAdmin: true,
            group: true
        });
        if (status) return ctx.reply(message);

        const senderJid = ctx._sender.jid;
        const senderNumber = ctx._sender.jid.replace(/@.*|:.*/g, '');
        const mentionedJids = ctx._msg?.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const account = Array.isArray(mentionedJids) && mentionedJids.length > 0 ? mentionedJids[0] : null;

        if (!account) return ctx.reply({
            text: `${quote(global.msg.argument)}\n` +
                quote(`Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} @${senderNumber}`)}`),
            mentions: [senderJid]
        });

        try {
            if ((await isAdmin(ctx, {
                    id: account
                })) === 0) return ctx.reply(quote(`⚠ Anggota ini adalah anggota biasa.`));

            await ctx.group().demote([account]);

            return ctx.reply(quote(`⚠ Berhasil diturunkan dari admin menjadi anggota biasa!`));
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};