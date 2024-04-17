const {
    handler
} = require('../handler.js');
const {
    bold
} = require("@mengkodingan/ckptw");

module.exports = {
    name: 'tagall',
    category: 'group',
    code: async (ctx) => {
        const handlerMsg = handler(ctx, {
            admin: true,
            botAdmin: true,
            group: true,
            owner: true
        });

        if (handlerMsg) return ctx.reply(handlerMsg);

        const input = ctx._args.join(' ');

        try {
            const data = await ctx._client.groupMetadata(ctx.id);
            const len = data.participants.length;
            const mentions = [];
            for (let i = 0; i < len; i++) {
                const serialized = data.participants[i].id.split('@')[0];
                mentions.push({
                    tag: `@${serialized}`,
                    mention: `${serialized}@s.whatsapp.net`
                });
            }
            const mentionText = mentions.map((mention) => mention.tag).join(' ');

            return ctx.reply({
                text: `${input || 'Hai!'}\n` +
                    `----\n` +
                    `${mentionText}`,
                mentions: mentions.map((mention) => mention.mention),
            });
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};