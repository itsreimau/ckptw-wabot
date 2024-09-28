const {
    quote
} = require("@mengkodingan/ckptw");
const mime = require("mime-types");

module.exports = {
    name: "profile",
    category: "info",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            cooldown: true
        });
        if (status) return ctx.reply(message);

        try {
            const senderName = ctx.sender.pushName;
            const senderJid = ctx.sender.jid;
            const senderNumber = senderJid.replace(/@.*|:.*/g, "");

            const [energy, isPremium, onCharger, estimatedTime, isOwner] = await Promise.all([
                global.db.get(`user.${senderNumber}.energy`),
                global.db.get(`user.${senderNumber}.isPremium`),
                global.db.get(`user.${senderNumber}.onCharger`),
                global.db.get(`user.${senderNumber}.estimatedTime`),
                global.tools.general.isOwner(ctx, senderNumber, true)
            ]);

            const isPremiumOrOwner = isOwner || isPremium;

            let profilePictureUrl;
            try {
                profilePictureUrl = await ctx._client.profilePictureUrl(senderJid, "image");
            } catch (error) {
                profilePictureUrl = global.config.bot.picture.profile;
            }

            const card = global.tools.api.createUrl("aggelos_007", "/rankcard", {
                username: senderName,
                xp: isPremiumOrOwner ? 100 : (energy || 0),
                maxxp: "100",
                level: "0",
                avatar: profilePictureUrl
            });

            let energyStatus = isPremiumOrOwner ? "Tak terbatas" : (energy || "-");
            let chargerStatus = onCharger ? "Ya" : "Tidak";
            let estimatedTimeText = estimatedTime ? global.tools.general.convertMsToDuration(estimatedTime) : "";

            return await ctx.reply({
                image: {
                    url: card || profilePictureUrl
                },
                mimetype: mime.contentType("png"),
                caption: `${quote(`Nama: ${senderName || "-"}`)}\n` +
                    `${quote(`Premium: ${isPremiumOrOwner ? "Ya" : "Tidak"}`)}\n` +
                    `${quote(`Energi: ${energyStatus}`)}\n` +
                    `${quote(`Pengisian energi: ${chargerStatus}`)}${estimatedTimeText ? ` (${estimatedTimeText})` : ""}\n` +
                    "\n" +
                    global.config.msg.footer
            });
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            return ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};