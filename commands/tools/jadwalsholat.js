const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "jadwalsholat",
    aliases: ["sholat"],
    category: "tools",
    handler: {
        banned: true,
        cooldown: true
    },
    code: async (ctx) => {
        const status = await handler(ctx, module.exports.handler);
        if (status) return;

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "bogor"))
        );

        try {
            const apiUrl = tools.api.createUrl("chiwa", `/api/jadwal-sholat/${input}`);
            const {
                results
            } = (await axios.get(apiUrl)).data;

            return await ctx.reply(
                `${quote(`Subuh: ${data.Subuh}`)}\n` +
                `${quote(`Terbit: ${data.Terbit}`)}\n` +
                `${quote(`Zuhur: ${data.Zuhur}`)}\n` +
                `${quote(`Asar: ${data.Asar}`)}\n` +
                `${quote(`Magrib: ${data.Magrib}`)}\n` +
                `${quote(`Isya: ${data.Isya}`)}\n` +
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