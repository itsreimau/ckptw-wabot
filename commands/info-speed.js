const {
    bold
} = require("@mengkodingan/ckptw");
const {
    performance
} = require("perf_hooks");

module.exports = {
    name: "speed",
    category: "info",
    code: async (ctx) => {
        try {
            const handlerObj = await global.handler(ctx, {
                banned: true
            });
            if (handlerObj.status) return ctx.reply(handlerObj.message);

            const startTime = performance.now();
            const message = await ctx.reply("Menguji kecepatan...");
            const responseTime = (performance.now() - startTime).toFixed(2);
            await ctx.editMessage(message.key, `Merespon dalam ${responseTime} ms.`);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    },
};