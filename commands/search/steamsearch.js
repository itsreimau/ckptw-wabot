const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "steamsearch",
    aliases: ["steam", "steams"],
    category: "search",
    handler: {
        coin: 10
    },
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx._used, "evangelion"))
        );

        try {
            const apiUrl = tools.api.createUrl("agatz", "/api/steams", {
                message: input
            });
            const {
                data
            } = (await axios.get(apiUrl)).data;

            const resultText = (await Promise.all(data.map(async (d) =>
                `${quote(`Nama: ${d.judul}`)}\n` +
                `${quote(`Rilis: ${d.rilis.trim()}`)}\n` +
                `${quote(`Rating: ${await tools.general.translate(d.rating, "id")}`)}\n` +
                `${quote(`URL: ${d.link}`)}`))).join(
                "\n" +
                `${quote("─────")}\n`
            );
            return await ctx.reply(
                `${resultText}\n` +
                "\n" +
                config.msg.footer
            );
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};