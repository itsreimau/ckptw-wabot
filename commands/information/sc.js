const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "sc",
    aliases: ["script", "source", "sourcecode"],
    category: "information",
    permissions: {},
    code: async (ctx) => {
        if (await middleware(ctx, module.exports.permissions)) return;

        return await ctx.reply(
            `${quote("https://github.com/itsreimau/ckptw-wabot")}\n` +
            "\n" +
            config.msg.footer
        ); // Jika Anda tidak menghapus ini, terima kasih!
    }
};