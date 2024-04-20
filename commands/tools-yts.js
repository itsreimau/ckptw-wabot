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
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} neon genesis evangelion`)}`
        );

        try {
            const result = await yts(input)

            if (!result) return ctx.reply(global.msg.notFound);

            const resultText = result.all.map(r => {
                switch (r.type) {
                    case 'video':
                        const views = String(r.views).padStart(10, ' ')
                        return `${bold(`${r.title} (${r.url})`)}\n` +
                            `➤ Durasi: ${r.timestamp}\n` +
                            `➤ Diunggah: ${r.ago}\n` +
                            `➤ Dilihat: ${views}`
                    case 'channel':
                        return `${bold(`${r.name} (${r.url})`)}\n` +
                            `➤ Subscriber: ${r.subCountLabel} (${r.subCount})\n` +
                            `➤ Jumlah rideo: ${r.rideoCount}`
                }
            }).filter(r => r).join('\n-----\n')
            return ctx.reply(
                `${bold('❖ YT Search')}\n` +
                `\n` +
                `${resultText}\n` +
                `\n` +
                global.msg.footer
            )
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};