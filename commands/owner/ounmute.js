const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "ounmute",
    category: "owner",
    permissions: {
        group: true,
        owner: true
    },
    code: async (ctx) => {
        const accountJid = ctx.quoted.senderJid || ctx.msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || null;
        const accountId = tools.general.getID(accountJid);
        const senderJid = ctx.sender.jid;
        const senderId = tools.general.getID(senderJid);
        const groupId = ctx.isGroup() ? tools.general.getID(ctx.id) : null;

        if (ctx.args[0] === "bot") {
            await db.set(`group.${groupId}.mutebot`, true);
            return await ctx.reply(quote("✅ Berhasil me-mute grup ini dari bot!"));
        }

        if (!accountJid) return await ctx.reply({
            text: `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
                `${quote(tools.cmd.generateCommandExample(ctx.used, `@${senderId}`))}\n` +
                quote(tools.cmd.generateNotes(["Balas atau kutip pesan untuk menjadikan pengirim sebagai target akun.", `Ketik ${monospace(`${ctx.used.prefix + ctx.used.command} bot`)} untuk me-unmute bot.`])),
            mentions: [senderJid]
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