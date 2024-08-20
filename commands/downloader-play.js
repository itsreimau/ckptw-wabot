const {
    createAPIUrl
} = require("../tools/api.js");
const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const FormData = require("form-data");
const mime = require("mime-types");

module.exports = {
    name: "play",
    aliases: ["p"],
    category: "downloader",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            coin: 3
        });
        if (status) return ctx.reply(message);

        const input = ctx._args.join(" ") || null;

        if (!input) return ctx.reply(
            `${quote(global.msg.argument)}\n` +
            quote(`Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} hikaru utada - one last kiss`)}`)
        );

        try {
            const searchApiUrl = createAPIUrl("vkrdownloader", "/server", {
                vkr: input.replace(/\s+/g, "_")
            });
            const searchResponse = await axios.get(searchApiUrl);
            const searchData = searchResponse.data.data;

            const selectedData = searchData.a;

            await ctx.reply(
                `${quote(`Judul: ${selectedData.title}`)}\n` +
                `${quote(`URL: ${selectedData.id}`)}\n` +
                "\n" +
                global.msg.footer
            );

            const downloadApiUrl = createAPIUrl("https://vkrdownloader.vercel.app", "/server", {
                vkr: selectedData.id
            });
            const downloadResponse = await axios.get(downloadApiUrl);
            const {
                downloads
            } = downloadResponse.data.data;

            const videoUrl = downloads[0].url;
            const audioBuffer = await video2audio(videoUrl);

            return await ctx.reply({
                audio: audioBuffer.data.audio,
                mimetype: mime.contentType("mp3"),
                ptt: false
            });
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};

async function video2audio(input) {
    try {
        return await new Promise(async (resolve, reject) => {
            let videoBuffer;

            if (typeof input === "string") {
                videoBuffer = await axios.get(input, {
                        responseType: 'arraybuffer'
                    }).then(res => res.data)
                    .catch(error => reject(`Error during video download: ${error.message}`));

                if (!Buffer.isBuffer(videoBuffer)) return reject("Failed to download video as buffer!");
            } else if (Buffer.isBuffer(input)) {
                videoBuffer = input;
            } else {
                return reject("Invalid input: expected a URL (string) or a Buffer");
            }

            const form = new FormData();
            form.append("userfile", videoBuffer, `${Date.now()}.mp4`);

            axios.post("https://service5.coolutils.org/upload.php", form, {
                    headers: form.getHeaders(),
                })
                .then(async uploadRes => {
                    const uploadedFile = uploadRes.data;
                    if (!uploadedFile) return reject("Failed converting while uploading media!");

                    const payload = new URLSearchParams();
                    payload.append("Flag", 5);
                    payload.append("srcfile", uploadedFile);
                    payload.append("Ref", "/convert/MP4-to-MP3");
                    payload.append("fmt", "mp3");
                    payload.append("resize_constraint", "on");

                    axios.post("https://service5.coolutils.org/movie_convert.php", payload.toString(), {
                            headers: {
                                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                                "Content-Type": "application/x-www-form-urlencoded"
                            },
                            responseType: "arraybuffer"
                        })
                        .then(res => {
                            if (!Buffer.isBuffer(res.data)) return reject("Failed converting video to audio!");
                            resolve({
                                status: true,
                                data: {
                                    audio: Buffer.from(res.data, "binary")
                                }
                            });
                        })
                        .catch(error => reject(`Error during conversion: ${error.message}`));
                })
                .catch(error => reject(`Error during upload: ${error.message}`));
        });
    } catch (e) {
        return {
            status: false,
            message: e.message || e
        };
    }
}