const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "unwarning",
    aliases: ["unwarn"],
    category: "group",
    handler: {
        admin: true,
        banned: true,
        botAdmin: true,
        cooldown: true,
        group: true
    },
    code: async (ctx) => {
        const {
            status,
            message
        } = await handler(ctx, module.exports.handler);
        if (status) return await ctx.reply(message);

        const senderJid = ctx.sender.jid;
        const senderNumber = senderJid.split(/[:@]/)[0];
        const mentionedJids = ctx.msg?.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const account = Array.isArray(mentionedJids) && mentionedJids.length > 0 ? mentionedJids[0] : null;

        if (!account) return await ctx.reply({
            text: `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
                quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, `@${senderNumber}`)),
            mentions: [senderJid]
        });

        try {
            const groupNumber = ctx.isGroup() ? ctx.id.split("@")[0] : null;

            if (await tools.general.isAdmin(ctx, account)) return await ctx.reply(quote(`❎ Anggota ini adalah admin grup.`));

            await db.subtract(`group.${groupNumber}.warning.${senderNumber}`, 1);

            return await ctx.reply(quote(`✅ Berhasil diwarning!`));
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            return await ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};