const {
    isOwner
} = require('../lib/simple.js');
const {
    bold
} = require('@mengkodingan/ckptw');

module.exports = {
    name: '$',
    type: 'hears',
    code: async (ctx) => {
        if (isOwner(ctx) === 0) return;

        const command = m.content.slice(2);

        try {
            const output = await new Promise((resolve, reject) => {
                exec(command, (error, stdout, stderr) => {
                    if (error) {
                        reject(new Error(error.message));
                    } else if (stderr) {
                        reject(new Error(stderr));
                    } else {
                        resolve(stdout);
                    }
                });
            });

            return await ctx.reply(output);
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};