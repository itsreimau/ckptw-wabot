const {
    createAPIUrl
} = require("../tools/api.js");
const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "gempa",
    aliases: ["gempabumi"],
    category: "internet",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true,
            coin: 3
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const apiUrl = await createAPIUrl("https://data.bmkg.go.id", "/DataMKG/TEWS/autogempa.json", {});

        try {
            const response = await axios.get(apiUrl);

            if (response.status !== 200) throw new Error(global.msg.notFound);

            const data = await response.data;
            const gempa = data.Infogempa.gempa;

            return ctx.sendMessage(
                ctx.id, {
                    text: `❖ ${bold("Gempa")}\n` +
                        "\n" +
                        `${gempa.Wilayah}\n` +
                        "-----\n" +
                        `➲ Tanggal: ${gempa.Tanggal}\n` +
                        `➲ Potensi: ${gempa.Potensi}\n` +
                        `➲ Magnitude: ${gempa.Magnitude}\n` +
                        `➲ Kedalaman: ${gempa.Kedalaman}\n` +
                        `➲ Koordinat: ${gempa.Coordinates}\n` +
                        `➲ Dirasakan: ${gempa.Dirasakan}\n` +
                        "\n" +
                        global.msg.footer,
                    contextInfo: {
                        externalAdReply: {
                            title: "G E M P A",
                            body: null,
                            thumbnailUrl: `https://data.bmkg.go.id/DataMKG/TEWS/${gempa.Shakemap}`,
                            sourceUrl: global.bot.groupChat,
                            mediaType: 1,
                            renderLargerThumbnail: true,
                        },
                    },
                }, {
                    quoted: ctx._msg,
                }
            );
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};