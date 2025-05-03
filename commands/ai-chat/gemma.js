const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "gemma",
    category: "ai-chat",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const input = ctx.quoted.conversation || Object.values(ctx.quoted).map(v => v?.text || v?.caption).find(Boolean) || ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(tools.cmd.generateCommandExample(ctx.used, "apa itu bot whatsapp?"))}\n` +
            quote(tools.cmd.generateNotes(["Balas atau quote pesan untuk menjadikan teks sebagai input target, jika teks memerlukan baris baru."]))
        );

        try {
            const senderUid = await db.get(`user.${tools.general.getID(ctx.sender.jid)}.uid`) || "guest";
            const apiUrl = tools.api.createUrl("fast", "/aistream/gemma", {
                ask: input,
                style: `You are a WhatsApp bot named ${config.bot.name}, owned by ${config.owner.name}. Be friendly, informative, and engaging.`, // Dapat diubah sesuai keinginan Anda
                sessionId: senderUid
            });
            const result = (await axios.get(apiUrl)).data;

            return await ctx.reply(result);
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};