const axios = require("axios");

module.exports = {
    name: "claude",
    aliases: ["claudeopus", "claudesonnet"],
    category: "ai-chat",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || ctx.quoted?.conversation || Object.values(ctx.quoted).map(q => q?.text || q?.caption).find(Boolean) || null;

        if (!input) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${formatter.quote(tools.msg.generateCmdExample(ctx.used, "apa itu bot whatsapp?"))}\n` +
            formatter.quote(tools.msg.generateNotes(["AI ini dapat melihat gambar dan menjawab pertanyaan tentang gambar tersebut.", "Balas atau quote pesan untuk menjadikan teks sebagai input target, jika teks memerlukan baris baru."]))
        );

        const messageType = ctx.getMessageType();
        const [checkMedia, checkQuotedMedia] = await Promise.all([
            tools.cmd.checkMedia(messageType, "image"),
            tools.cmd.checkQuotedMedia(ctx.quoted, "image")
        ]);

        try {
            const endpoint = ctx.used.cmd === "claudeopus" ? "/ai/claude-opus-4" : "/ai/claude-sonnet-4";
            const senderUid = await db.get(`user.${ctx.getId(ctx.sender.jid)}.uid`) || "guest";
            if (checkMedia || checkQuotedMedia) {
                const buffer = await ctx.msg.media?.toBuffer() || await ctx.quoted?.media?.toBuffer();
                const uploadUrl = await tools.cmd.upload(buffer, "image");
                const apiUrl = tools.api.createUrl("nekorinn", endpoint, {
                    text: input,
                    imageUrl: uploadUrl,
                    sessionid: senderUid
                });
                const result = (await axios.get(apiUrl)).data.result;

                return await ctx.reply(result);
            } else {
                const apiUrl = tools.api.createUrl("nekorinn", endpoint, {
                    text: input,
                    sessionid: senderUid
                });
                const result = (await axios.get(apiUrl)).data.result;

                return await ctx.reply(result);
            }
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};