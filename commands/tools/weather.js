const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "weather",
    aliases: ["cuaca"],
    category: "tools",
    handler: {
        banned: true,
        cooldown: true,
        coin: [10, "text", 1]
    },
    code: async (ctx) => {
        const status = await handler(ctx, module.exports.handler);
        if (status) return;

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "bogor"))
        );

        try {
            const apiUrl = await tools.api.createUrl("aemt", "/weather", {
                text: input
            });
            const {
                result
            } = (await axios.get(apiUrl)).data;

            return await ctx.reply(
                `${quote(`Tempat: ${result.location}, ${result.location.country}`)}\n` +
                `${quote(`Cuaca: ${await tools.general.translate(result.weather, "id")}`)}\n` +
                `${quote(`Suhu saat ini: ${result.currentTemp}`)}\n` +
                `${quote(`Suhu maksimal: ${result.maxTemp}`)}\n` +
                `${quote(`Suhu minimal: ${result.minTemp}`)}\n` +
                `${quote(`Kelembaban: ${result.humidity}`)}\n` +
                `${quote(`Kecepatan angin: ${result.windSpeed}`)}\n` +
                "\n" +
                config.msg.footer
            );
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};