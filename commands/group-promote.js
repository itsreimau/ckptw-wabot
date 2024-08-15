const {
    isAdmin
} = require("../tools/general.js");
const {
    bold,
    monospace,
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "promote",
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
        const senderNumber = senderJid.split("@")[0];
        const mentionedJids = ctx._msg?.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const account = Array.isArray(mentionedJids) && mentionedJids.length > 0 ? mentionedJids[0] : null;

        if (!account) return ctx.reply({
            text: `${quote(global.msg.argument)}\n` +
                 quote(`Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} @${senderNumber}`)}`),
            mentions: [senderJid]
        });

        try {
            if ((await isAdmin(ctx, account)) === 1) return ctx.reply(quote(`${bold("[ ! ]")} Anggota ini adalah admin grup.`));

            await ctx.group().promote([account]);

            return ctx.reply(quote(`${bold("[ ! ]")} Berhasil ditingkatkan dari anggota biasa menjadi admin!`));
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(quote(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`));
        }
    }
};