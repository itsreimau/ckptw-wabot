const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "googleimage",
    aliases: ["gimage"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.quoted.conversation || Object.values(ctx.quoted).map(v => v?.text || v?.caption).find(Boolean) || ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(tools.cmd.generateCommandExample(ctx.used, "moon"))}\n` +
            quote(tools.cmd.generateNotes(["Balas atau quote pesan untuk menjadikan teks sebagai target input, jika teks memerlukan baris baru."]))
        );

        try {
            const apiUrl = tools.api.createUrl("fast", "/search/gimage", {
                ask: input
            });
            const result = tools.general.getRandomElement((await axios.get(apiUrl)).data.result).image;

            return await ctx.reply({
                image: {
                    url: result
                },
                mimetype: mime.lookup("png"),
                caption: `${quote(`Kueri: ${input}`)}\n` +
                    "\n" +
                    config.msg.footer
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};