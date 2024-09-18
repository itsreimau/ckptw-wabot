const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "okick",
    category: "owner",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            botAdmin: true,
            group: true,
            owner: true,
            restrict: true
        });
        if (status) return ctx.reply(message);

        const senderJid = ctx.sender.jid;
        const senderNumber = senderJid.replace(/@.*|:.*/g, "");
        const mentionedJids = ctx.msg?.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const account = Array.isArray(mentionedJids) && mentionedJids.length > 0 ? mentionedJids[0] : null;

        if (!account) return ctx.reply({
            text: `${quote(global.tools.msg.generateInstruction(["send"], ["text"]))}\n` +
                quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, `@${senderNumber}`)),
            mentions: [senderJid]
        });

        try {
            if ((await global.tools.general.isAdmin(ctx, account))) return ctx.reply(quote(`⚠ Anggota ini adalah admin grup.`));

            await ctx.group().kick([account]);

            return ctx.reply(quote(`✅ Berhasil dikeluarkan!`));
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};