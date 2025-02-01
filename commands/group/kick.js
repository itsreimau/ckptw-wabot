const {
    quote
} = require("@mengkodingan/ckptw");

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
        if (await middleware(ctx, module.exports.permissions)) return;

        const senderJid = ctx.sender.jid;
        const senderId = senderJid.split(/[:@]/)[0];
        const mentionedJids = ctx.msg?.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const account = Array.isArray(mentionedJids) && mentionedJids.length > 0 ? mentionedJids[0] : null;

        if (!account) return await ctx.reply({
            text: `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
                quote(tools.msg.generateCommandExample(ctx._used, `@${senderId}`)),
            mentions: [senderJid]
        });

        try {
            if (await tools.general.isAdmin(ctx.group(), account)) return await ctx.reply(quote(`❎ Dia adalah admin grup!`));

            await ctx.group().kick([account]);

            return await ctx.reply(quote(`✅ Berhasil dikeluarkan!`));
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};