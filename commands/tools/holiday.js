const {
    bold,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "holiday",
    aliases: ["harilibur", "libur"],
    category: "tools",
    handler: {
        coin: [10, "text", 1]
    },
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        try {
            const month = new Date().getMonth() + 1;
            const apiUrl = tools.api.createUrl("https://api-harilibur.vercel.app", "/api", {
                month
            });
            const {
                data
            } = await axios.get(apiUrl);

            const resultText = data.reverse().map((d) => {
                const dt = new Date(d.holiday_date);
                const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
                const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

                const day = days[dt.getDay()];
                const mon = months[dt.getMonth()];
                const year = dt.getFullYear();

                return `${bold(d.holiday_name)}\n` +
                    `${quote(`${day}, ${dt.getDate()} ${mon} ${year}`)}`;
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
            console.error(`[${config.pkg.name}] Error:`, error);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};