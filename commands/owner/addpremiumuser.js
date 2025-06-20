const {
    quote
} = require("@itsreimau/ckptw-mod");

module.exports = {
    name: "addpremiumuser",
    aliases: ["addpremuser", "addprem", "apu"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const mentionedJid = ctx.msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        const userJid = ctx.quoted.senderJid || mentionedJid || (ctx.args[0] ? `${ctx.args[0].replace(/[^\d]/g, "")}@s.whatsapp.net` : null);
        const daysAmount = ctx.args[mentionedJid ? 1 : 0] ? parseInt(ctx.args[mentionedJid ? 1 : 0], 10) : null;

        if (!userJid) return await ctx.reply({
            text: `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
                `${quote(tools.msg.generateCmdExample(ctx.used, `@${ctx.getId(ctx.sender.jid)} 30`))}\n` +
                quote(tools.msg.generateNotes(["Balas atau kutip pesan untuk menjadikan pengirim sebagai akun target."])),
            mentions: [ctx.sender.jid]
        });

        const isOnWhatsApp = await ctx.core.onWhatsApp(userJid);
        if (isOnWhatsApp.length === 0) return await ctx.reply(quote("❎ Akun tidak ada di WhatsApp!"));

        if (daysAmount && daysAmount <= 0) return await ctx.reply(quote("❎ Durasi Premium (dalam hari) harus diisi dan lebih dari 0!"));

        try {
            const userId = ctx.getId(userJid);

            await db.set(`user.${userId}.premium`, true);
            if (daysAmount && daysAmount > 0) {
                const expirationDate = Date.now() + (daysAmount * 24 * 60 * 60 * 1000);
                await db.set(`user.${userId}.premiumExpiration`, expirationDate);

                await ctx.sendMessage(userJid, {
                    text: quote(`🎉 Kamu telah ditambahkan sebagai pengguna Premium oleh Owner selama ${daysAmount} hari!`)
                });
                return await ctx.reply(quote(`✅ Berhasil menambahkan Premium selama ${daysAmount} hari kepada pengguna!`));
            } else {
                await db.delete(`user.${userId}.premiumExpiration`);

                await ctx.sendMessage(userJid, {
                    text: quote("🎉 Kamu telah ditambahkan sebagai pengguna Premium selamanya oleh Owner!")
                });
                return await ctx.reply(quote("✅ Berhasil menambahkan Premium selamanya kepada pengguna!"));
            }
        } catch (error) {
            return await tools.cmd.handleError(ctx, error);
        }
    }
};