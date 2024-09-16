const {
    quote
} = require("@mengkodingan/ckptw");
const {
    S_WHATSAPP_NET
} = require("@whiskeysockets/baileys");

module.exports = {
    name: "setchargingspeed",
    aliases: ["setcs"]
    category: "owner",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            owner: true
        });
        if (status) return ctx.reply(message);

        const userId = ctx.args[0];
        const chargingSpeedAmount = parseInt(ctx.args[1], 10);

        const senderJid = ctx.sender.jid;
        const senderNumber = senderJid.replace(/@.*|:.*/g, "");
        const mentionedJids = ctx.msg?.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const user = Array.isArray(mentionedJids) && mentionedJids.length > 0 ? mentionedJids[0] : userId + S_WHATSAPP_NET;

        if (!ctx.args.length || !user || isNaN(chargingSpeedAmount)) return ctx.reply({
            text: `${quote(global.tools.msg.generateInstruction(["send"], ["text"]))}\n` +
                quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, `@${senderNumber} 4`)),
            mentions: [senderJid]
        });

        try {
            const [result] = await ctx._client.onWhatsApp(user);
            if (!result.exists) return ctx.reply(quote(`❎ Akun tidak ada di WhatsApp.`));

            await global.db.set(`user.${user.split("@")[0]}.chargingSpeed`, chargingSpeedAmount);

            ctx.sendMessage(user, {
                text: quote(`🎉 Anda telah diberi kecepatan pengisi daya sebesar ${chargingSpeedAmount} dari Owner!`)
            });
            return ctx.reply(quote(`✅ Berhasil menyetel kecepatan pengisian daya sebesar ${chargingSpeedAmount} kepada pengguna!`));
        } catch (error) {
            console.error("[ckptw-wabot] Kesalahan:", error);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};