const {
    createAPIUrl
} = require("../tools/api.js");
const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const fg = require("api-dylux");
const mime = require("mime-types");

module.exports = {
    name: "ttdl",
    aliases: ["tiktokdl", "tiktokmp3", "tiktoknowm", "tt", "tta", "ttaudio", "ttmp3", "ttmusic", "ttmusik", "vt", "vta", "vtaudio", "vtdltiktok", "vtmp3", "vtmusic", "vtmusik", "vtnowm"],
    category: "downloader",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true,
            coin: 3
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const input = ctx._args.join(" ");
        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} https://example.com/`)}`
        );

        const urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)\b/i;
        if (!urlRegex.test(input)) ctx.reply(global.msg.urlInvalid);

        try {
            const mp3cmd = ["tiktokmp3", "tta", "ttaudio", "ttmp3", "ttmusic", "ttmusik", "vta", "vtaudio", "vtmp3", "vtmusic", "vtmusik"];

            const promises = [
                axios.get(createAPIUrl("nyxs", "/dl/tiktok", {
                    url: input
                })).then(response => ({
                    source: "nyxs",
                    data: response.data
                })),
                axios.get(createAPIUrl("ngodingaja", "/api/tiktok", {
                    url: input
                })).then(response => ({
                    source: "ngodingaja",
                    data: response.data
                })),
                fg.tiktok(input).then(data => ({
                    source: "fg",
                    data
                }))
            ];

            const results = await Promise.allSettled(promises);

            let result;
            for (const res of results) {
                if (res.status === "fulfilled" && res.value) {
                    switch (res.value.source) {
                        case "nyxs":
                            result = mp3cmd.includes(ctx._used.command) ? res.value.data.result?.musik : res.value.data.result?.video_hd;
                            break;
                        case "ngodingaja":
                            result = mp3cmd.includes(ctx._used.command) ? res.value.data.hasil?.musik : res.value.data.result?.video2 || res.value.data.result?.video1 || res.value.data.hasil?.tanpawm;
                            break;
                        case "fg":
                            result = mp3cmd.includes(ctx._used.command) ? res.value.data.play : res.value.data.hdplay;
                            break;
                    }
                    if (result) break;
                }
            }

            if (!result) return ctx.reply(global.msg.notFound);

            return await ctx.reply({
                video: {
                    url: result
                },
                mimetype: mime.contentType(mp3cmd.includes(ctx._used.command) ? "mp3" : "mp4"),
                caption: `❖ ${bold("TT Downloader")}\n` +
                    "\n" +
                    `➲ URL: ${input}\n` +
                    "\n" +
                    global.msg.footer,
                gifPlayback: false
            });
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};