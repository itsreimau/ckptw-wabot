const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "toaudio",
    aliases: ["toaud", "tomp3"],
    category: "converter",
    permissions: {},
    code: async (ctx) => {
        const msgType = ctx.getMessageType();
        const [checkMedia, checkQuotedMedia] = await Promise.all([
            tools.cmd.checkMedia(msgType, ["video"]),
            tools.cmd.checkQuotedMedia(ctx.quoted, ["video"])
        ]);

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(quote(tools.cmd.generateInstruction(["send", "reply"], ["video"])));

        try {
            const buffer = await ctx.quoted.media.toBuffer()
            const uploadUrl = await tools.general.upload(buffer, "video");
            const apiUrl = tools.api.createUrl("http://vid2aud.hofeda4501.serv00.net", "/api/convert", {
                url: uploadUrl
            });
            const result = (await axios.get(apiUrl)).data.result;

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