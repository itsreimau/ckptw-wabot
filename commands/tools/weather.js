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
        const {
            status,
            message
        } = await global.handler(ctx, module.exports.handler);
        if (status) return await ctx.reply(message);

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(global.tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "bogor"))
        );

        try {
            const apiUrl = await global.tools.api.createUrl("widipe", "/weather", {
                text: input
            });
            const {
                result
            } = (await axios.get(apiUrl)).data;

            return await ctx.reply(
                `${quote(`Tempat: ${result.location}, ${result.location.country}`)}\n` +
                `${quote(`Cuaca: ${await global.tools.general.translate(result.weather, "id")}`)}\n` +
                `${quote(`Suhu saat ini: ${result.currentTemp}`)}\n` +
                `${quote(`Suhu maksimal: ${result.maxTemp}`)}\n` +
                `${quote(`Suhu minimal: ${result.minTemp}`)}\n` +
                `${quote(`Kelembaban: ${result.humidity}`)}\n` +
                `${quote(`Kecepatan angin: ${result.windSpeed}`)}\n` +
                "\n" +
                global.config.msg.footer
            );
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            if (error.status !== 200) return await ctx.reply(global.config.msg.notFound);
            return await ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};