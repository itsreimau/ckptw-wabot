const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "weather",
    aliases: ["cuaca"],
    category: "internet",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            energy: 10,
            cooldown: true
        });
        if (status) return ctx.reply(message);

        const input = ctx.args.join(" ") || null;

        if (!input) return ctx.reply(
            `${quote(global.tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "bogor"))
        );

        try {
            const weatherApiUrl = await global.tools.api.createUrl("agatz", "/api/cuaca", {
                message: input
            });
            const weatherResponse = await axios.get(weatherApiUrl);
            const weatherData = weatherResponse.data.data;

            const translationApiUrl = global.tools.api.createUrl("fasturl", "/tool/translate", {
                text: weatherData.current.condition.text,
                target: "id"
            });
            const translationResponse = await axios.get(translationApiUrl, {
                headers: {
                    "x-api-key": global.tools.listAPIUrl().fasturl.APIKey
                }
            });
            const translatedText = translationResponse.data.translatedText;

            return ctx.reply(
                `${quote(`Tempat: ${weatherData.location.name}, ${weatherData.location.region}, ${weatherData.location.country}`)}\n` +
                `${quote(`Cuaca: ${translatedText}`)}\n` +
                `${quote(`Kelembapan: ${weatherData.current.humidity} %`)}\n` +
                `${quote(`Angin: ${weatherData.current.wind_kph} km/jam (${weatherData.current.wind_dir})`)}\n` +
                `${quote(`Suhu saat ini: ${weatherData.current.temp_c} °C`)}\n` +
                `${quote(`Terasa seperti: ${weatherData.current.feelslike_c} °C`)}\n` +
                `${quote(`Kecepatan angin: ${weatherData.current.gust_kph} km/jam`)}\n` +
                "\n" +
                global.msg.footer
            );
        } catch (error) {
            console.error("[ckptw-wabot] Kesalahan:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};