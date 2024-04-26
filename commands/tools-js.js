const {
    handler
} = require('../handler.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');
const {
    spawn
} = require('child_process');

module.exports = {
    name: 'js',
    aliases: ['javascript'],
    category: 'tools',
    code: async (ctx) => {
        const handlerObj = await handler(ctx, {
            banned: true
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const input = ctx._args.join(' ');
        const script = input;

        if (!script) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} console.log('Hello World!');`)}`
        );

        try {
            const restricted = ['import', 'eval', 'Function', 'global'];
            for (const w of restricted) {
                if (script.includes(w)) {
                    throw new Error(`Penggunaan ${w} tidak diperbolehkan dalam kode.`);
                }
            }

            const output = await new Promise((resolve) => {
                const childProcess = spawn('node', ['-e', script]);

                let responseData = '';

                childProcess.stdout.on('data', (data) => {
                    responseData += data.toString();
                });

                childProcess.stderr.on('data', (data) => {
                    throw new Error(data.toString());
                });

                childProcess.on('close', (code) => {
                    if (code !== 0) {
                        throw new Error(`Keluar dari proses dengan kode: ${code}`);
                    } else {
                        resolve(monospace(responseData));
                    }
                });

                setTimeout(() => {
                    childProcess.kill();
                    throw new Error('Kode mencapai batas waktu proses.');
                }, 10000);
            });

            ctx.reply(output);
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(error.message);
        }
    }
};