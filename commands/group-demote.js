const {
    isAdmin
} = require("../tools/simple.js");
const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "demote",
    category: "group",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            admin: true,
            banned: true,
            botAdmin: true,
            group: true
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const senderNumber = ctx.sender.jid.split("@")[0];
        const senderJid = ctx._sender.jid;
        const mentionedJids = ctx._msg?.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const account = mentionedJids[0] || null;

        if (!account) return ctx.reply({
            text: `${global.msg.argument}\n` +
                `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} @${senderNumber}`)}`,
            mentions: [senderJid]
        });

        try {
            if (account === senderJid) return ctx.reply(`${bold("[ ! ]")} Tidak dapat digunakan pada diri Anda sendiri.`);

            if ((await isAdmin(ctx, account)) === 1) return ctx.reply(`${bold("[ ! ]")} Anggota ini adalah anggota biasa.`);

            await ctx.group().demote([account]);

            return ctx.reply(`${bold("[ ! ]")} Berhasil diturunkan dari admin menjadi anggota biasa!`);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};