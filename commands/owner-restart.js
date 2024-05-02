const {
    handler
} = require('../handler.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');
const {
    exec
} = require('child_process');

module.exports = {
    name: 'restart',
    category: 'owner',
    code: async (ctx) => {
        const handlerObj = await handler(ctx, {
            owner: true
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        try {
            await ctx.reply(global.msg.wait);

            exec(`pm2 restart rei-ayanami`); // PM2
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};