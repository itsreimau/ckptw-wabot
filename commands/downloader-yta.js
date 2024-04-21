const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');
const {
    youtubedl,
    youtubedlv2
} = require('@bochilteam/scraper');

module.exports = {
    name: 'yta',
    aliases: ['ytaudio', 'ytmp3'],
    category: 'downloader',
    code: async (ctx) => {
        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} https://example.com/`)}`
        );

        try {
            const urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)\b/i;
            if (!urlRegex.test(input)) throw new Error(global.msg.urlInvalid);

            let ytdl;
            try {
                ytdl = await youtubedl(input);
            } catch (error) {
                ytdl = await youtubedlv2(input);
            }
            const qualityOptions = Object.keys(ytdl.audio);

            const res = await ctx.reply({
                image: {
                    url: ytdl.thumbnail
                },
                caption: `❖ ${bold('YT Audio')}\n` +
                    `\n` +
                    `➤ Judul: ${ytdl.title}\n` +
                    `➤ Pilih kualitas:\n` +
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
                    const downloadFunction = ytdl.audio[selectedQuality].download;
                    ctx.react(ctx.id, '🔄', res.key);
                    const url = await downloadFunction();
                    return await ctx.reply({
                        audio: {
                            url: url
                        },
                        mimetype: 'audio/mp4',
                        ptt: false
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