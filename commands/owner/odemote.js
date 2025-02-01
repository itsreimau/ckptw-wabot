const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "odemote",
    category: "owner",
    permissions: {
        botAdmin: true,
        group: true,
        owner: true
    },
    code: async (ctx) => {
        const senderJid = ctx.sender.jid;
        const senderId = ctx.sender.decodedJid;
        const mentionedJids = ctx.msg?.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const account = Array.isArray(mentionedJids) && mentionedJids.length > 0 ? mentionedJids[0] : null;

        if (!account) return await ctx.reply({
            text: `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
                quote(tools.msg.generateCommandExample(ctx.used, `@${senderId}`)),
            mentions: [senderJid]
        });

        try {
            if (!await ctx.group().isAdmin(account)) return await ctx.reply(quote(`❎ Dia adalah anggota!`));

            await ctx.group().demote([account]);

            return await ctx.reply(quote(`✅ Berhasil diturunkan dari admin menjadi anggota!`));
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};