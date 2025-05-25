const {
    quote
} = require("@itsreimau/ckptw-mod");

module.exports = {
    name: "listapis",
    aliases: ["listapi"],
    category: "information",
    permissions: {},
    code: async (ctx) => {
        try {
            const APIs = tools.api.listUrl();
            let resultText = "";

            for (const [name, api] of Object.entries(APIs)) resultText += quote(`${api.baseURL}\n`);

            return await ctx.reply(
                `${quote("Daftar API yang digunakan:")}\n` +
                `${resultText.trim()}\n` +
                "\n" +
                config.msg.footer
            );
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};