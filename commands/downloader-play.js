const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');
const {
    youtubedl,
    youtubedlv2
} = require('@bochilteam/scraper');
const yts = require('yt-search');

module.exports = {
    name: 'play',
    category: 'downloader',
    code: async (ctx) => {
        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} hikaru utada - one last kiss`)}`
        );

        try {
            const search = await yts(input);
            const yt = search.videos[0];

            await ctx.reply({
                image: {
                    url: yt.image
                },
                caption: `${bold('Play')}\n` +
                    `• Judul: ${yt.title}\n` +
                    `• Deskripsi: ${yt.description}\n` +
                    `• Durasi: ${yt.timestamp}\n` +
                    `• Diunggah: ${yt.ago}\n` +
                    `• Ditonton: ${yt.views.toLocaleString()}\n` +
                    `\n` +
                    global.msg.footer,
            });

            let ytdl;
            try {
                ytdl = await youtubedl(yt.url);
            } catch (error) {
                ytdl = await youtubedlv2(yt.url);
            }

            const audio = Object.values(ytdl.audio)[0];

            const audiodl = await audio.download();

            await ctx.reply({
                audio: {
                    url: audiodl
                },
                mimetype: 'audio/mp4',
                ptt: false
            });
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    },
};