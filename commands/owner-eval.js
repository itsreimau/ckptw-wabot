const {
    bold
} = require('@mengkodingan/ckptw');
const {
    exec
} = require('child_process');

module.exports = {
    name: '$',
    type: 'hears',
    code: async (ctx) => {
        const input = ctx._used.args.slice(2);

        if (!ctx._sender.jid.includes(global.owner.number)) return;

        try {
            const output = await new Promise((resolve, reject) => {
                exec(input, (error, stdout, stderr) => {
                    if (error) {
                        reject(new Error(`Error: ${error.message}`));
                    } else if (stderr) {
                        reject(new Error(stderr));
                    } else {
                        resolve(stdout);
                    }
                });
            });

            await ctx.reply(output);
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};