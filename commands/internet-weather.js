const {
    createAPIUrl
} = require("../tools/api.js");
const {
    ucword
} = require("../tools/general.js");
const {
    bold,
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const {
    translate
} = require("bing-translate-api");

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

        const input = ctx._args.join(" ") || null;

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} bogor`)}`
        );

        try {
            const apiUrl = await createAPIUrl("https://api.openweathermap.org", "/data/2.5/weather", {
                q: input,
                units: "metric",
                appid: "060a6bcfa19809c2cd4d97a212b19273"
            });
            const {
                data
            } = await axios.get(apiUrl);
            const weatherId = await translate(data.weather[0].description, "en", "id");

            return ctx.reply(
                `${quote(`Tempat: ${data.name} (${data.sys.country})`)}\n` +
                `${quote(`Cuaca: ${ucword(weatherId.translation)}`)}\n` +
                `${quote(`Kelembapan: ${data.main.humidity} %`)}\n` +
                `${quote(`Angin: ${data.wind.speed} km/jam`)}\n` +
                `${quote(`Suhu saat ini: ${data.main.temp} °C`)}\n` +
                `${quote(`Suhu tertinggi: ${data.main.temp_max} °C`)}\n` +
                `${quote(`Suhu terendah: ${data.main.temp_min} °C`)}\n` +
                "\n" +
                global.msg.footer
            );
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};