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
            `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(tools.cmd.generateCommandExample(ctx.used, "komm susser tod -i 8 -s spotify"))}\n` +
            quote(tools.cmd.generatesFlagInformation({
                "-i <number>": "Pilihan pada data indeks",
                "-s <text>": "Sumber untuk memutar lagu (tersedia: applemusic, soundcloud, spotify, youtube | default: youtube)"
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

            if (!["applemusic", "soundcloud", "spotify", "youtube"].includes(source)) {
                source = "youtube";
            }

            if (source === "applemusic") {
                const searchApiUrl = tools.api.createUrl("fasturl", "/music/applemusic", {
                    query: input
                });
                const searchResult = (await axios.get(searchApiUrl)).data.result[searchIndex];

                await ctx.reply(
                    `${quote(`Judul: ${searchResult.title}`)}\n` +
                    `${quote(`Artis: ${searchResult.artist}`)}\n` +
                    `${quote(`URL: ${searchResult.link}`)}\n` +
                    "\n" +
                    config.msg.footer
                );

                const downloadApiUrl = tools.api.createUrl("fasturl", "/downup/applemusicdown", {
                    url: searchResult.link
                });
                const downloadResult = (await axios.get(downloadApiUrl)).data.result.downloadUrl;

                return await ctx.reply({
                    audio: {
                        url: downloadResult
                    },
                    mimetype: mime.lookup("mp3"),
                });
            }

            if (source === "soundcloud") {
                const searchApiUrl = tools.api.createUrl("agatz", "/api/soundcloud", {
                    message: query
                });
                const searchResult = (await axios.get(searchApiUrl)).data.data[searchIndex];

                await ctx.reply(
                    `${quote(`Judul: ${searchResult.judul}`)}\n` +
                    `${quote(`URL: ${searchResult.link}`)}\n` +
                    "\n" +
                    config.msg.footer
                );

                const downloadApiUrl = tools.api.createUrl("agatz", "/api/soundclouddl", {
                    url
                });
                const downloadResult = (await axios.get(downloadApiUrl)).data.download;

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
                    `${quote(`URL: ${searchResult.externalUrl}`)}\n` +
                    "\n" +
                    config.msg.footer
                );

                const downloadApiUrl = tools.api.createUrl("fasturl", "/downup/spotifydown", {
                    url: searchResult.externalUrl
                });
                const downloadResult = (await axios.get(downloadApiUrl)).data.result.metadata.link;

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

                const downloadApiUrl = tools.api.createUrl("fasturl", "/downup/ytmp3", {
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