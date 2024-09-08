const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const {
    translate
} = require("bing-translate-api");
const axios = require("axios");

module.exports = {
    name: "weather",
    aliases: ["cuaca"],
    category: "internet",
    code: async (ctx) => {
        const [userLanguage] = await Promise.all([
            global.db.get(`user.${ctx.sender.jid.replace(/@.*|:.*/g, "")}.language`)
        ]);

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
            `${quote(`📌 ${await global.tools.msg.translate(global.msg.argument, userLanguage)}`)}\n` +
            quote(`${await global.tools.msg.translate("Contoh", userLanguage)}: ${monospace(`${ctx._used.prefix + ctx._used.command} bogor`)}`)
        );

        try {
            const weatherApiUrl = await global.tools.api.createUrl("agatz", "/api/cuaca", {
                message: input
            });
            const weatherResponse = await axios.get(weatherApiUrl);
            const weatherData = weatherResponse.data;
            const weatherId = await translate(data.weather[0].description, "en", "id");

            return ctx.reply(
                `${quote(`${await global.tools.msg.translate("Tempat", userLanguage)}: ${weatherData.location.name}, ${weatherData.location.region}, ${weatherData.location.country}`)}\n` +
                `${quote(`${await global.tools.msg.translate("Cuaca", userLanguage)}: ${weatherId}`)}\n` +
                `${quote(`${await global.tools.msg.translate("Kelembapan", userLanguage)}: ${weatherData.current.humidity} %`)}\n` +
                `${quote(`${await global.tools.msg.translate("Angin", userLanguage)}: ${weatherData.current.wind_kph} km/jam (${weatherData.current.wind_dir})`)}\n` +
                `${quote(`${await global.tools.msg.translate("Suhu saat ini", userLanguage)}: ${weatherData.current.temp_c} °C`)}\n` +
                `${quote(`${await global.tools.msg.translate("Terasa seperti", userLanguage)}: ${weatherData.current.feelslike_c} °C`)}\n` +
                `${quote(`${await global.tools.msg.translate("Kecepatan angin", userLanguage)}: ${weatherData.current.gust_kph} km/jam`)}\n` +
                "\n" +
                global.msg.footer
            );
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(`⛔ ${await global.tools.msg.translate(global.msg.notFound, userLanguage)}`);
            return ctx.reply(quote(`⚠ ${await global.tools.msg.translate("Terjadi kesalahan", userLanguage)}: ${error.message}`));
        }
    }
};