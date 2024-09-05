const {
    quote
} = require("@mengkodingan/ckptw");
const {
    performance
} = require("perf_hooks");

module.exports = {
    name: "speed",
    category: "info",
    code: async (ctx) => {
        const [userLanguage] = await Promise.all([
            global.db.get(`user.${ctx.sender.jid.replace(/@.*|:.*/g, "")}.language`)
        ]);

        try {
            const startTime = performance.now();
            const testSpeed = await ctx.reply(quote(`🔄 ${await global.tools.msg.translate("Menguji kecepatan...", userLanguage)}`));
            const responseTime = (performance.now() - startTime).toFixed(2);
            await ctx.editMessage(testSpeed.key, quote(`🚀 ${await global.tools.msg.translate(`Merespon dalam ${responseTime} ms.`, userLanguage)})`));
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(quote(`⚠ ${await global.tools.msg.translate("Terjadi kesalahan", userLanguage)}: ${error.message}`));
        }
    }
};