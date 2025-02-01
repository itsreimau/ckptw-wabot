const {
    MessageType,
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "readviewonce",
    aliases: ["rvo"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        if (!await tools.general.checkQuotedMedia(ctx.quoted, ["viewOnce"])) return await ctx.reply(quote(tools.msg.generateInstruction(["reply"], ["viewOnce"])));

        try {
            const quoted = ctx.quoted?.viewOnceMessageV2?.message;
            const messageType = Object.keys(quoted)[0];
            const media = await ctx.downloadContentFromMessage(quoted[messageType], messageType.slice(0, -7));

            let buffer = Buffer.from([]);
            for await (const chunk of media) {
                buffer = Buffer.concat([buffer, chunk]);
            }

            if (messageType === MessageType.imageMessage) {
                await ctx.reply({
                    image: buffer
                });
            } else if (messageType === MessageType.videoMessage) {
                await ctx.reply({
                    video: buffer
                });
            }
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};