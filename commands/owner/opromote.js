const {
    quote
} = require("@itsreimau/ckptw-mod");

module.exports = {
    name: "opromote",
    category: "owner",
    permissions: {
        botAdmin: true,
        group: true,
        owner: true
    },
    code: async (ctx) => {
        const accountJid = ctx.quoted.senderJid || ctx.msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || null;

        if (!accountJid) return await ctx.reply({
            text: `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
                `${quote(tools.msg.generateCommandExample(ctx.used, `@${tools.cmd.getID(ctx.sender.jid)}`))}\n` +
                quote(tools.msg.generateNotes(["Balas atau kutip pesan untuk menjadikan pengirim sebagai akun target."])),
            mentions: [ctx.sender.jid]
        });

        if (await ctx.group().isAdmin(accountJid)) return await ctx.reply(quote("❎ Dia adalah admin grup!"));

        try {
            await ctx.group().promote([accountJid]);

            return await ctx.reply(quote("✅ Berhasil ditingkatkan dari anggota menjadi admin!"));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};