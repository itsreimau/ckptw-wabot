const {
    quote
} = require("@itsreimau/ckptw-mod");
const axios = require("axios");

module.exports = {
    name: "humanizer",
    aliases: ["humanize"],
    category: "ai-misc",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || ctx.quoted?.conversation || Object.values(ctx.quoted).map(q => q?.text || q?.caption).find(Boolean) || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCmdExample(ctx.used, "rei ayanami memiliki latar belakang yang sangat misterius, dan tidak terlalu banyak terungkap. diketahui ia merupakan hasil rekayasa genetis dari dna yui dan angel kedua, lilith. dia dibesarkan di sebuah ruangan di basement nerv, yang memiliki penataan ruang yang mirip dengan di apartemen yang ditempatinya."))
        );

        try {
            const apiUrl = tools.api.createUrl("paxsenix", "/ai-tools/humanizer", {
                text: input
            });
            const result = (await axios.get(apiUrl)).data.content;

            return await ctx.reply(result);
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};