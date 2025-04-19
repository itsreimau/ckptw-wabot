const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "unmute",
    category: "group",
    permissions: {
        admin: true,
        group: true
    },
    code: async (ctx) => {
        const accountJid = ctx.msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || ctx.quoted.senderJid || null;
        const accountId = tools.general.getID(accountJid);
        const senderJid = ctx.sender.jid;
        const senderId = tools.general.getID(senderJid);

        if (!accountJid) return await ctx.reply({
            text: `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
                `${quote(tools.cmd.generateCommandExample(ctx.used, `@${senderId}`))}\n` +
                quote(tools.cmd.generateNotes([`Ketik ${monospace(`${ctx.used.prefix + ctx.used.command} bot`)} untuk me-unmute bot.`])),
            mentions: [senderJid]
        });

        if (accountId === config.bot.id) return await ctx.reply(quote(`❎ Ketik ${monospace(`${ctx.used.prefix + ctx.used.command} bot`)} untuk me-unmute bot.`));

        if (await ctx.group().isAdmin(accountJid)) return await ctx.reply(quote("❎ Dia adalah admin grup!"));

        if (ctx.args[0] === "bot") {
            await db.set(`group.${groupId}.mutebot`, false);
            return await ctx.reply(quote("✅ Berhasil me-unmute grup ini dari bot!"));
        }

        try {
            const groupId = ctx.isGroup() ? tools.general.getID(ctx.id) : null;
            let muteList = await db.get(`group.${groupId}.mute`) || [];

            muteList = muteList.filter(item => item !== accountId);

            await db.set(`group.${groupId}.mute`, muteList);

            return await ctx.reply(quote("✅ Berhasil me-unmute pengguna dari grup ini!"));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};