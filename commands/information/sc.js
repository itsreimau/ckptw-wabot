const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "sc",
    aliases: ["script", "source", "sourcecode"],
    category: "information",
    handler: {},
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        return await ctx.reply(
            `${quote("https://github.com/itsreimau/ckptw-wabot")}\n` +
            "\n" +
            config.msg.footer
        ); // Jika Anda tidak menghapus ini, terima kasih!
    }
};