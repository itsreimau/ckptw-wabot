const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "tqto",
    aliases: ["thanksto"],
    category: "information",
    handler: {
        cooldown: true
    },
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, module.exports.handler);
        if (status) return ctx.reply(message);

        return ctx.reply(
            `${quote("Allah SWT")}\n` +
            `${quote("JastinXyz (https://github.com/JastinXyz)")}\n` +
            `${quote("Idul (https://github.com/aidulcandra)")}\n` +
            `${quote("ZTRdiamond (https://github.com/ZTRdiamond)")}\n` +
            `${quote("Nyx Altair (https://github.com/NyxAltair)")}\n` +
            `${quote("Serv00 (https://serv00.com/)")}\n` +
            `${quote("Dan kepada semua pihak yang telah membantu dalam pengembangan bot ini.")}\n` +
            "\n" +
            global.config.msg.footer
        ); // Jika Anda tidak menghapus ini, terima kasih!
    }
};