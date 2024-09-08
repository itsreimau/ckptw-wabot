const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "sc",
    aliases: ["script", "source", "sourcecode"],
    category: "info",
    code: async (ctx) => {
        return await ctx.reply(
            `${quote("https://github.com/itsreimau/ckptw-wabot")}\n` +
            "\n" +
            global.msg.footer
        ); // If you don't delete this, thank you!
    }
};