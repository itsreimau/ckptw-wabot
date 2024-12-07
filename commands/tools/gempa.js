const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "gempa",
    aliases: ["gempabumi", "infogempa"],
    category: "tools",
    handler: {
        coin: 10
    },
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        const apiUrl = await tools.api.createUrl("https://data.bmkg.go.id", "/DataMKG/TEWS/autogempa.json");

        try {
            const {
                data
            } = await axios.get(apiUrl);
            const gempa = data.Infogempa.gempa;

            return await ctx.reply({
                image: {
                    url: `https://data.bmkg.go.id/DataMKG/TEWS/${gempa.Shakemap}`
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
            console.error(`[${config.pkg.name}] Error:`, error);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};