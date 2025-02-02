const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "simsimi",
    aliases: ["simi"],
    category: "entertainment",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx.used, "halo, dunia!"))
        );

        try {
            const apiUrl = tools.api.createUrl("otinxsandip", "/sim", {
                chat: input,
                lang: ctx.sender.jid.startsWith("62") ? "id" : "en"
            });
            const {
                data
            } = await axios.get(apiUrl);

            return await ctx.reply(data.answer);
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};