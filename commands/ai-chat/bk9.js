const {
    quote
} = require("@itsreimau/ckptw-mod");
const axios = require("axios");

module.exports = {
    name: "bk9",
    category: "ai-chat",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || ctx.quoted?.conversation || Object.values(ctx.quoted).map(q => q?.text || q?.caption).find(Boolean) || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], [ "image","text"]))}\n` +
            `${quote(tools.msg.generateCmdExample(ctx.used, "apa itu bot whatsapp?"))}\n` +
            quote(tools.msg.generateNotes(["AI ini dapat melihat gambar dan menjawab pertanyaan tentang gambar tersebut.", "Balas atau quote pesan untuk menjadikan teks sebagai input target, jika teks memerlukan baris baru."]))
        );

        const messageType = ctx.getMessageType();
        const [checkMedia, checkQuotedMedia] = await Promise.all([
            tools.cmd.checkMedia(messageType, "image"),
            tools.cmd.checkQuotedMedia(ctx.quoted, "image")
        ]);

        try {
            if (checkMedia || checkQuotedMedia) {
                const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted.media.toBuffer();
                const uploadUrl = await tools.cmd.upload(buffer, "image");
                const apiUrl = tools.api.createUrl("bk9", "/ai/vision", {
                    q: input,
                    image_url: uploadUrl,
                    model: "meta-llama/llama-4-maverick-17b-128e-instruct"
                });
                const result = (await axios.get(apiUrl)).data.BK9;

                return await ctx.reply(result);
            } else {
                const apiUrl = tools.api.createUrl("bk9", "/ai/bk93", {
                    BK9: `You are a WhatsApp bot named ${config.bot.name}, owned by ${config.owner.name}. Be friendly, informative, and engaging.`, // Dapat diubah sesuai keinginan
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