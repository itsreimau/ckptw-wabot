const {
    createAPIUrl,
    listAPIUrl
} = require("../tools/api.js");
const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const fetch = require("node-fetch");

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
            coin: 3
        });
        if (status) return ctx.reply(message);

        const input = ctx.args.join(" ") || null;

        if (!input) return ctx.reply(
            `${quote(global.msg.argument)}\n` +
            quote(`Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} bogor`)}`)
        );

        try {
            const weatherApiUrl = await createAPIUrl("agatz", "/api/cuaca", {
                message: input
            });
            const weatherResponse = await fetch(weatherApiUrl);
            const weatherData = await weatherResponse.json();

            const translationApiUrl = createAPIUrl("fasturl", "/tool/translate", {
                text: weatherData.current.condition.text,
                target: "id"
            });
            const translationResponse = await fetch(translationApiUrl, {
                headers: {
                    "x-api-key": listAPIUrl().fasturl.APIKey
                }
            });
            const translationData = await translationResponse.json();
            const translatedText = translationData.translatedText;

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
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};