const {
    quote
} = require("@itsreimau/ckptw-mod");

module.exports = {
    name: "tqto",
    aliases: ["thanksto"],
    category: "information",
    permissions: {},
    code: async (ctx) => {
        return await ctx.reply(
            `${quote("Allah SWT")}\n` +
            `${quote("Orang tua saya")}\n` +
            `${quote("─────")}\n` +
            `${quote("bie (https://github.com/nstar-y)")}\n` +
            `${quote("Fatahillah Al makarim (https://github.com/ZTRdiamond)")}\n` +
            `${quote("Idul (https://github.com/aidulcandra)")}\n` +
            `${quote("ItsReimau (https://github.com/itsreimau)")}\n` +
            `${quote("Jastin Linggar Tama (https://github.com/JastinXyz)")}\n` +
            `${quote("Rippanteq7 (https://github.com/Rippanteq7)")}\n` +
            `${quote("Rizky Pratama (https://github.com/Kyluxx)")}\n` +
            `${quote("Serv00 (https://serv00.com/)")}\n` +
            `${quote("Techwiz (https://github.com/techwiz37)")}\n` +
            `${quote("UdeanDev (https://github.com/udeannn)")}\n` +
            `${quote("WhiskeySockets (https://github.com/WhiskeySockets)")}\n` +
            `${quote("─────")}\n` +
            `${quote("agatzdev (https://github.com/agatdwi)")}\n` +
            `${quote("Aine (https://github.com/Aiinne)")}\n` +
            `${quote("BochilGaming (https://github.com/BochilGaming)")}\n` +
            `${quote("Bhuzel (https://github.com/Bhuzel)")}\n` +
            `${quote("David Cyril (https://github.com/DavidCyrilTech)")}\n` +
            `${quote("ErerexID Chx (https://github.com/ErerexIDChx)")}\n` +
            `${quote("FastURL (alias Hikaru) (https://github.com/fasturl)")}\n` +
            `${quote("FlowFalcon (https://github.com/FlowFalcon)")}\n` +
            `${quote("Lann (https://github.com/ERLANRAHMAT)")}\n` +
            `${quote("Nyx Altair (https://github.com/NyxAltair)")}\n` +
            `${quote("Randyy (https://github.com/rynn-k)")}\n` +
            `${quote("Siraj (https://github.com/BK9dev)")}\n` +
            `${quote("ZellRay (https://github.com/ZellRay)")}\n` +
            `${quote("─────")}\n` +
            `${quote("Dan kepada semua pihak yang telah membantu dalam pengembangan bot ini.")}\n` +
            "\n" +
            config.msg.footer
        ); // Jika Anda tidak menghapus ini, terima kasih!
    }
};