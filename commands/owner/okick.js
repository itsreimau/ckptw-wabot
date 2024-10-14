const {
    quote
} = require("@mengkodingan/ckptw");
const {
    jidDecode,
    jidEncode
} = require("@whiskeysockets/baileys");

module.exports = {
    name: "okick",
    category: "owner",
    handler: {
        botAdmin: true,
        group: true,
        owner: true,
        restrict: true
    },
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, module.exports.handler);
        if (status) return ctx.reply(message);

        const senderJidDecode = jidDecode(ctx.sender.jid);
        const senderJid = jidEncode(senderJidDecode.user, senderJidDecode.server);
        const senderNumber = senderJidDecode.user;
        const mentionedJids = ctx.msg?.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const account = Array.isArray(mentionedJids) && mentionedJids.length > 0 ? mentionedJids[0] : null;

        if (!account) return ctx.reply({
            text: `${quote(global.tools.msg.generateInstruction(["send"], ["text"]))}\n` +
                quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, `@${senderNumber}`)),
            mentions: [senderJid]
        });

        try {
            if ((await global.tools.general.isAdmin(ctx, account))) return ctx.reply(quote(`❎ Anggota ini adalah admin grup.`));

            await ctx.group().kick([account]);

            return ctx.reply(quote(`✅ Berhasil dikeluarkan!`));
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            return ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};