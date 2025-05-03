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
        const accountJid = ctx.quoted.senderJid || ctx.msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || null;
        const senderJid = ctx.sender.jid;
        const senderId = tools.general.getID(senderJid);

        if (!accountJid) return await ctx.reply({
            text: `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
                `${quote(tools.cmd.generateCommandExample(ctx.used, `@${senderId}`))}\n` +
                quote(tools.cmd.generateNotes(["Balas atau kutip pesan untuk menjadikan pengirim sebagai akun target."])),
            mentions: [senderJid]
        });

        if (!await ctx.group().isAdmin(accountJid)) return await ctx.reply(quote("❎ Dia adalah anggota!"));

        try {
            await ctx.group().demote([accountJid]);

            return await ctx.reply(quote("✅ Berhasil diturunkan dari admin menjadi anggota!"));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};