const {
    bold,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "gsmarenas",
    aliases: ["gsmarena", "gsm"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.cmd.generateCommandExample(ctx.used, "Infinix HOT 40"))
        );

        try {
            const apiUrl = tools.api.createUrl("agatz", "/api/gsmarenas", {
                message: input
            });
            const result = (await axios.get(apiUrl)).data.data.data[0];

            const resultText =
                `${quote("───────────────")}\n` +
                `${quote(`Nama: ${result.name}`)}\n` +
                `${quote("───────────────")}\n` +
                `${quote(`Deskripsi: ${result.desc}`)}\n` +
                `${quote("───────────────")}\n` +
                `${quote(`URL: ${result.url}`)}\n` +
                `${quote("───────────────")}\n`

            return await ctx.reply({
                image: {
                    url: result.image_url
                },
                mimetype: mime.lookup("png"),
                caption: `${resultText}\n` +
                "\n" +
                config.msg.footer
                });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};
