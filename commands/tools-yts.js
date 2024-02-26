const {
    bold
} = require('@mengkodingan/ckptw');
const yts = require('yt-search');

module.exports = {
    name: 'yts',
    aliases: ['ytsearch'],
    category: 'tools',
    code: async (ctx) => {
        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(`${bold('[ ! ]')} Masukkan teks pencarian!`);

        try {
            let results = await yts(input)
            let text = results.all.map(v => {
                switch (v.type) {
                    case 'video':
                        return `*${v.title} (${v.url})*\n` +
                            `• Durasi: ${v.timestamp}\n` +
                            `• Diunggah: ${v.ago}\n` +
                            `• Dilihat: ${v.views}`.trim()
                    case 'channel':
                        return `*${v.name} (${v.url})*\n` +
                            `• Subscriber: ${v.subCountLabel} (${v.subCount})\n` +
                            `• Jumlah video: ${v.videoCount}`.trim()
                }
            }).filter(v => v).join('\n────────\n')
            ctx.reply(text)
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    },
};