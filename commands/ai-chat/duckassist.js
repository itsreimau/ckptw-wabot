const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "duckassist",
    category: "ai-chat",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.quoted.conversation || Object.values(ctx.quoted).map(v => v?.text || v?.caption).find(Boolean) || ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(tools.cmd.generateCommandExample(ctx.used, "apa itu bot whatsapp?"))}\n` +
            quote(tools.cmd.generateNotes(["Balas atau quote pesan untuk menjadikan teks sebagai input target, jika teks memerlukan baris baru."]))
        );

        try {
            const apiUrl = tools.api.createUrl("fast", "/aiexperience/duckassist", {
                ask: input
            });
            const result = (await axios.get(apiUrl)).data.result.answer;

            return await ctx.reply(result);
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};