const {
    quote
} = require("@im-dims/baileys-library");
const {
    performance
} = require("node:perf_hooks");

module.exports = {
    name: "speed",
    category: "information",
    permissions: {},
    code: async (ctx) => {
        try {
            const startTime = performance.now();
            const testMsg = await ctx.reply(quote("🚀 Menguji kecepatan..."));
            const responseTime = (performance.now() - startTime).toFixed(2);
            await ctx.editMessage(testMsg.key, quote(`🚀 Merespon dalam ${responseTime} ms.`));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};