const {
    bold
} = require('@mengkodingan/ckptw');
const {
    inspect
} = require('util');
const {
    exec
} = require('child_process');

module.exports = {
    name: '> ',
    type: 'hears',
    code: async (ctx) => {
        const input = ctx._used.args.slice(2);

        if (!ctx._sender.jid.includes(global.owner.number)) return;

        try {
            const result = await eval(input);
            await ctx.reply(inspect(result));
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};