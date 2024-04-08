const {
    isNotAdminOf
} = require('../handler.js');
const {
    bold
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'link',
    aliases: ['gclink', 'grouplink'],
    category: 'group',
    code: async (ctx) => {
        if (isNotAdminOf(ctx)) return ctx.reply(global.msg.botAdmin);

        if (!ctx.isGroup()) return ctx.reply(global.msg.group);

        try {
            const link = await ctx._client.groupInviteCode(ctx.id);

            return ctx.reply(`https://chat.whatsapp.com/${link}`);
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};