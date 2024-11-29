const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "tqto",
    aliases: ["thanksto"],
    category: "information",
    handler: {},
    code: async (ctx) => {
        const status = await handler(ctx, module.exports.handler);
        if (status) return;

        return await ctx.reply(
            `${quote("Allah SWT")}\n` +
            `${quote("ItsReimau (https://github.com/itsreimau)")}\n` +
            `${quote("JastinXyz (https://github.com/JastinXyz)")}\n` +
            `${quote("Idul (https://github.com/aidulcandra)")}\n` +
            `${quote("UdeanDev (https://github.com/udeannn)")}\n` +
            `${quote("ZTRdiamond (https://github.com/ZTRdiamond)")}\n` +
            `${quote("Serv00 (https://serv00.com/)")}\n` +
            `${quote("Dan kepada semua pihak yang telah membantu dalam pengembangan bot ini.")}\n` +
            "\n" +
            config.msg.footer
        ); // Jika Anda tidak menghapus ini, terima kasih!
    }
};