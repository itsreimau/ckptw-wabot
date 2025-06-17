const {
    quote
} = require("@itsreimau/ckptw-mod");

module.exports = {
    name: "promote",
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        const accountJid = ctx.msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || ctx.quoted.senderJid || null;

        if (!accountJid) return await ctx.reply({
            text: `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
                `${quote(tools.msg.generateCmdExample(ctx.used, `@${await ctx.getId(ctx.sender.jid)}`))}\n` +
                quote(tools.msg.generateNotes(["Balas atau kutip pesan untuk menjadikan pengirim sebagai akun target."])),
            mentions: [ctx.sender.jid]
        });

        if (accountJid === await ctx.group().owner()) return await ctx.reply(quote("❎ Dia adalah owner grup!"));

        try {
            await ctx.group().promote([accountJid]);

            return await ctx.reply(quote("✅ Berhasil ditingkatkan dari anggota menjadi admin!"));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};