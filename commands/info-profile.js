const {
    monospace,
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
            banned: true
        });
        if (status) return ctx.reply(message);

        try {
            const senderNumber = ctx.sender.jid.split("@")[0];
            const [coin, isPremium] = await Promise.all([
                global.db.get(`user.${senderNumber}.coin`) || "-",
                global.db.get(`user.${senderNumber}.isPremium`) ? "Ya" : "Tidak",
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
                caption: `${quote(`Nama: ${ctx.sender.pushName}`)}` +
                    (global.system.usePremium ?
                        "\n" +
                        `${quote(`Premium: ${isPremium}`)}\n` :
                        "\n") +
                    (global.system.useCoin ?
                        "\n" +
                        `${quote(`Koin: ${coin}`)}` :
                        "\n") +
                    "\n" +
                    global.msg.footer

            });
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    },
};