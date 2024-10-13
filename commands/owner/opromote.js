const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "opromote",
    category: "owner",
    handler: {
        botAdmin: true,
        group: true,
        owner: true
    },
    code: async (ctx) => {
        await global.handler(ctx, module.exports.handler).then(({
            status,
            message
        }) => {
            if (status) return ctx.reply(message);
        });

        const senderJid = ctx.sender.jid;
        const senderNumber = senderJid.split("@")[0];
        const mentionedJids = ctx.msg?.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const account = Array.isArray(mentionedJids) && mentionedJids.length > 0 ? mentionedJids[0] : null;

        if (!account) return ctx.reply({
            text: `${quote(global.tools.msg.generateInstruction(["send"], ["text"]))}\n` +
                quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, `@${senderNumber}`)),
            mentions: [senderJid]
        });

        try {
            if ((await global.tools.general.isAdmin(ctx, account))) return ctx.reply(quote(`❎ Anggota ini adalah admin grup.`));

            await ctx.group().promote([account]);

            return ctx.reply(quote(`✅ Berhasil ditingkatkan dari anggota biasa menjadi admin!`));
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            return ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};