const {
    monospace,
    quote
} = require("@itsreimau/ckptw-mod");

module.exports = {
    name: "ounmute",
    category: "owner",
    permissions: {
        group: true,
        owner: true
    },
    code: async (ctx) => {
        const groupId = tools.cmd.getID(ctx.id);

        if (["b", "bot"].includes(ctx.args[0]?.toLowerCase())) {
            await db.set(`group.${groupId}.mutebot`, true);
            return await ctx.reply(quote("✅ Berhasil me-unmute grup ini dari bot!"));
        }

        const accountJid = ctx.quoted.senderJid || ctx.msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || null;
        const accountId = tools.cmd.getID(accountJid);

        if (!accountJid) return await ctx.reply({
            text: `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
                `${quote(tools.msg.generateCommandExample(ctx.used, `@${tools.cmd.getID(ctx.sender.jid)}`))}\n` +
                quote(tools.msg.generateNotes(["Balas atau kutip pesan untuk menjadikan pengirim sebagai akun target.", `Ketik ${monospace(`${ctx.used.prefix + ctx.used.command} bot`)} untuk me-unmute bot.`])),
            mentions: [ctx.sender.jid]
        });

        if (accountId === config.bot.id) return await ctx.reply(quote(`❎ Ketik ${monospace(`${ctx.used.prefix + ctx.used.command} bot`)} untuk me-unmute bot.`));

        if (await ctx.group().isAdmin(accountJid)) return await ctx.reply(quote("❎ Dia adalah admin grup!"));

        try {
            let muteList = await db.get(`group.${groupId}.mute`) || [];

            muteList = muteList.filter(item => item !== accountId);

            await db.set(`group.${groupId}.mute`, muteList);

            return await ctx.reply(quote("✅ Berhasil me-unmute pengguna dari grup ini!"));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};