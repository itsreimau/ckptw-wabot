const {
    quote
} = require("@itsreimau/ckptw-mod");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "play",
    aliases: ["p"],
    category: "downloader",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(tools.msg.generateCmdExample(ctx.used, "one last kiss - hikaru utada -i 8 -s spotify"))}\n` +
            quote(tools.msg.generatesFlagInfo({
                "-i <number>": "Pilihan pada data indeks",
                "-s <text>": "Sumber untuk memutar lagu (tersedia: soundcloud, spotify, tidal, youtube | default: youtube)"
            }))
        );

        try {
            const flag = tools.cmd.parseFlag(input, {
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
            if (!["soundcloud", "spotify", "tidal", "youtube"].includes(source)) source = "youtube";

            if (source === "soundcloud") {
                const searchApiUrl = tools.api.createUrl("archive", "/api/search/soundcloud", {
                    query
                });
                const searchResult = (await axios.get(searchApiUrl)).data.result[searchIndex];

                await ctx.reply(
                    `${quote(`Judul: ${searchResult.title}`)}\n` +
                    `${quote(`URL: ${searchResult.url}`)}\n` +
                    "\n" +
                    config.msg.footer
                );

                const downloadApiUrl = tools.api.createUrl("falcon", "/download/soundcloud", {
                    url: searchResult.url
                });
                const downloadResult = (await axios.get(downloadApiUrl)).data.result;

                return await ctx.reply({
                    audio: {
                        url: downloadResult.audioBase || downloadResult.download
                    },
                    mimetype: mime.lookup("mp3")
                });
            }

            if (source === "spotify") {
                const searchApiUrl = tools.api.createUrl("archive", "/api/search/spotify", {
                    query
                });
                const searchResult = (await axios.get(searchApiUrl)).data.result[searchIndex];

                await ctx.reply(
                    `${quote(`Judul: ${searchResult.trackName}`)}\n` +
                    `${quote(`Artis: ${searchResult.artistName}`)}\n` +
                    `${quote(`URL: ${searchResult.externalUrl}`)}\n` +
                    "\n" +
                    config.msg.footer
                );

                const downloadApiUrl = tools.api.createUrl("archive", "/api/download/spotify", {
                    url: searchResult.externalUrl
                });
                const downloadResult = (await axios.get(downloadApiUrl)).data.result.data.download;

                return await ctx.reply({
                    audio: {
                        url: downloadResult
                    },
                    mimetype: mime.lookup("mp3")
                });
            }

            if (source === "youtube") {
                const searchApiUrl = tools.api.createUrl("archive", "/api/search/youtube", {
                    query
                });
                const searchResult = (await axios.get(searchApiUrl)).data.result[searchIndex];

                await ctx.reply(
                    `${quote(`Judul: ${searchResult.title}`)}\n` +
                    `${quote(`Artis: ${searchResult.channel}`)}\n` +
                    `${quote(`URL: ${searchResult.link}`)}\n` +
                    "\n" +
                    config.msg.footer
                );

                const downloadApiUrl = tools.api.createUrl("zell", "/download/youtube", {
                    url: searchResult.link,
                    format: "mp3"
                });
                const downloadResult = (await axios.get(downloadApiUrl)).data.download;

                return await ctx.reply({
                    audio: {
                        url: downloadResult
                    },
                    mimetype: mime.lookup("mp3")
                });
            }
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};