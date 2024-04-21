const {
    isOwner
} = require('../lib/simple.js');
const {
    bold
} = require('@mengkodingan/ckptw');

module.exports = {
    name: '>',
    type: 'hears',
    code: async (ctx) => {
        if (isOwner(ctx) === 0) return;

        const code = ctx._msg.content.slice(2);

        try {
            const result = await eval(code);

            return await ctx.reply(inspect(result));
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};