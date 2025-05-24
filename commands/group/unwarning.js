const {
    monospace,
    quote
} = require("@itsreimau/ckptw-mod");

module.exports = {
    name: "unwarning",
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true,
        restrict: true
    },
    code: async (ctx) => {
        const accountJid = ctx.quoted.senderJid || ctx.msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || null;
        const accountId = tools.general.getID(accountJid);
        const senderJid = ctx.sender.jid;
        const senderId = tools.general.getID(senderJid);
        const groupId = tools.general.getID(ctx.id);

        if (!accountJid) return await ctx.reply({
            text: `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
                `${quote(tools.cmd.generateCommandExample(ctx.used, `@${senderId}`))}\n` +
                quote(tools.cmd.generateNotes(["Balas atau kutip pesan untuk menghapus warning dari pengguna."])),
            mentions: [senderJid]
        });

        if (accountId === config.bot.id) return await ctx.reply(quote(`❎ Tidak bisa mengubah warning bot.`));

        if (await ctx.group().isAdmin(accountJid)) return await ctx.reply(quote("❎ Tidak bisa mengubah warning admin grup!"));

        try {
            const key = `group.${groupId}.warnings`;
            const warnings = await db.get(key) || {};
            const current = warnings[accountId] || 0;

            if (current <= 0) return await ctx.reply(quote("✅ Pengguna ini tidak memiliki warning."));

            const newWarning = current - 1;
            if (newWarning <= 0) {
                delete warnings[accountId];
            } else {
                warnings[accountId] = newWarning;
            }

            await db.set(key, warnings);

            return await ctx.reply(quote(`✅ Warning dikurangi! Sekarang warning @${accountId} menjadi ${newWarning}/5.`), {
                mentions: [accountJid]
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};