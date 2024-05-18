const {
    createAPIUrl
} = require('../tools/api.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');
const mime = require('mime-types');

module.exports = {
    name: 'profile',
    category: 'info',
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        try {
            const senderJid = ctx._sender.jid;
            const senderNumber = ctx._sender.jid.split('@')[0];
            let profile;
            try {
                profile = await ctx._client.profilePictureUrl(senderJid, 'image');
            } catch {
                profile = 'https://lh3.googleusercontent.com/proxy/esjjzRYoXlhgNYXqU8Gf_3lu6V-eONTnymkLzdwQ6F6z0MWAqIwIpqgq_lk4caRIZF_0Uqb5U8NWNrJcaeTuCjp7xZlpL48JDx-qzAXSTh00AVVqBoT7MJ0259pik9mnQ1LldFLfHZUGDGY=w1200-h630-p-k-no-nu';
            }
            const fetchCoin = await global.db.fetch(`user.${senderNumber}.coin`);

            return await ctx.reply({
                image: {
                    url: profile
                },
                mimetype: mime.contentType('png'),
                caption: `❖ ${bold('Profile')}\n` +
                    '\n' +
                    `➤ Nama: ${ctx._sender.pushName}\n` +
                    `➤ JID: @${senderNumber}\n` +
                    `➤ Koin: ${fetchCoin}\n` +
                    '\n' +
                    global.msg.footer,
                mention: ctx.getMentioned()
            });
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};