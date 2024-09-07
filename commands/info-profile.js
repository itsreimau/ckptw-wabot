const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const fs = require('fs').promises;
const mime = require("mime-types");
const path = require('path');

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

        let lang;
        try {
            const list = await fs.readFile(path.join(__dirname, '../assets/lang.json'), 'utf8');
            lang = JSON.parse(list);
        } catch (error) {
            console.error("Error reading lang.json:", error);
            return ctx.reply(quote(`⚠ ${await global.tools.msg.translate("Terjadi kesalahan", userLanguage)}: ${error.message}`));
        }

        try {
            const senderNumber = ctx.sender.jid.replace(/@.*|:.*/g, "");
            const [userCoin, userPremium] = await Promise.all([
                global.db.get(`user.${senderNumber}.userCoin`) || "-",
                global.db.get(`user.${senderNumber}.isuserPremium`) ? "Ya" : "Tidak",
            ]);

            let profileUrl;
            try {
                profileUrl = await ctx._client.profilePictureUrl(ctx.sender.jid, "image");
            } catch (err) {
                profileUrl = "https://i.ibb.co/3Fh9V6p/avatar-contact.png";
            }

            return await ctx.reply({
                image: {
                    url: profileUrl
                },
                mimetype: mime.contentType("png"),
                caption: `${quote(`${await global.tools.msg.translate("Nama", userLanguage)}: ${ctx.sender.pushName}`)}\n` +
                    `${quote(`Premium: ${await global.tools.msg.translate(userPremium)}`)}\n` +
                    `${quote(`${await global.tools.msg.translate("Koin", userLanguage)}: ${userCoin}`)}\n` +
                    `${quote(`${await global.tools.msg.translate("Bahasa", userLanguage)}: ${lang[userLanguage] || userLanguage}`)}\n` +
                    "\n" +
                    global.msg.footer,
            });
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(quote(`⚠ ${await global.tools.msg.translate("Terjadi kesalahan", userLanguage)}: ${error.message}`));
        }
    }
};