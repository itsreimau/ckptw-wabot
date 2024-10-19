const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "play",
    aliases: ["p"],
    category: "downloader",
    handler: {
        banned: true,
        cooldown: true,
        coin: [10, "text", 1]
    },
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, module.exports.handler);
        if (status) return await ctx.reply(message);

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(global.tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "hikaru utada - one last kiss -i 8 -s spotify"))}\n` +
            quote(global.tools.msg.generatesFlagInformation({
                "-i <number>": "Pilihan pada data indeks.",
                "-s <text>": "Sumber untuk memutar lagu (tersedia: spotify, default: youtube)."
            }))
        );

        try {
            const flag = global.tools.general.parseFlag(input, {
                "-i": {
                    type: "value",
                    key: "index",
                    validator: (val) => !isNaN(val) && parseInt(val) > 0,
                    parser: (val) => parseInt(val) - 1
                },
                "-s": {
                    type: "value",
                    key: "source",
                    validator: (val) => val === "spotify",
                    parser: (val) => val
                }
            });

            const searchIndex = flag.index || 0;
            const query = flag.input;

            if (flag.source === "spotify") {
                const searchApiUrl = global.tools.api.createUrl("https://spotifyapi.caliphdev.com", "/api/search/tracks", {
                    q: query
                });
                const searchData = (await axios.get(searchApiUrl)).data;
                const data = searchData[searchIndex];

                await ctx.reply(
                    `${quote(`Judul: ${data.title}`)}\n` +
                    `${quote(`Artis: ${data.artist}`)}\n` +
                    `${quote(`URL: ${data.url}`)}\n` +
                    "\n" +
                    global.config.msg.footer
                );

                const downloadApiUrl = global.tools.api.createUrl("https://spotifyapi.caliphdev.com", "/api/download/track", {
                    url: data.url
                });

                return await ctx.reply({
                    audio: {
                        url: downloadApiUrl
                    },
                    mimetype: mime.lookup("mp3"),
                    ptt: false
                });
            }

            const searchApiUrl = global.tools.api.createUrl("itzpire", "/search/youtube", {
                query: query
            });
            const searchData = (await axios.get(searchApiUrl)).data.data;
            const data = searchData[searchIndex];

            await ctx.reply(
                `${quote(`Judul: ${data.title}`)}\n` +
                `${quote(`Artis: ${data.author.name}`)}\n` +
                `${quote(`URL: ${data.url}`)}\n` +
                "\n" +
                global.config.msg.footer
            );

            const downloadApiUrl = global.tools.api.createUrl("widipe", "/download/ytdl", {
                url: data.url
            });
            const downloadData = (await axios.get(downloadApiUrl)).data;

            return await ctx.reply({
                audio: {
                    url: downloadData.result.mp3
                },
                mimetype: mime.lookup("mp3"),
                ptt: false
            });
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            if (error.status !== 200) return await ctx.reply(global.config.msg.notFound);
            return await ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};