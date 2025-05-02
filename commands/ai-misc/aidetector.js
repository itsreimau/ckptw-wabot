const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "aidetector",
    category: "ai-misc",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.cmd.generateCommandExample(ctx.used, "moon"))
        );

        try {
            const apiUrl = tools.api.createUrl("bk9", "/tools/txtdetect", {
                q: input
            });
            const result = (await axios.get(apiUrl)).data.BK9.data;

            return await ctx.reply(
                `${quote(`Terdeteksi AI: ${result.isHuman === 0 ? "Ya" : "Tidak"}`)}\n` +
                `${quote(`Persentase AI: ${result.fakePercentage}%`)}\n` +
                `${quote(`Kata: ${result.textWords} total, ${result.aiWords} AI`)}\n` +
                `${quote(`Bahasa: ${result.detected_language}`)}\n` +
                "\n" +
                config.msg.footer
            );
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};