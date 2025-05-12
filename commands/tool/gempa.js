const {
    quote
} = require("@im-dims/baileys-library");
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
            const result = (await axios.get(apiUrl)).data.Infogempa.gempa;

            return await ctx.reply({
                image: {
                    url: tools.api.createUrl("https://data.bmkg.go.id", `/DataMKG/TEWS/${result.Shakemap}`)
                },
                mimetype: mime.lookup("jpg"),
                caption: `${quote(result.Wilayah)}\n` +
                    `${quote("─────")}\n` +
                    `${quote(`Tanggal: ${result.Tanggal}`)}\n` +
                    `${quote(`Potensi: ${result.Potensi}`)}\n` +
                    `${quote(`Magnitude: ${result.Magnitude}`)}\n` +
                    `${quote(`Kedalaman: ${result.Kedalaman}`)}\n` +
                    `${quote(`Koordinat: ${result.Coordinates}`)}\n` +
                    `${quote(`Dirasakan: ${result.Dirasakan}`)}\n` +
                    "\n" +
                    config.msg.footer
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};