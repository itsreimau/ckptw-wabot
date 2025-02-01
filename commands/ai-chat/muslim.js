const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "muslim",
    aliases: ["muslimai"],
    category: "ai-chat",
    permissions: {},
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx.used, "apa itu bot whatsapp?"))
        );

        try {
            const senderId = ctx.sender.decodedJid;
            const senderUid = await db.get(`user.${senderId}.uid`) || "guest";
            const apiUrl = tools.api.createUrl("fasturl", "/aillm/muslim", {
                ask: input,
                sessionId: senderUid
            });
            const {
                data
            } = await axios.get(apiUrl);

            return await ctx.reply(data.response);
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};