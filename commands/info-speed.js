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
            const startTime = performance.now();
            const testSpeed = await ctx.reply("Menguji kecepatan...");
            const responseTime = (performance.now() - startTime).toFixed(2);
            await ctx.editMessage(testSpeed.key, `Merespon dalam ${responseTime} ms.`);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};