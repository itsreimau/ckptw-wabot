const {
    isOwner
} = require('../lib/simple.js');
const {
    bold
} = require('@mengkodingan/ckptw');

module.exports = {
    name: '>>',
    type: 'hears',
    code: async (ctx) => {
        if (isOwner(ctx) === 0) return;

        const code = ctx_msg.content.slice(3);

        try {
            const result = await eval(`(async () => { ${code} })()`);

            return await ctx.reply(inspect(result));
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};