const {
    quote
} = require("@itsreimau/ckptw-mod");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "toaudio",
    aliases: ["toaud", "tomp3"],
    category: "converter",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const messageType = ctx.getMessageType();
        const [checkMedia, checkQuotedMedia] = await Promise.all([
            tools.cmd.checkMedia(messageType, ["video"]),
            tools.cmd.checkQuotedMedia(ctx.quoted, ["video"])
        ]);

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(quote(tools.msg.generateInstruction(["send", "reply"], ["video"])));

        try {
            const buffer = await ctx.quoted.media.toBuffer()
            const uploadUrl = await tools.cmd.upload(buffer, "video");
            const apiUrl = tools.api.createUrl("http://api.hofeda4501.serv00.net", "/converter/toaudio", {
                url: uploadUrl
            });
            const result = Buffer.from((await axios.get(apiUrl)).data.result.audio, "base64");

            return await ctx.reply({
                audio: {
                    url: result
                },
                mimetype: mime.lookup("mp3")
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};