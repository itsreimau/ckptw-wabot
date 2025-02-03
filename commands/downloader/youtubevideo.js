const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "youtubevideo",
    aliases: ["ytmp4", "ytv", "ytvideo"],
    category: "downloader",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const url = ctx.args[0] || null;

        if (!url) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx.used, "https://example.com/"))
        );

        const isUrl = await tools.general.isUrl(url);
        if (!isUrl) return await ctx.reply(config.msg.urlInvalid);

        try {
            const result = ytmp4.convert(url);

            return await ctx.reply({
                video: {
                    url: result
                },
                mimetype: mime.lookup("mp4")
            });
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};

// Oleh Agungny (https://github.com/Agungny08)
const ytmp4 = {
    backend: ".ymcdn.org",
    headers: {
        "accept": "*/*",
        "user-agent": "Postify/1.0.0",
        "origin": "https://ytmp3.mobi",
        "referer": "https://ytmp3.mobi/"
    },

    request: async (url, params = {}) => {
        const {
            data
        } = await axios.get(url, {
            headers: ytmp4.headers,
            params
        });
        return data;
    },

    convert: async (url, format = "mp3") => {
        try {
            const videoId = url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/)?.[1];
            if (!videoId) throw new Error("Invalid YouTube link!");

            const init = await ytmp4.request(`https://d${ytmp4.backend}/api/v1/init`, {
                p: "y",
                "23": "1llum1n471",
                _: Math.random()
            });
            if (init.error) throw new Error(init.error);

            const response = await ytmp4.request(init.convertURL, {
                v: videoId,
                f: format,
                _: Math.random()
            });
            if (response.error) throw new Error(response.error);

            let progress;
            do {
                progress = await ytmp4.request(response.progressURL);
                if (progress.error) throw new Error(progress.error);
                await new Promise(res => setTimeout(res, 1000));
            } while (progress.progress < 3);

            return response.downloadURL;
        } catch (error) {
            return `Error: ${error.message}`;
        }
    }
};