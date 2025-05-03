const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "venice",
    category: "ai-chat",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.quoted.conversation || Object.values(ctx.quoted).map(v => v?.text || v?.caption).find(Boolean) || ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(tools.cmd.generateCommandExample(ctx.used, "apa itu bot whatsapp?"))}\n` +
            quote(tools.cmd.generateNotes(["Balas atau quote pesan untuk menjadikan teks sebagai target input, jika teks memerlukan baris baru."]))
        );

        try {
            const apiUrl = tools.api.createUrl("https://api.siputzx.my.id", "/api/ai/venice", {
                prompt: input
            });
            const result = (await axios.get(apiUrl)).data.message;

            return await ctx.reply(result);
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};