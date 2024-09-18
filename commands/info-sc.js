const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "sc",
    aliases: ["script", "source", "sourcecode"],
    category: "info",
    code: async (ctx) => {
        return await ctx.reply(
            `${quote("https://github.com/itsreimau/${global.config.pkg.name}")}\n` +
            "\n" +
            global.config.msg.footer
        ); // Jika Anda tidak menghapus ini, terima kasih!
    }
};