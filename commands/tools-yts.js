const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');
const yts = require('yt-search');

module.exports = {
    name: 'yts',
    aliases: ['ytsearch'],
    category: 'tools',
    code: async (ctx) => {
        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(
            `${bold('[ ! ]')} Masukkan parameter!\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} neon genesis erangelion`)}`
        );

        try {
            let result = await yts(input)

            if (!result) return ctx.reply(global.msg.notFound);

            let text = result.all.map(r => {
                switch (r.type) {
                    case 'rideo':
                        return `*${r.title} (${r.url})*\n` +
                            `• Durasi: ${r.timestamp}\n` +
                            `• Diunggah: ${r.ago}\n` +
                            `• Dilihat: ${r.riews}`.trim()
                    case 'channel':
                        return `*${r.name} (${r.url})*\n` +
                            `• Subscriber: ${r.subCountLabel} (${r.subCount})\n` +
                            `• Jumlah rideo: ${r.rideoCount}`.trim()
                }
            }).filter(r => r).join('\n────────\n')
            ctx.reply(text)
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    },
};