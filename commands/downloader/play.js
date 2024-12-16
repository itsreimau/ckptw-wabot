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
        coin: [10, "text", 1]
    },
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "hikaru utada - one last kiss -i 8 -s spotify"))}\n` +
            quote(tools.msg.generatesFlagInformation({
                "-i <number>": "Pilihan pada data indeks.",
                "-s <text>": "Sumber untuk memutar lagu (tersedia: soundcloud, spotify, youtube | default: youtube)."
            }))
        );

        try {
            const flag = tools.general.parseFlag(input, {
                "-i": {
                    type: "value",
                    key: "index",
                    validator: (val) => !isNaN(val) && parseInt(val) > 0,
                    parser: (val) => parseInt(val) - 1
                },
                "-s": {
                    type: "value",
                    key: "source",
                    validator: (val) => true,
                    parser: (val) => val.toLowerCase()
                }
            });

            const searchIndex = flag.index || 0;
            const query = flag.input;
            let source = flag.source || "youtube";

            if (!["soundcloud", "spotify", "youtube"].includes(source)) {
                source = "youtube";
            }

            if (source === "soundcloud") {
                const searchApiUrl = tools.api.createUrl("siputzx", "/api/s/soundcloud", {
                    query
                });
                const searchData = (await axios.get(searchApiUrl)).data.data;
                const data = searchData[searchIndex];

                await ctx.reply(
                    `${quote(`Judul: ${data.permalink}`)}\n` +
                    `${quote(`URL: ${data.link}`)}\n` +
                    "\n" +
                    config.msg.footer
                );

                const downloadApiUrl = tools.api.createUrl("siputzx", "/api/d/soundcloud", {
                    url: data.link
                }, null, ["url"]);
                const downloadData = (await axios.get(downloadApiUrl)).data.data;

                return await ctx.reply({
                    audio: {
                        url: downloadData.url
                    },
                    mimetype: mime.lookup("mp3"),
                });
            }

            if (source === "spotify") {
                const searchApiUrl = tools.api.createUrl("https://spotifyapi.caliphdev.com", "/api/search/tracks", {
                    q: query
                });
                const searchData = (await axios.get(searchApiUrl)).data;
                const data = searchData[searchIndex];

                await ctx.reply(
                    `${quote(`Judul: ${data.title}`)}\n` +
                    `${quote(`Artis: ${data.artist}`)}\n` +
                    `${quote(`URL: ${data.url}`)}\n` +
                    "\n" +
                    config.msg.footer
                );

                const downloadApiUrl = tools.api.createUrl("https://spotifyapi.caliphdev.com", "/api/download/track", {
                    url: data.url
                }, null, ["url"]);

                return await ctx.reply({
                    audio: {
                        url: downloadApiUrl
                    },
                    mimetype: mime.lookup("mp3"),
                });
            }

            if (source === "youtube") {
                const searchApiUrl = tools.api.createUrl("agatz", "/api/ytsearch", {
                    message: query
                });
                const searchData = (await axios.get(searchApiUrl)).data.data;
                const data = searchData[searchIndex];

                await ctx.reply(
                    `${quote(`Judul: ${data.title}`)}\n` +
                    `${quote(`Artis: ${data.author.name}`)}\n` +
                    `${quote(`URL: ${data.url}`)}\n` +
                    "\n" +
                    config.msg.footer
                );

                const downloadApiUrl = tools.api.createUrl("siputzx", "/api/d/ytmp3", {
                    url: data.url
                }, null, ["url"]);
                const downloadData = (await axios.get(downloadApiUrl)).data.data.dl;

                return await ctx.reply({
                    audio: {
                        url: downloadData
                    },
                    mimetype: mime.lookup("mp3")
                });
            }
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};