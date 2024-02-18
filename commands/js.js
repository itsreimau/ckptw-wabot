const {
    createAPIUrl
} = require('../lib/api.js');
const {
    bold,
    strikethrough
} = require('@mengkodingan/ckptw');
const {
    spawn
} = require('child_process');
const fs = require('fs').promises;

module.exports = {
    name: 'js',
    aliases: ['javascript'],
    category: 'tools',
    code: async (ctx) => {
        const input = ctx._args.join(' ');
        const script = input;

        if (!script) {
            return ctx.reply(`${bold('[ ! ]')} Masukkan kode!`);
        }

        const restricted = ['import', 'eval', 'Function', 'global'];
        for (const w of restricted) {
            if (script.includes(w)) {
                return ctx.reply(`${bold('[ ! ]')} Penggunaan ${w} tidak diperbolehkan dalam kode.`);
            }
        }

        try {
            await fs.mkdir('./data/js-runner', {
                recursive: true
            });

            const fname = Date.now().toString(36) + Math.floor(Math.random() * 99999);
            await fs.writeFile(`./data/js-runner/${fname}.js`, script);

            const output = await new Promise((resolve) => {
                const child = spawn('node', [`${fname}.js`], {
                    cwd: './data/js-runner/',
                    env: {
                        PATH: process.env.PATH
                    },
                });

                let outputData = '';
                let errorData = '';

                child.stdout.on('data', chunk => {
                    outputData += chunk;
                    if (outputData.length >= 1024 * 1024) {
                        resolve(`${bold('[ ! ]')} Kode mencapai batas penggunaan memori.`);
                        child.kill();
                    }
                });

                child.stderr.on('data', chunk => {
                    errorData += chunk;
                });

                child.on('exit', (code, signal) => {
                    if (code !== 0) return resolve(
                        `${bold('[ ! ]')} Terjadi kesalahan: ${signal || ''}\n` +
                        `${strikethrough(errorData)}`
                    );
                });

                child.on('error', error => {
                    return resolve(`${bold('[ ! ]')} Terjadi kesalahan: ${error}`);
                });

                child.on('close', () => {
                    return resolve(strikethrough(outputData));
                });

                setTimeout(() => {
                    resolve(`${bold('[ ! ]')} Kode mencapai batas waktu keluaran.`);
                    child.kill();
                }, 10000);
            });

            ctx.reply(output);
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        } finally {
            try {
                await fs.unlink(`./data/js-runner/${fname}.js`);
            } catch (cleanupError) {
                console.error('Error during cleanup:', cleanupError.message);
            }
        }
    },
};