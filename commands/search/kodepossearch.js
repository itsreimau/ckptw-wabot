const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "kodepossearch",
    aliases: ["kodepos", "kodeposs"],
    category: "search",
    handler: {
        banned: true,
        cooldown: true,
        coin: [10, "text", 1]
    },
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, module.exports.handler);
        if (status) return await ctx.reply(message);

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(global.tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "bogor"))
        );

        try {
            const apiUrl = await global.tools.api.createUrl("agatz", "/api/kodepos", {
                message: input
            });
            const {
                data
            } = (await axios.get(apiUrl)).data;

            const resultText = data.result.map((d) =>
                `${quote(`ID: ${d.id}`)}\n` +
                `${quote(`Kode Kemendagri: ${d.kode_kemendagri}`)}\n` +
                `${quote(`Kode Pos: ${d.kode_pos}`)}\n` +
                `${quote(`Kelurahan: ${d.kelurahan}`)}\n` +
                `${quote(`Kecamatan: ${d.kecamatan}`)}\n` +
                `${quote(`Kota: ${d.kota}`)}\n` +
                `${quote(`Zona Waktu: ${d.zona_waktu}`)}\n` +
                `${quote(`Lintang: ${d.lintang}`)}\n` +
                `${quote(`Bujur: ${d.bujur}`)}\n` +
                `${quote(`Elevasi: ${d.elevasi}`)}`
            ).join(
                "\n" +
                `${quote("─────")}\n`
            );
            return await ctx.reply(
                `${resultText}\n` +
                "\n" +
                global.config.msg.footer
            );
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            if (error.status !== 200) return await ctx.reply(global.config.msg.notFound);
            return await ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};