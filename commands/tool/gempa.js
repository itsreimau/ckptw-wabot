const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "gempa",
    aliases: ["gempabumi", "infogempa"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const apiUrl = tools.api.createUrl("https://data.bmkg.go.id", "/DataMKG/TEWS/autogempa.json");

        try {
            const {
                gempa
            } = (await axios.get(apiUrl)).data.Infogempa;

            return await ctx.reply({
                image: {
                    url: tools.api.createUrl("https://data.bmkg.go.id", `/DataMKG/TEWS/${gempa.Shakemap}`)
                },
                mimetype: mime.lookup("png"),
                caption: `${quote(gempa.Wilayah)}\n` +
                    `${quote("─────")}\n` +
                    `${quote(`Tanggal: ${gempa.Tanggal}`)}\n` +
                    `${quote(`Potensi: ${gempa.Potensi}`)}\n` +
                    `${quote(`Magnitude: ${gempa.Magnitude}`)}\n` +
                    `${quote(`Kedalaman: ${gempa.Kedalaman}`)}\n` +
                    `${quote(`Koordinat: ${gempa.Coordinates}`)}\n` +
                    `${quote(`Dirasakan: ${gempa.Dirasakan}`)}\n` +
                    "\n" +
                    config.msg.footer
            });
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};