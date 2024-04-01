const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');
const {
    youtubedl,
    youtubedlv2
} = require('@bochilteam/scraper');

module.exports = {
    name: 'ytv',
    aliases: ['ytmp4', 'ytvideo'],
    category: 'downloader',
    code: async (ctx) => {
        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} https://example.com/`)}`
        );

        try {
            let ytdl;
            try {
                ytdl = await youtubedl(input);
            } catch (error) {
                ytdl = await youtubedlv2(input);
            }
            const qualityOptions = Object.keys(ytdl.video);

            const res = await ctx.reply({
                image: {
                    url: ytdl.thumbnail
                },
                caption: `❖ ${bold('YT Video')}\n` +
                    `\n` +
                    `• Judul: ${ytdl.title}\n` +
                    `• Pilih kualitas:\n` +
                    `${qualityOptions.map((quality, index) => `${index + 1}. ${quality}`).join('\n')}\n` +
                    `\n` +
                    global.msg.footer
            });

            const col = ctx.MessageCollector({
                time: 600000 // 10 menit
            });

            col.on('collect', async (m) => {
                const selectedNumber = parseInt(m.content.trim());
                const selectedQualityIndex = selectedNumber - 1;

                if (!isNaN(selectedNumber) && selectedQualityIndex >= 0 && selectedQualityIndex < qualityOptions.length) {
                    const selectedQuality = qualityOptions[selectedQualityIndex];
                    const downloadFunction = ytdl.video[selectedQuality].download;
                    ctx.editMessage(res.key, `Mengunduh video... Jika video tidak terkirim, ukurannya mungkin terlalu besar.`)
                    const url = await downloadFunction();
                    ctx.reply({
                        video: {
                            url: url
                        },
                        caption: `❖ ${bold('YTV')}\n` +
                            `\n` +
                            `• Kualitas: ${selectedQuality}\n` +
                            `\n` +
                            global.msg.footer,
                        gifPlayback: false
                    });
                    col.stop();
                }
            });

            col.on('end', (collector, r) => {
                // Tidak ada respon ketika kolektor berakhir
            });
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};