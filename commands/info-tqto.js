const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "tqto",
    aliases: ["thanksto"],
    category: "info",
    code: async (ctx) => {
        const [userLanguage] = await Promise.all([
            global.db.get(`user.${ctx.sender.jid.replace(/@.*|:.*/g, "")}.language`)
        ]);

        return ctx.reply(
            `${quote("Allah SWT")}\n` +
            `${quote("JastinXyz (https://github.com/JastinXyz)")}\n` +
            `${quote("Idul (https://github.com/aidulcandra)")}\n` +
            `${quote("ZTRdiamond (https://github.com/ZTRdiamond)")}\n` +
            `${quote("Serv00 (https://serv00.com/)")}\n` +
            `${quote(await global.tools.msg.translate("Dan kepada semua pihak yang telah membantu dalam pengembangan bot ini.", userLanguage))}\n` +
            "\n" +
            global.msg.footer
        );
    }
};