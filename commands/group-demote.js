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
        const member = mentionedJids[0] || null;

        if (!member.length) return ctx.reply({
            text: `${global.msg.argument}\n` +
                `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} @${senderNumber}`)}`,
            mentions: [senderJid]
        });

        try {
            if (member === senderJid) throw new Error("Tidak dapat digunakan pada diri Anda sendiri.");

            if ((await isAdmin(ctx, member)) === 1) throw new Error("Anggota ini adalah anggota biasa.");

            await ctx._client.groupParticipantsUpdate(ctx.id, [member], "demote");

            return ctx.reply(`${bold("[ ! ]")} Berhasil diturunkan dari admin menjadi anggota biasa!`);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};