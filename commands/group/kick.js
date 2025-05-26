const {
    quote
} = require("@itsreimau/ckptw-mod");

module.exports = {
    name: "kick",
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true,
        restrict: true
    },
    code: async (ctx) => {
        const accountJid = ctx.quoted.senderJid || ctx.msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || null;

        if (!accountJid) return await ctx.reply({
            text: `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
                `${quote(tools.cmd.generateCommandExample(ctx.used, `@${tools.general.getID(ctx.sender.jid)}`))}\n` +
                quote(tools.cmd.generateNotes(["Balas atau kutip pesan untuk menjadikan pengirim sebagai akun target."])),
            mentions: [ctx.sender.jid]
        });

        if (await ctx.group().isAdmin(accountJid)) return await ctx.reply(quote("❎ Dia adalah admin grup!"));

        try {
            await ctx.group().kick([accountJid]);

            return await ctx.reply(quote("✅ Berhasil dikeluarkan!"));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};