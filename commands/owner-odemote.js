const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "odemote",
    category: "owner",
    code: async (ctx) => {
        const [userLanguage] = await Promise.all([
            global.db.get(`user.${ctx.sender.jid.replace(/@.*|:.*/g, "")}.language`)
        ]);

        const {
            status,
            message
        } = await global.handler(ctx, {
            botAdmin: true,
            group: true,
            owner: true
        });
        if (status) return ctx.reply(message);

        const senderJid = ctx.sender.jid;
        const senderNumber = senderJid.replace(/@.*|:.*/g, "");
        const mentionedJids = ctx.msg?.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const account = Array.isArray(mentionedJids) && mentionedJids.length > 0 ? mentionedJids[0] : null;

        if (!account) return ctx.reply({
            text: `${quote(`📌 ${await global.tools.msg.translate(global.msg.argument, userLanguage)}`)}\n` +
                quote(`${await global.tools.msg.translate("Contoh", userLanguage)}: ${monospace(`${ctx._used.prefix + ctx._used.command} @${senderNumber}`)}`),
            mentions: [senderJid]
        });

        try {
            if ((await global.tools.general.isAdmin(ctx, {
                    id: account
                })) === 0) return ctx.reply(quote(`⚠ ${await global.tools.msg.translate("Anggota ini adalah anggota biasa.", userLanguage)}`));

            await ctx.group().demote([account]);

            return ctx.reply(quote(`✅ ${await global.tools.msg.translate("Berhasil diturunkan dari admin menjadi anggota biasa!", userLanguage)}`));
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(quote(`⚠ ${await global.tools.msg.translate("Terjadi kesalahan", userLanguage)}: ${error.message}`));
        }
    }
};