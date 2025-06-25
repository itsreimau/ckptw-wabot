module.exports = {
    name: "warning",
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true,
        restrict: true
    },
    code: async (ctx) => {
        const accountJid = ctx.quoted?.senderJid || ctx.msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || null;
        const accountId = ctx.getId(accountJid);

        const senderJid = ctx.sender.jid;
        const senderId = ctx.getId(senderJid);

        if (!accountJid) return await ctx.reply({
            text: `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
                `${formatter.quote(tools.msg.generateCmdExample(ctx.used, `@${senderId}`))}\n` +
                formatter.quote(tools.msg.generateNotes(["Balas atau kutip pesan untuk menjadikan pengirim sebagai akun target."])),
            mentions: [senderJid]
        });

        if (accountId === config.bot.id) return await ctx.reply(formatter.quote(`❎ Tidak bisa memberikan warning ke bot.`));
        if (accountJid === await ctx.group().owner()) return await ctx.reply(formatter.quote("❎ Tidak bisa memberikan warning ke admin grup!"));

        try {
            const groupId = ctx.getId(ctx.id);
            const groupDb = await db.get(`group.${groupId}`) || {};
            const warnings = groupDb?.warnings || {};
            const current = warnings[accountId] || 0;
            const newWarning = current + 1;

            const maxwarnings = groupDb?.maxwarnings || 3;
            if (newWarning >= maxwarnings) {
                await ctx.reply(formatter.quote(`⛔ Kamu telah menerima ${maxwarnings} warning dan akan dikeluarkan dari grup!`));
                if (!config.system.restrict) await ctx.group().kick([senderJid]);
                delete warnings[senderId];
                return await db.set(`group.${groupId}.warnings`, warnings);
            }

            warnings[accountId] = newWarning;
            await db.set(`group.${groupId}.warnings`, warnings);

            return await ctx.reply(formatter.quote(`✅ Warning diberikan! Sekarang warning @${accountId} menjadi ${newWarning}/${maxwarnings}.`), {
                mentions: [accountJid]
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error);
        }
    }
};