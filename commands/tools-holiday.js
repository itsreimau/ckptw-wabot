const {
    bold,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "holiday",
    aliases: ["harilibur", "libur"],
    category: "global.tools",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            charger: true,
            cooldown: true,
            energy: "5"
        });
        if (status) return ctx.reply(message);

        try {
            const month = new Date().getMonth() + 1;
            const apiUrl = global.tools.api.createUrl("https://api-harilibur.vercel.app", "/api", {
                month
            });
            const {
                data
            } = await axios.get(apiUrl);

            const resultText = data.reverse().map((h) => {
                const d = new Date(h.holiday_date);
                const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
                const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

                const day = days[d.getDay()];
                const mon = months[d.getMonth()];
                const year = d.getFullYear();

                return `${bold(h.holiday_name)}\n` +
                    `${quote(`${day}, ${d.getDate()} ${mon} ${year}`)}`;
            }).join(
                "\n" +
                `${quote("─────")}\n`
            );
            return ctx.reply(
                `${resultText}\n` +
                "\n" +
                global.config.msg.footer
            );
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            if (error.status !== 200) return ctx.reply(global.config.msg.notFound);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};