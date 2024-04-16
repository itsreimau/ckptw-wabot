const {
    handler
} = require('../handler.js');
const {
    bold
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'link',
    aliases: ['gclink', 'grouplink'],
    category: 'group',
    code: async (ctx) => {
        handler(ctx, {
            botAdmin: true,
            group: true,
            owner: true
        });

        try {
            const link = await ctx._client.groupInviteCode(ctx.id);

            return ctx.reply(`https://chat.whatsapp.com/${link}`);
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};