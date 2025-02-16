const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "kodepossearch",
    aliases: ["kodepos", "kodeposs"],
    category: "search",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx.used, "bogor"))
        );

        try {
            const apiUrl = tools.api.createUrl("agatz", "/api/kodepos", {
                message: input
            });
            const result = (await axios.get(apiUrl)).data.data;

            const resultText = result.map((r) =>
                `${quote(`ID: ${r.id}`)}\n` +
                `${quote(`Kode Kemendagri: ${r.kode_kemendagri}`)}\n` +
                `${quote(`Kode Pos: ${r.kode_pos}`)}\n` +
                `${quote(`Kelurahan: ${r.kelurahan}`)}\n` +
                `${quote(`Kecamatan: ${r.kecamatan}`)}\n` +
                `${quote(`Kota: ${r.kota}`)}\n` +
                `${quote(`Zona Waktu: ${r.zona_waktu}`)}\n` +
                `${quote(`Lintang: ${r.lintang}`)}\n` +
                `${quote(`Bujur: ${r.bujur}`)}\n` +
                `${quote(`Elevasi: ${r.elevasi}`)}`
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
            consolefy.error(`Error: ${error}`);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};