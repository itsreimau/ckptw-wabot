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
        const status = await handler(ctx, module.exports.handler);
        if (status) return;

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "bogor"))
        );

        try {
            const apiUrl = tools.api.createUrl("ryzendesu", "/api/search/jadwal-sholat", {
                kota: input
            });
            const {
                data
            } = await axios.get(apiUrl);

            const resultText = data.schedules.map((d) =>
                `${quote(`Lokasi: ${d.lokasi}`)}`
                `${quote(`Daerah: ${d.daerah}`)}\n` +
                `${quote(`Imsak: ${d.jadwal.imsak}`)}\n` +
                `${quote(`Subuh: ${d.jadwal.subuh}`)}\n` +
                `${quote(`Terbit: ${d.jadwal.terbit}`)}\n` +
                `${quote(`Dhuha: ${d.jadwal.dhuha}`)}\n` +
                `${quote(`Dzuhur: ${d.jadwal.dzuhur}`)}\n` +
                `${quote(`Ashar: ${d.jadwal.ashar}`)}\n` +
                `${quote(`Maghrib: ${d.jadwal.maghrib}`)}\n` +
                `${quote(`Isya: ${d.jadwal.isya}`)}\n` +
            ).join("\n");
            return await ctx.reply(
                `${quote(`Total: ${data.total}`)}\n` +
                `${resultText}\n` +
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