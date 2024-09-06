const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const mime = require("mime-types");

module.exports = {
    name: "profile",
    category: "info",
    code: async (ctx) => {
        const [userLanguage] = await Promise.all([
            global.db.get(`user.${ctx.sender.jid.replace(/@.*|:.*/g, "")}.language`)
        ]);

        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true
        });
        if (status) return ctx.reply(message);

        try {
            const senderNumber = ctx.sender.jid.replace(/@.*|:.*/g, "");
            const [userCoin, userPremium] = await Promise.all([
                global.db.get(`user.${senderNumber}.userCoin`) || "-",
                global.db.get(`user.${senderNumber}.isuserPremium`) ? "Ya" : "Tidak",
            ]);

            let profileUrl = await ctx._client.profilePictureUrl(ctx.sender.jid, "image");
            if (!profileUrl) {
                profileUrl = "https://i.ibb.co/3Fh9V6p/avatar-contact.png";
            }

            return await ctx.reply({
                image: {
                    url: profileUrl,
                },
                mimetype: mime.contentType("png"),
                caption: `${quote(`Nama: ${ctx.sender.pushName}`)}\n` +
                    `${quote(`Premium: ${userPremium}`)}\n` +
                    `${quote(`Koin: ${userCoin}`)}\n` +
                    "\n" +
                    global.msg.footer,
            });
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(quote(`⚠ ${await global.tools.msg.translate("Terjadi kesalahan", userLanguage)}: ${error.message}`));
        }
    }
};