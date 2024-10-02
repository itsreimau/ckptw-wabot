const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "weather",
    aliases: ["cuaca"],
    category: "web_tools",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            cooldown: true,
            coin: [10, "text", 1]
        });
        if (status) return ctx.reply(message);

        const input = ctx.args.join(" ") || null;

        if (!input) return ctx.reply(
            `${quote(global.tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "bogor"))
        );

        try {
            const apiUrl = await global.tools.api.createUrl("agatz", "/api/cuaca", {
                message: input
            });
            const response = await axios.get(apiUrl);
            const data = response.data.data;

            return ctx.reply(
                `${quote(`Tempat: ${data.location.name}, ${data.location.region}, ${data.location.country}`)}\n` +
                `${quote(`Cuaca: ${await global.tools.general.translate(data.current.condition.text, "id").translation}`)}\n` +
                `${quote(`Kelembapan: ${data.current.humidity} %`)}\n` +
                `${quote(`Angin: ${data.current.wind_kph} km/jam (${data.current.wind_dir})`)}\n` +
                `${quote(`Suhu saat ini: ${data.current.temp_c} °C`)}\n` +
                `${quote(`Terasa seperti: ${data.current.feelslike_c} °C`)}\n` +
                `${quote(`Kecepatan angin: ${data.current.gust_kph} km/jam`)}\n` +
                "\n" +
                global.config.msg.footer
            );
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            if (error.status !== 200) return ctx.reply(global.config.msg.notFound);
            return ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};