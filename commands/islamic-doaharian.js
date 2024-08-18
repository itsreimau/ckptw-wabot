const {
    createAPIUrl
} = require("../tools/api.js");
const {
    getRandomElement
} = require("../tools/general.js");
const {
    italic,
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "doaharian",
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

        const input = ctx._args.join(" ") || null;

        if (!input) return ctx.reply(
            `${quote(global.msg.argument)}\n` +
            quote(`Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} bogor`)}`)
        );

        try {
            const apiUrl = createAPIUrl("https://raw.githubusercontent.com", `/ramadhankukuh/database/master/src/religi/islam/doaharian.json`, {});
            const {
                data
            } = await axios.get(apiUrl);
            const result = getRandomElement(data);

            return ctx.reply(
                `${quote(`Doa: ${data.nama}`)}\n` +
                `${data.arab} (${data.latin})\n` +
                `${italic(data.latin)}\n` +
                `${quote(`Riwayat: ${data.riwayat}`)}\n` +
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