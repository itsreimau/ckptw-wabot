const {
    getMenu
} = require('../lib/menu.js');
const {
    bold
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'menu',
    aliases: ['help', '?'],
    category: 'main',
    code: async (ctx) => {
        try {
            const text = await getMenu(ctx);

            await ctx.reply({
                video: {
                    url: 'https://giffiles.alphacoders.com/113/113028.gif'
                },
                caption: text,
                gifPlayback: true
            });
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};