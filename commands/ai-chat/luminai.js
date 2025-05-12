const {
    quote
} = require("@im-dims/baileys-library");
const axios = require("axios");

module.exports = {
    name: "luminai",
    aliases: ["lumin"],
    category: "ai-chat",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || ctx.quoted.conversation || Object.values(ctx.quoted).map(v => v?.text || v?.caption).find(Boolean) || null;;

        if (!input) return await ctx.reply(quote(
            `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(tools.cmd.generateCommandExample(ctx.used, "apa itu bot whatsapp?"))}\n` +
            quote(tools.cmd.generateNotes(["Balas atau quote pesan untuk menjadikan teks sebagai input target, jika teks memerlukan baris baru."]))
        ));

        try {
            const apiUrl = tools.api.createUrl("archive", "/api/ai/luminai", {
                text: input
            });
            const result = (await axios.get(apiUrl)).data.result.result;

            return await ctx.reply(result);
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
}