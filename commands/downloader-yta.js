const {
    bold
} = require('@mengkodingan/ckptw');
const {
    youtubedl,
    youtubedlv2
} = require('@bochilteam/scraper');

module.exports = {
    name: 'yta',
    aliases: ['ytmp3', 'ytaudio'],
    category: 'downloader',
    code: async (ctx) => {
        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(`${bold('[ ! ]')} Masukkan teks URL!`);

        try {
            let ytdl;
            try {
                ytdl = await youtubedl(input);
            } catch (error) {
                ytdl = await youtubedlv2(input);
            }
            const qualityOptions = Object.keys(ytdl.audio);

            await ctx.reply({
                image: {
                    url: ytdl.thumbnail
                },
                caption: `• Judul: ${ytdl.title}\n` +
                    `• Pilih kualitas:\n` +
                    `${qualityOptions.map((quality, index) => `${index + 1}. ${quality}`).join('\n')}`
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
                    const url = await downloadFunction();
                    ctx.reply({
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