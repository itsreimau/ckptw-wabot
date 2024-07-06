const {
    isAdmin
} = require("../tools/simple.js");
const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "opromote",
    category: "owner",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            botAdmin: true,
            group: true,
            owner: true
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const senderNumber = ctx.sender.jid.split("@")[0];
        const senderJid = ctx._sender.jid;
        const mentionedJids = ctx._msg?.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const account = mentionedJids[0] || null;

        if (!account.length) return ctx.reply({
            text: `${global.msg.argument}\n` +
                `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} @${senderNumber}`)}`,
            mentions: [senderJid]
        });

        try {
            if ((await isAdmin(ctx, account)) === 1) return ctx.reply(`${bold("[ ! ]")} Anggota ini adalah admin grup.`);

            await ctx.group().promote([account]);

            return ctx.reply(`${bold("[ ! ]")} Berhasil ditingkatkan dari anggota biasa menjadi admin!`);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};