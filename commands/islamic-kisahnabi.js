const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "kisahnabi",
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
            quote(`Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} muhammad`)}`)
        );

        try {
            const apiUrl = global.tools.createURL("https://raw.githubusercontent.com", `/ZeroChanBot/Api-Freee/master/data/kisahNabi/${input.toLowerCase()}.json`, {});
            const {
                data
            } = await axios.get(apiUrl);

            return ctx.reply(
                `${quote(`Nama: ${data.name}`)}\n` +
                `${quote(`Tahun kelahiran: ${data.thn_kelahiran}`)}\n` +
                `${quote(`Tempat kelahiran: ${data.tmp}`)}\n` +
                `${quote(`Usia: ${data.usia}`)}\n` +
                `${quote("─────")}\n` +
                `${data.description.trim()}\n` +
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