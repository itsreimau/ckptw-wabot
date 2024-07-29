const {
    api
} = require("../tools/exports.js");
const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "profile",
    category: "info",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        try {
            const senderPushName = ctx._sender.pushName;
            const senderJid = ctx._sender.jid;
            const senderNumber = ctx._sender.jid.split("@")[0];
            const [coin, premium] = await Promise.all([
                global.db.get(`user.${senderNumber}.coin`) || "-",
                global.db.get(`user.${senderNumber}.isPremium`) ? "Ya" : "Tidak"
            ]);

            let profileUrl;
            try {
                profileUrl = await ctx._client.profilePictureUrl(senderJid, "image");
            } catch {
                profileUrl = "https://i.ibb.co/3Fh9V6p/avatar-contact.png";
            }

            return await ctx.reply({
                image: {
                    url: profileUrl
                },
                mimetype: mime.contentType("png"),
                caption: `❖ ${bold("Profile")}\n` +
                    "\n" +
                    `➲ Nama: ${senderPushName}\n` +
                    `➲ Premium: ${premium}\n` +
                    `➲ Koin: ${coin}\n` +
                    "\n" +
                    global.msg.footer
            });
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};