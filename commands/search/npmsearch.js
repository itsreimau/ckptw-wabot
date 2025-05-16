const {
    quote
} = require("@itsreimau/ckptw-mod");
const axios = require("axios");

module.exports = {
    name: "npmsearch",
    aliases: ["npm", "npms"],
    category: "search",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.cmd.generateCommandExample(ctx.used, "evangelion"))
        );

        try {
            const apiUrl = tools.api.createUrl("agatz", "/api/npm", {
                message: input
            });
            const result = (await axios.get(apiUrl)).data.data;

            const resultText = result.map((r) =>
                `${quote(`Nama: ${r.name}`)}\n` +
                `${quote(`Versi: ${r.version}`)}\n` +
                `${quote(`Dekripsi: ${r.description}`)}\n` +
                `${quote(`Author: ${r.author}`)}\n` +
                `${quote(`URL: ${r.npmLink}`)}`
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