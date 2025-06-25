const axios = require("axios");
const moment = require("moment-timezone");

module.exports = {
    name: "holiday",
    aliases: ["harilibur", "libur"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const month = new Date().getMonth() + 1;
        const apiUrl = tools.api.createUrl("https://dayoffapi.vercel.app", "/api", {
            month
        });

        try {
            const result = (await axios.get(apiUrl)).data;

            const resultText = result.reverse().map(r => {
                const formattedDate = moment.tz(r.tanggal, "Asia/Jakarta").locale("id").format("dddd, DD MMMM YYYY");
                return `${formatter.quote(r.keterangan)}\n` +
                    formatter.quote(formattedDate);
            }).join(
                "\n" +
                `${formatter.quote("─────")}\n`
            );
            return await ctx.reply(
                `${resultText || config.msg.notFound}\n` +
                "\n" +
                config.msg.footer
            );
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};