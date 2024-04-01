const {
    createAPIUrl
} = require('../lib/api.js');
const {
    convertMsToDuration,
    formatSize,
    ucword
} = require('../lib/simple.js');
const {
    bold
} = require('@mengkodingan/ckptw');
const os = require('os');

module.exports = {
    name: 'server',
    category: 'info',
    code: async (ctx) => {
        const apiUrl = createAPIUrl('http://ip-api.com', '/json', {});

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            const startTime = global.system.startTime;

            return ctx.reply(
                `${bold('Server')}\n` +
                `• OS: ${os.type()} (${os.arch()} / ${os.release()})\n` +
                `• RAM: ${formatSize(process.memoryUsage().rss)} / ${formatSize(os.totalmem())}\n` +
                Object.entries(data).map(([key, value]) => `• ${ucword(key)}: ${value}\n`).join('') +
                `• Waktu aktif: ${convertMsToDuration(Date.now() - startTime) || 'kurang dari satu detik.'}\n` +
                `• Prosesor: ${os.cpus()[0].model}\n` +
                `\n` +
                global.msg.footer,

            );
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};