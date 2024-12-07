const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "jadwalsholat",
    aliases: ["sholat"],
    category: "tools",
    handler: {},
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "bogor"))
        );

        try {
            const apiUrl = tools.api.createUrl("agatz", "/api/jadwalsholat", {
                kota: input
            });
            const {
                data
            } = (await axios.get(apiUrl)).data;

            return await ctx.reply(
                `${quote(`Subuh: ${data.subuh}`)}\n` +
                `${quote(`Dhuhur: ${data.dhuhur}`)}\n` +
                `${quote(`Ashar: ${data.ashar}`)}\n` +
                `${quote(`Maghrib: ${data.maghrib}`)}\n` +
                `${quote(`Isya: ${data.isya}`)}\n` +
                "\n" +
                config.msg.footer
            );
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};