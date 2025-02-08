const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "bagoodex",
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
            const apiUrl = tools.api.createUrl("fasturl", "/aillm/bagoodex", {
                ask: input,
                style: `You are a WhatsApp bot named ${config.bot.name}, owned by ${config.owner.name}. Be friendly, informative, and engaging.`, // Dapat diubah sesuai keinginan Anda
                sessionId: senderUid
            });
            const result = (await axios.get(apiUrl)).data.result;

            return await ctx.reply(result);
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};