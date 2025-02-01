const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "weather",
    aliases: ["cuaca"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx.used, "bogor"))
        );

        try {
            const apiUrl = tools.api.createUrl("agatz", "/api/cuaca", {
                message: input
            });
            const {
                data
            } = (await axios.get(apiUrl)).data;

            return await ctx.reply(
                `${quote(`Lokasi: ${data.location.name}, ${data.location.region}, ${data.location.country}`)}\n` +
                `${quote(`Latitude: ${data.location.lat}`)}\n` +
                `${quote(`Longitude: ${data.location.lon}`)}\n` +
                `${quote(`Zona Waktu: ${data.location.tz_id}`)}\n` +
                `${quote(`Waktu Lokal: ${data.location.localtime}`)}\n` +
                `${quote("─────")}\n` +
                `${quote(`Cuaca: ${await tools.general.translate(data.current.condition.text, "id")}`)}\n` +
                `${quote(`Suhu Saat Ini: ${data.current.temp_c}°C (${data.current.temp_f}°F)`)}\n` +
                `${quote(`Terasa Seperti: ${data.current.feelslike_c}°C (${data.current.feelslike_f}°F)`)}\n` +
                `${quote(`Kelembaban: ${data.current.humidity}%`)}\n` +
                `${quote(`Kecepatan Angin: ${data.current.wind_kph} kph (${data.current.wind_mph} mph)`)}\n` +
                `${quote(`Arah Angin: ${data.current.wind_dir} (${data.current.wind_degree}°)`)}\n` +
                `${quote(`Tekanan Udara: ${data.current.pressure_mb} mb (${data.current.pressure_in} in)`)}\n` +
                `${quote(`Curah Hujan: ${data.current.precip_mm} mm (${data.current.precip_in} in)`)}\n` +
                `${quote(`Kondisi Langit: ${data.current.cloud}% awan`)}\n` +
                `${quote(`Indeks UV: ${data.current.uv}`)}\n` +
                `${quote(`Jarak Pandang: ${data.current.vis_km} km (${data.current.vis_miles} mil)`)}\n` +
                `${quote(`Hembusan Angin: ${data.current.gust_kph} kph (${data.current.gust_mph} mph)`)}\n` +
                "\n" +
                config.msg.footer
            );
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};