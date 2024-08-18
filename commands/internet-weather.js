const {
    createAPIUrl
} = require("../tools/api.js");
const {
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
            `${quote(global.msg.argument)}\n` +
            quote(`Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} bogor`)}`)
        );

        try {
            const apiUrl = await createAPIUrl("agatz", "/api/cuaca", {
                message: input
            });
            const response = await axios.get(apiUrl);
            const {
                data
            } = response.data;
            const weatherId = await translate(data.current.condition.text, "en", "id");

            return ctx.reply(
                `${quote(`Tempat: ${data.location.name}, ${data.data.location.region}, ${data.data.location.country}`)}\n` +
                `${quote(`Cuaca: ${weatherId.translation)}`)}\n` +
                `${quote(`Kelembapan: ${data.current.humidity} %`)}\n` +
                `${quote(`Angin: ${data.current.wind_kph} km/jam (${data.data.current.wind_dir})`)}\n` +
                `${quote(`Suhu saat ini: ${data.current.temp_c} °C`)}\n` +
                `${quote(`Terasa seperti: ${data.current.feelslike_c} °C`)}\n` +
                `${quote(`Kecepatan angin: ${data.current.gust_kph} km/jam`)}\n` +
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