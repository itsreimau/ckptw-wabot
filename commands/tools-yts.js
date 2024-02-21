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
                        return `*${v.title} (${v.url})*` +
                            `• Durasi: ${v.timestamp}` +
                            `• Diunggah: ${v.ago}` +
                            `• Dilihat: ${v.views}`.trim()
                    case 'channel':
                        return `*${v.name} (${v.url})*` +
                            `• Subscriber: ${v.subCountLabel} (${v.subCount})` +
                            `• Jumlah video: ${v.videoCount}`.trim()
                }
            }).filter(v => v).join('\n────────\n')
            m.reply(text)
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    },
};