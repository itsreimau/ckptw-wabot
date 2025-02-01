const {
    bold,
    quote
} = require("@mengkodingan/ckptw");
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
        try {
            const month = new Date().getMonth() + 1;
            const apiUrl = tools.api.createUrl("https://api-harilibur.vercel.app", "/api", {
                month
            });
            const {
                data
            } = await axios.get(apiUrl);

            const resultText = data.reverse().map((d) => {
                const formattedDate = moment.tz(d.holiday_date, "Asia/Jakarta").locale("id").format("dddd, DD MMMM YYYY");
                return `${bold(d.holiday_name)}\n` +
                    quote(formattedDate);
            }).join(
                "\n" +
                `${quote("─────")}\n`
            );
            return await ctx.reply(
                `${resultText}\n` +
                "\n" +
                config.msg.footer
            );
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};