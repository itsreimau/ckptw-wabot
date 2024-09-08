const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "holiday",
    aliases: ["harilibur", "libur"],
    category: "tools",
    code: async (ctx) => {
        const [userLanguage] = await Promise.all([
            global.db.get(`user.${ctx.sender.jid.replace(/@.*|:.*/g, "")}.language`)
        ]);

        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            coin: 3
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
                    `${quote(`${day}, ${d.getDate()} ${mon} ${year}`, userLanguage)}`;
            }).join(
                "\n" +
                `${quote("─────")}\n`
            );
            return ctx.reply(
                `${resultText}\n` +
                "\n" +
                global.msg.footer
            );
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(`⛔ ${await global.tools.msg.translate(global.msg.notFound, userLanguage)}`);
            return ctx.reply(quote(`⚠ ${await global.tools.msg.translate("Terjadi kesalahan", userLanguage)}: ${error.message}`));
        }
    }
};