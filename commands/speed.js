const {
    performance
} = require('perf_hooks');
const {
    sendStatus
} = require('../lib/simple.js');

module.exports = {
    name: 'speed',
    category: 'info',
    code: async (ctx) => {
        sendStatus(ctx, 'processing');

        try {
            const pOld = performance.now();
            const res = await ctx.reply('Menguji kecepatan...');
            const speed = (performance.now() - pOld).toFixed(2);
            ctx.editMessage(res.key, `Merespon dalam ${speed} ms.`).then(() => sendStatus(ctx, 'success'));
        } catch (error) {
            console.error("Error:", error);
            await ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`).then(() => sendStatus(ctx, 'failure'));
        }
    }
};