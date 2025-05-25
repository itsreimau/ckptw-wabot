const {
    quote
} = require("@itsreimau/ckptw-mod");
const axios = require("axios");

module.exports = {
    name: "gemini",
    category: "ai-chat",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || ctx.quoted?.conversation || Object.values(ctx.quoted).map(q => q?.text || q?.caption).find(Boolean) || null;

        if (!input) return await ctx.reply(
            `${quote(tools.cmd.generateInstruction(["send"], [ "image","text"]))}\n` +
            `${quote(tools.cmd.generateCommandExample(ctx.used, "apa itu bot whatsapp?"))}\n` +
            quote(tools.cmd.generateNotes(["AI ini dapat melihat gambar dan menjawab pertanyaan tentang gambar tersebut.", "Balas atau quote pesan untuk menjadikan teks sebagai input target, jika teks memerlukan baris baru."]))
        );

        const messageType = ctx.getMessageType();
        const [checkMedia, checkQuotedMedia] = await Promise.all([
            tools.cmd.checkMedia(messageType, "image"),
            tools.cmd.checkQuotedMedia(ctx.quoted, "image")
        ]);

        try {
            if (checkMedia || checkQuotedMedia) {
                const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted.media.toBuffer();
                const uploadUrl = await tools.general.upload(buffer, "image");
                const apiUrl = tools.api.createUrl("bk9", "/ai/geminiimg", {
                    url: uploadUrl,
                    q: input
                });
                const result = (await axios.get(apiUrl)).data.BK9;

                return await ctx.reply(result);
            } else {
                const apiUrl = tools.api.createUrl("bk9", "/ai/gemini", {
                    q: input
                });
                const result = (await axios.get(apiUrl)).data.BK9;

                return await ctx.reply(result);
            }
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};