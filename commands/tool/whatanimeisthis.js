const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "whatanimeisthis",
    aliases: ["wait", "whatanime"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const messageType = ctx.getMessageType();
        const [checkMedia, checkQuotedMedia] = await Promise.all([
            tools.cmd.checkMedia(messageType, "image"),
            tools.cmd.checkQuotedMedia(ctx.quoted, "image")
        ]);

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(formatter.quote(tools.msg.generateInstruction(["send", "reply"], "image")));

        try {
            const buffer = await ctx.msg.media?.toBuffer() || await ctx.quoted?.media?.toBuffer();
            const uploadUrl = await tools.cmd.upload(buffer, "image");
            const apiUrl = tools.api.createUrl("https://api.trace.moe", "/search", {
                url: uploadUrl
            });
            const result = (await axios.get(apiUrl)).data.result[0];

            return await ctx.reply({
                video: {
                    url: result.video
                },
                mimetype: mime.lookup("mp4"),
                caption: `${formatter.quote(`Nama: ${result.filename}`)}\n` +
                    `${formatter.quote(`Episode: ${result.episode}`)}\n` +
                    `${formatter.quote(`Rentang Waktu: ${tools.msg.convertSecondToTimecode(result.from)}-${tools.msg.convertSecondToTimecode(result.to)}`)}\n` +
                    `${formatter.quote(`Kemiripan: ${result.similarity}`)}\n` +
                    "\n" +
                    config.msg.footer
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};