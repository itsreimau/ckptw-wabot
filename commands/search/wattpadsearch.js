const {
    quote
} = require("@itsreimau/ckptw-mod");
const axios = require("axios");

module.exports = {
    name: "wattpadsearch",
    aliases: ["wattpad", "wattpads"],
    category: "search",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCmdExample(ctx.used, "evangelion"))
        );

        try {
            const apiUrl = tools.api.createUrl("agatz", "/api/wattpad", {
                message: input
            });
            const result = (await axios.get(apiUrl)).data.data;

            const resultText = result.map(r =>
                `${quote(`Judul: ${r.title}`)}\n` +
                `${quote(`Deskripsi: ${r.desc}`)}\n` +
                `${quote(`Vote: ${r.vote}`)}\n` +
                `${quote(`Bab: ${r.chapter}`)}\n` +
                `${quote(`URL: ${r.link}`)}`
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