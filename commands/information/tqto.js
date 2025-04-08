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
            `${quote("BochilGaming (https://github.com/BochilGaming)")}\n` +
            `${quote("OtinXSandip (https://github.com/OtinXSandip)")}\n` +
            `${quote("agatzdev (https://github.com/agatdwi)")}\n` +
            `${quote("swndyyyyyy (https://github.com/swndyy)")}\n` +
            `${quote("siputzx (https://github.com/siputzx)")}\n` +
            `${quote("Fatahillah Al makarim (https://github.com/ZTRdiamond)")}\n` +
            `${quote("FastURL (alias Hikaru) (https://github.com/fasturl)")}\n` +
            `${quote("Siraj (https://github.com/BK9dev)")}\n` +
            `${quote("Aine (https://github.com/Aiinne)")}\n` +
            `${quote("Lann (https://github.com/ERLANRAHMAT)")}\n` +
            `${quote("Dan kepada semua pihak yang telah membantu dalam pengembangan bot ini.")}\n` +
            "\n" +
            config.msg.footer
        ); // Jika Anda tidak menghapus ini, terima kasih!
    }
};