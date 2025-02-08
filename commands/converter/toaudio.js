const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const FormData = require("form-data");
const mime = require("mime-types");

module.exports = {
    name: "toaudio",
    aliases: ["toaud", "tomp3"],
    category: "converter",
    permissions: {},
    code: async (ctx) => {
        if (!await tools.general.checkQuotedMedia(ctx.quoted, ["video"])) return await ctx.reply(quote(tools.msg.generateInstruction(["reply"], ["video"])));

        try {
            const buffer = await ctx.quoted?.media.toBuffer()
            const result = buffer ? await video2audio(buffer) : null;

            if (!result) return await ctx.reply(config.msg.notFound);

            return await ctx.reply({
                audio: result.data.audio,
                mimetype: mime.lookup("mp3")
            });
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};

// Oleh ZTRdiamond (https://github.com/ZTRdiamond)
async function video2audio(buffer) {
    try {
        if (!buffer) throw new Error("Buffer is undefined.");
        if (!Buffer.isBuffer(buffer)) throw new Error("Invalid buffer input!");

        const form = new FormData();
        form.append("userfile", buffer, `${Date.now()}.mp4`);

        const uploadResponse = await axios.post("https://service5.coolutils.org/upload.php", form, {
            headers: form.getHeaders()
        });

        const uploadedFile = uploadResponse.data;
        if (!uploadedFile) throw new Error("Failed to upload media for conversion.");

        const payload = new URLSearchParams({
            Flag: "6",
            srcfile: uploadedFile,
            Ref: "/convert/MP4-to-MP3",
            fmt: "mp3",
            resize_constraint: "on"
        });

        const conversionResponse = await axios.post("https://service5.coolutils.org/movie_convert.php", payload.toString(), {
            headers: {
                Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "Content-Type": "application/x-www-form-urlencoded"
            },
            responseType: "arraybuffer"
        });

        if (!Buffer.isBuffer(conversionResponse.data)) throw new Error("Conversion response is not a valid buffer.");

        return {
            status: true,
            data: {
                audio: Buffer.from(conversionResponse.data, "binary")
            }
        };
    } catch (error) {
        consolefy.error(`Error: ${error}`);
        return null;
    }
}