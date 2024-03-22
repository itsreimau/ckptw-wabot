const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');
const vm = require('vm');

module.exports = {
    name: 'js',
    aliases: ['javascript'],
    category: 'tools',
    code: async (ctx) => {
        const input = ctx._args.join(' ');
        const script = input;

        if (!script) return ctx.reply(
            `${bold('[ ! ]')} Masukkan parameter!\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} console.log('Hello World!');`)}`
        );

        const restricted = ['import', 'eval', 'Function', 'global'];
        for (const w of restricted) {
            if (script.includes(w)) {
                return ctx.reply(`${bold('[ ! ]')} Penggunaan ${w} tidak diperbolehkan dalam kode.`);
            }
        }

        try {
            const output = await new Promise((resolve) => {
                const sandbox = {
                    output: '',
                    console: {
                        log: (...args) => {
                            sandbox.output += args.join(' ');
                        }
                    }
                };

                const timeoutId = setTimeout(() => {
                    resolve(`${bold('[ ! ]')} Kode mencapai batas waktu keluaran.`);
                    sandbox.output = '';
                    clearTimeout(timeoutId);
                }, 10000);

                try {
                    vm.runInNewContext(script, sandbox);
                    resolve(monospace(sandbox.output));
                } catch (error) {
                    resolve(
                        `${bold('[ ! ]')} Terjadi kesalahan: ${error.message}\n` +
                        `${monospace(error.stack || '')}`
                    );
                } finally {
                    clearTimeout(timeoutId);
                }
            });

            ctx.reply(output);
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    },
};