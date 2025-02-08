const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "llama",
    category: "ai-chat",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx.used, "apa itu bot whatsapp?"))
        );

        try {
            const senderId = tools.general.getID(ctx.sender.jid);
            const senderUid = await db.get(`user.${senderId}.uid`) || "guest";
            const apiUrl = tools.api.createUrl("bk9", "/ai/llama3", {
                q: input,
                userId: senderUid
            });
            const result = (await axios.get(apiUrl)).data.BK9;

            return await ctx.reply(result);
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};