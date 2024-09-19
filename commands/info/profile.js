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
            const [energy, premium, onCharger] = await Promise.all([
                global.db.get(`user.${senderNumber}.energy`) || "-",
                global.db.get(`user.${senderNumber}.isPremium`) ? "Ya" : "Tidak",
                global.db.get(`user.${senderNumber}.onCharger`) ? "Ya" : "Tidak",
            ]);

            let profilePictureUrl;
            try {
                profilePictureUrl = await ctx._client.profilePictureUrl(senderJid, "image");
            } catch (error) {
                profilePictureUrl = "https://i.ibb.co/3Fh9V6p/avatar-contact.png";
            }
            const card = global.tools.api.createUrl("aggelos_007", "/welcomecard", {
                username: senderName,
                xp: energy,
                maxxp: "100",
                level: "0",
                avatar: profilePictureUrl
            });

            return await ctx.reply({
                image: {
                    url: card || profilePictureUrl
                },
                mimetype: mime.contentType("png"),
                caption: `${quote(`Nama: ${ctx.sender.pushName || "-"}`)}\n` +
                    `${quote(`Premium: ${premium}`)}\n` +
                    `${quote(`Energi: ${energy}`)}\n` +
                    `${quote(`Pengisian energi: ${onCharger}`)}\n` +
                    "\n" +
                    global.config.msg.footer,
            });
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            return ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};