const {
    quote
} = require("@itsreimau/ckptw-mod");

module.exports = {
    name: "tqto",
    aliases: ["contrib", "contribs", "contributor", "contributors", "thanksto"],
    category: "information",
    permissions: {},
    code: async (ctx) => {
        return await ctx.reply(
            `${quote("ItsReimau (https://github.com/itsreimau)")}\n` +
            `${quote("Jastin Linggar Tama (https://github.com/JastinXyz)")}\n` +
            `${quote("Rippanteq7 (https://github.com/Rippanteq7)")}\n` +
            `${quote("Rizky Pratama (https://github.com/Kyluxx)")}\n` +
            `${quote("Dan kepada semua pihak yang telah membantu dalam pengembangan bot ini. (Banyak kalo diketik satu-satu)")}\n` +
            "\n" +
            config.msg.footer
        ); // Jika Anda tidak menghapus ini, terima kasih!
    }
};