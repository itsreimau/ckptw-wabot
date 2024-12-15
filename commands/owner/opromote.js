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
        if (await handler(ctx, module.exports.handler)) return;

        const senderJid = ctx.sender.jid;
        const senderId = senderJid.split(/[:@]/)[0];
        const mentionedJids = ctx.msg?.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const account = Array.isArray(mentionedJids) && mentionedJids.length > 0 ? mentionedJids[0] : null;

        if (!account) return await ctx.reply({
            text: `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
                quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, `@${senderId}`)),
            mentions: [senderJid]
        });

        try {
            if ((await tools.general.isAdmin(ctx, account))) return await ctx.reply(quote(`❎ Dia adalah admin grup!`));

            await ctx.group().promote([account]);

            return await ctx.reply(quote(`✅ Berhasil ditingkatkan dari anggota menjadi admin!`));
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};