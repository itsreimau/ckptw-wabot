const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "addprem",
    aliases: ["addpremuser"],
    category: "owner",
    handler: {
        owner: true
    },
    code: async (ctx) => {
        const status = await handler(ctx, module.exports.handler);
        if (status) return;

        const userId = ctx.args[0];

        const senderJid = ctx.sender.jid;
        const senderNumber = senderJid.split(/[:@]/)[0];
        const mentionedJids = ctx.msg?.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const user = Array.isArray(mentionedJids) && mentionedJids.length > 0 ? mentionedJids[0] : (input ? `${userId}@s.whatsapp.net` : null);

        if (!ctx.args.length && !user) return await ctx.reply({
            text: `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
                quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, `@${senderNumber}`)),
            mentions: [senderJid]
        });

        try {
            const [result] = await ctx._client.onWhatsApp(user);
            if (!result.exists) return await ctx.reply(quote(`❎ Akun tidak ada di WhatsApp.`));

            await db.set(`user.${user.split(/[:@]/)[0]}.isPremium`, true);

            await ctx.sendMessage(user, {
                text: quote(`🎉 Anda telah ditambahkan sebagai pengguna Premium oleh Owner!`)
            });
            return await ctx.reply(quote(`✅ Berhasil ditambahkan sebagai pengguna Premium!`));
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};