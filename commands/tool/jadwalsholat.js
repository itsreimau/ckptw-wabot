const {
    quote
} = require("@itsreimau/ckptw-mod");
const axios = require("axios");

module.exports = {
    name: "jadwalsholat",
    aliases: ["sholat"],
    category: "tool",
    permissions: {},
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx.used, "bogor"))
        );

        try {
            const apiUrl = tools.api.createUrl("agatz", "/api/jadwalsholat", {
                kota: input
            });
            const result = (await axios.get(apiUrl)).data.data;

            return await ctx.reply(
                `${quote(`Subuh: ${result.subuh}`)}\n` +
                `${quote(`Dhuhur: ${result.dhuhur}`)}\n` +
                `${quote(`Ashar: ${result.ashar}`)}\n` +
                `${quote(`Maghrib: ${result.maghrib}`)}\n` +
                `${quote(`Isya: ${result.isya}`)}\n` +
                "\n" +
                config.msg.footer
            );
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};