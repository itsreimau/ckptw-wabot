const {
    quote
} = require("@mengkodingan/ckptw");
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
            `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(tools.cmd.generateCommandExample(ctx.used, "komm susser tod -i 8 -s spotify"))}\n` +
            quote(tools.cmd.generatesFlagInformation({
                "-i <number>": "Pilihan pada data indeks",
                "-s <text>": "Sumber untuk memutar lagu (tersedia: soundcloud, spotify, youtube | default: youtube)"
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

            if (!["soundcloud", "spotify", "youtube"].includes(source)) {
                source = "youtube";
            }

            if (source === "soundcloud") {
                const searchApiUrl = tools.api.createUrl("siputzx", "/api/s/soundcloud", {
                    query
                });
                const searchResult = (await axios.get(searchApiUrl)).data.data[searchIndex];

                await ctx.reply(
                    `${quote(`Judul: ${searchResult.permalink}`)}\n` +
                    `${quote(`URL: ${searchResult.link}`)}\n` +
                    "\n" +
                    config.msg.footer
                );

                const downloadApiUrl = tools.api.createUrl("siputzx", "/api/d/soundcloud", {
                    url: searchResult.link
                });
                const downloadResult = (await axios.get(downloadApiUrl)).data.data.url;

                return await ctx.reply({
                    audio: {
                        url: downloadResult
                    },
                    mimetype: mime.lookup("mp3"),
                });
            }

            if (source === "spotify") {
                const searchApiUrl = tools.api.createUrl("agatz", "/api/spotify", {
                    message: query
                });
                const searchResult = (await axios.get(searchApiUrl)).data.data[searchIndex];

                await ctx.reply(
                    `${quote(`Judul: ${searchResult.trackName}`)}\n` +
                    `${quote(`Artis: ${searchResult.artistName}`)}\n` +
                    `${quote(`Album: ${searchResult.albumName}`)}\n` +
                    `${quote(`URL: ${searchResult.externalUrl}`)}\n` +
                    "\n" +
                    config.msg.footer
                );

                const downloadApiUrl = tools.api.createUrl("agatz", "/api/spotifydl", {
                    url: searchResult.externalUrl
                });
                const downloadResult = (JSON.parse((await axios.get(downloadApiUrl)).data.data)).url_audio_v1;

                return await ctx.reply({
                    audio: {
                        url: downloadResult
                    },
                    mimetype: mime.lookup("mp3"),
                });
            }

            if (source === "youtube") {
                const searchApiUrl = tools.api.createUrl("agatz", "/api/ytsearch", {
                    message: query
                });
                const searchResult = (await axios.get(searchApiUrl)).data.data[searchIndex];

                await ctx.reply(
                    `${quote(`Judul: ${searchResult.title}`)}\n` +
                    `${quote(`Artis: ${searchResult.author.name}`)}\n` +
                    `${quote(`URL: ${searchResult.url}`)}\n` +
                    "\n" +
                    config.msg.footer
                );

                const downloadApiUrl = tools.api.createUrl("fast", "/downup/ytmp3", {
                    url: searchResult.url
                });
                const downloadResult = (await axios.get(downloadApiUrl)).data.result.media;

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