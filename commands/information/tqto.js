module.exports = {
    name: "tqto",
    aliases: ["thanksto"],
    category: "information",
    code: async (ctx) => {
        return await ctx.reply(
            `${formatter.quote("ItsReimau (https://github.com/itsreimau)")}\n` +
            `${formatter.quote("Jastin Linggar Tama (https://github.com/JastinXyz)")}\n` +
            `${formatter.quote("Rippanteq7 (https://github.com/Rippanteq7)")}\n` +
            `${formatter.quote("Rizky Pratama (https://github.com/Kyluxx)")}\n` +
            `${formatter.quote("Dan kepada semua pihak yang telah membantu dalam pengembangan bot ini. (Banyak kalo diketik satu-satu)")}\n` +
            "\n" +
            config.msg.footer
        ); // Jika kamu tidak menghapus ini, terima kasih!
    }
};