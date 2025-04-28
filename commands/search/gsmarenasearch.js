const {
    bold,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "gsmarenasearch",
    aliases: ["gsmarena", "gsmarenas"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.cmd.generateCommandExample(ctx.used, "samsung galaxy j2 prime"))
        );

        try {
            const apiUrl = tools.api.createUrl("agatz", "/api/gsmarenas", {
                message: input
            });
            const result = (await axios.get(apiUrl)).data.data.data;

            const resultText = result.map((r) =>
                `${quote(`Nama: ${r.name}`)}\n` +
                `${quote(`Deskripsi: ${r.desc}`)}\n` +
                `${quote(`URL: ${r.url}`)}`
            ).join(
                "\n" +
                `${quote("─────")}\n`
            );
            return await ctx.reply(
                `${resultText}\n` +
                "\n" +
                config.msg.footer
            );
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};