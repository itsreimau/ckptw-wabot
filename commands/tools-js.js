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
    name: 'js',
    aliases: ['javascript'],
    category: 'tools',
    code: async (ctx) => {
        const handlerObj = await handler(ctx, {
            banned: true
        });

        if (handlerObj.status) throw new Error(handlerObj.message);

        const input = ctx._args.join(' ');
        const script = input;

        if (!script) throw new Error(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} console.log('Hello World!');`)}`
        );

        const restricted = ['import', 'eval', 'Function', 'global'];
        for (const w of restricted) {
            if (script.includes(w)) {
                return ctx.reply(`${bold('[ ! ]')} Penggunaan ${w} tidak diperbolehkan dalam kode.`);
            }
        }

        try {
            exec(script, {
                timeout: 10000
            }, (error, stdout, stderr) => {
                if (error) throw error;
                if (stderr) throw new Error(stderr);

                ctx.reply(monospace(stdout));
            });
        } catch (error) {
            console.error('Error:', error);
            throw new Error(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};