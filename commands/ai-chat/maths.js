const {
    quote
} = require("@itsreimau/ckptw-mod");
const axios = require("axios");

module.exports = {
    name: "maths",
    aliases: ["mathssolve"],
    category: "ai-chat",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || ctx.quoted?.conversation || Object.values(ctx.quoted).map(q => q?.text || q?.caption).find(Boolean) || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(tools.msg.generateCommandExample(ctx.used, "apa itu bot whatsapp?"))}\n` +
            quote(tools.msg.generateNotes(["Balas atau quote pesan untuk menjadikan teks sebagai input target, jika teks memerlukan baris baru."]))
        );

        try {
            const apiUrl = tools.api.createUrl("bk9", "/ai/mathssolve", {
                q: input
            });
            const result = (await axios.get(apiUrl)).data.BK9;

            return await ctx.reply(result);
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};