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
                mimetype: mime.lookup("jpeg"),
                caption: `${formatter.quote(result.Wilayah)}\n` +
                    `${formatter.quote("─────")}\n` +
                    `${formatter.quote(`Tanggal: ${result.Tanggal}`)}\n` +
                    `${formatter.quote(`Potensi: ${result.Potensi}`)}\n` +
                    `${formatter.quote(`Magnitude: ${result.Magnitude}`)}\n` +
                    `${formatter.quote(`Kedalaman: ${result.Kedalaman}`)}\n` +
                    `${formatter.quote(`Koordinat: ${result.Coordinates}`)}\n` +
                    `${formatter.quote(`Dirasakan: ${result.Dirasakan}`)}\n` +
                    "\n" +
                    config.msg.footer
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};