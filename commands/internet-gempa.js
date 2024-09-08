const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "gempa",
    aliases: ["gempabumi"],
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

        const apiUrl = await global.tools.api.createUrl("https://data.bmkg.go.id", "/DataMKG/TEWS/autogempa.json", {});

        try {
            const {
                data
            } = await axios.get(apiUrl);
            const gempa = data.Infogempa.gempa;

            return ctx.reply({
                image: {
                    url: `https://data.bmkg.go.id/DataMKG/TEWS/${gempa.Shakemap}`
                },
                mimetype: mime.contentType("png"),
                caption: `${gempa.Wilayah}\n` +
                    `${quote("─────")}\n` +
                    `${quote(`${await global.tools.msg.translate("Tanggal", userLanguage)}: ${gempa.Tanggal}`)}\n` +
                    `${quote(`${await global.tools.msg.translate("Potensi", userLanguage)}: ${gempa.Potensi}`)}\n` +
                    `${quote(`${await global.tools.msg.translate("Magnitude", userLanguage)}: ${gempa.Magnitude}`)}\n` +
                    `${quote(`${await global.tools.msg.translate("Kedalaman", userLanguage)}: ${gempa.Kedalaman}`)}\n` +
                    `${quote(`${await global.tools.msg.translate("Koordinat", userLanguage)}: ${gempa.Coordinates}`)}\n` +
                    `${quote(`${await global.tools.msg.translate("Dirasakan", userLanguage)}: ${gempa.Dirasakan}`)}\n` +
                    "\n" +
                    global.msg.footer
            });
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(`⛔ ${await global.tools.msg.translate(global.msg.notFound, userLanguage)}`);
            return ctx.reply(quote(`⚠ ${await global.tools.msg.translate("Terjadi kesalahan", userLanguage)}: ${error.message}`));
        }
    }
};