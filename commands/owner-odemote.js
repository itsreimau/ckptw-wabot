const {
    isAdmin
} = require("../tools/general.js");
const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "odemote",
    category: "owner",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            botAdmin: true,
            group: true,
            owner: true
        });
        if (status) return ctx.reply(message);

        const senderJid = ctx._sender.jid;
        const senderNumber = senderJid.split("@")[0];
        const mentionedJids = ctx._msg?.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const account = Array.isArray(mentionedJids) && mentionedJids.length > 0 ? mentionedJids[0] : null;

        if (!account) return ctx.reply({
            text: `${global.msg.argument}\n` +
                `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} @${senderNumber}`)}`,
            mentions: [senderJid]
        });

        try {
            if (!(await isAdmin(ctx, account)) === 1) return ctx.reply(`${bold("[ ! ]")} Anggota ini adalah anggota biasa.`);

            await ctx.group().demote([account]);

            return ctx.reply(`${bold("[ ! ]")} Berhasil diturunkan dari admin menjadi anggota biasa!`);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};