const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "jadwalsholat",
    aliases: ["sholat"],
    category: "islamic",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            coin: 3
        });
        if (status) return ctx.reply(message);

        const input = ctx.args.join(" ") || null;

        if (!input) return ctx.reply(
            `${quote(global.msg.argument)}\n` +
            quote(`Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} bogor`)}`)
        );

        try {
            const apiUrl = global.tools.api.createUrl("agatz", `/api/jadwalsholat`, {
                kota: input
            });
            const response = await global.tools.fetch.json(apiUrl);
            const {
                data
            } = response.data;

            return ctx.reply(
                `${quote(`Subuh: ${data.subuh}`)}\n` +
                `${quote(`Dhuhur: ${data.dhuhur}`)}\n` +
                `${quote(`Ashar: ${data.ashar}`)}\n` +
                `${quote(`Maghrib: ${data.maghrib}`)}\n` +
                `${quote(`Isya: ${data.isya}`)}\n` +
                "\n" +
                global.msg.footer
            );
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};