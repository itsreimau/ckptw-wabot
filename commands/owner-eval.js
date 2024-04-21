const {
    smpl
} = require('../lib/simple.js');
const {
    bold
} = require('@mengkodingan/ckptw');

module.exports = {
    name: />{1,2}/i,
    type: 'hears',
    code: async (ctx) => {
        if (smpl.isOwner(ctx) === 0) return;

        const code = m.content.slice(2);

        try {
            const result = await eval(m.content.startsWith('>> ') ? `(async () => { ${code} })()` : code);

            return await ctx.reply(inspect(result));
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};