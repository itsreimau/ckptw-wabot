const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "okick",
    category: "owner",
    permissions: {
        botAdmin: true,
        group: true,
        owner: true,
        restrict: true
    },
    code: async (ctx) => {
        const senderJid = ctx.sender.jid;
        const senderId = tools.general.getID(senderJid);
        const accountJid = ctx.msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || ctx.quoted.senderJid || null;

        if (!accountJid) return await ctx.reply({
            text: `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
                quote(tools.cmd.generateCommandExample(ctx.used, `@${senderId}`)),
            mentions: [senderJid]
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