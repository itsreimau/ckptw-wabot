const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "zodiak",
    category: "tool",
    handler: {
        coin: [10, "text", 1]
    },
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "aquarius"))
        );

        try {
            const apiUrl = tools.api.createUrl("siputzx", `/api/primbon/zodiak`, {
                zodiak: input
            });
            const {
                data
            } = (await axios.get(apiUrl)).data;

            return await ctx.reply(
                `${quote(`Zodiak: ${data.zodiak}`)}\n` +
                `${quote(`Nomor Keberuntungan: ${data.nomor_keberuntungan}`)}\n` +
                `${quote(`Aroma Keberuntungan: ${data.aroma_keberuntungan}`)}\n` +
                `${quote(`Planet Yang Mengitari: ${data.planet_yang_mengitari}`)}\n` +
                `${quote(`Bunga Keberuntungan: ${data.bunga_keberuntungan}`)}\n` +
                `${quote(`Warna Keberuntungan: ${data.warna_keberuntungan}`)}\n` +
                `${quote(`Batu Keberuntungan: ${data.batu_keberuntungan}`)}\n` +
                `${quote(`Elemen Keberuntungan: ${data.elemen_keberuntungan}`)}\n` +
                `${quote(`Pasangan Zodiak: ${data.pasangan_zodiak}`)}\n` +
                "\n" +
                config.msg.footer
            );
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return message.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};