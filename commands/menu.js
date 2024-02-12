const {
    getMenu
} = require('../lib/menu.js');
const {
    sendStatus
} = require('../lib/simple.js');
const {
    bold
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'menu',
    aliases: ['help', '?'],
    category: 'main',
    code: async (ctx) => {
        sendStatus(ctx, 'processing');

        try {
            const text = await getMenu(ctx);

            await ctx.reply({
                video: {
                    url: 'https://giffiles.alphacoders.com/113/113028.gif'
                },
                caption: text,
                gifPlayback: true
            }).then(() => sendStatus(ctx, 'success'));
        } catch (error) {
            console.error("Error:", error);
            await ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`).then(() => sendStatus(ctx, 'failure'));
        }
    }
};