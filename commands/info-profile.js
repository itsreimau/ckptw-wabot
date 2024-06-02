const {
    blurredImageFrame
} = require("../tools/simple.js");
const {
    createAPIUrl
} = require("../tools/api.js");
const {
    isOwner
} = require("../tools/simple.js");
const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");
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
            let profile;
            try {
                profile = await ctx._client.profilePictureUrl(senderJid, "image");
            } catch {
                profile = "https://lh3.googleusercontent.com/proxy/esjjzRYoXlhgNYXqU8Gf_3lu6V-eONTnymkLzdwQ6F6z0MWAqIwIpqgq_lk4caRIZF_0Uqb5U8NWNrJcaeTuCjp7xZlpL48JDx-qzAXSTh00AVVqBoT7MJ0259pik9mnQ1LldFLfHZUGDGY=w1200-h630-p-k-no-nu";
            }
            const fetchCoin = await global.db.get(`user.${senderNumber}.coin`);
            const coin = fetchCoin || '-';

            return await ctx.sendMessage(
                ctx.id, {
                    text: `❖ ${bold("Profile")}\n` +
                        "\n" +
                        `➲ Nama: ${senderPushName}\n` +
                        `➲ JID: @${senderNumber}\n` +
                        `➲ Premium: ${await isOwner(ctx, senderNumber) === 1 || await global.db.get(`user.${senderNumber}.isPremium`) ? "Ya" : "Tidak"}\n` +
                        `➲ Koin: ${await isOwner(ctx, senderNumber) === 1 || await global.db.get(`user.${senderNumber}.isPremium`) ? "Tidak terbatas" : coin}\n` +
                        "\n" +
                        global.msg.footer,
                    contextInfo: {
                        mentions: [senderJid],
                        externalAdReply: {
                            title: "P R O F I L E",
                            body: null,
                            thumbnailUrl: await blurredImageFrame(profile) || profile,
                            sourceUrl: global.bot.groupChat,
                            mediaType: 1,
                            renderLargerThumbnail: true,
                        },
                    },
                }, {
                    quoted: ctx._msg,
                }
            );
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};