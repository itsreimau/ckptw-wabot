const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "tqto",
    aliases: ["thanksto"],
    category: "information",
    permissions: {},
    code: async (ctx) => {
        return await ctx.reply(
            `${quote("Allah SWT")}\n` +
            `${quote("ItsReimau (https://github.com/itsreimau)")}\n` +
            `${quote("Serv00 (https://serv00.com/)")}\n` +
            `${quote("JastinXyz (https://github.com/JastinXyz)")}\n` +
            `${quote("Idul (https://github.com/aidulcandra)")}\n` +
            `${quote("UdeanDev (https://github.com/udeannn)")}\n` +
            `${quote("Nyx Altair (https://github.com/NyxAltair)")}\n` +
            `${quote("Caliph Dev (https://github.com/caliph91)")}\n` +
            `${quote("ZTRdiamond (https://github.com/ZTRdiamond)")}\n` +
            `${quote("FastURL (alias Hikaru) (https://github.com/fasturl)")}\n` +
            `${quote("ZTRdiamond (https://github.com/ZTRdiamond)")}\n` +
            `${quote("Agungny (https://github.com/Agungny08)")}\n` +
            `${quote("Dan kepada semua pihak yang telah membantu dalam pengembangan bot ini.")}\n` +
            "\n" +
            config.msg.footer
        ); // Jika Anda tidak menghapus ini, terima kasih!
    }
};