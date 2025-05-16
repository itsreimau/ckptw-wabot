const {
    quote
} = require("@itsreimau/ckptw-mod");
const axios = require("axios");

module.exports = {
    name: "simsimi",
    aliases: ["simi"],
    category: "entertainment",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || ctx.quoted.conversation || Object.values(ctx.quoted).map(v => v?.text || v?.caption).find(Boolean) || null;;

        if (!input) return await ctx.reply(
            `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(tools.cmd.generateCommandExample(ctx.used, "halo, dunia!"))}\n` +
            quote(tools.cmd.generateNotes(["Balas atau quote pesan untuk menjadikan teks sebagai input target, jika teks memerlukan baris baru."]))
        );

        try {
            const apiUrl = tools.api.createUrl("otinxsandip", "/sim", {
                chat: input,
                lang: ctx.sender.jid.startsWith("62") ? "id" : "en"
            });
            const result = (await axios.get(apiUrl)).data.answer;

            return await ctx.reply(result);
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};