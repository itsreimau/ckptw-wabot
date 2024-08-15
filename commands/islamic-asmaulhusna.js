const {
    createAPIUrl
} = require("../tools/api.js");
const {
    bold,
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "asmaulhusna",
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
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} 7`)}`
        );

        try {
            const apiUrl = createAPIUrl("https://raw.githubusercontent.com", `/ZeroChanBot/Api-Freee/master/data/AsmaulHusna.json`, {});
            const {
                data
            } = await axios.get(apiUrl);
            const asmaulhusna = data.result;

            if (input.toLowerCase() === "all") {
                const resultText = asmaulhusna.map((r) =>
                    `${quote(`Nomor: ${r.number}`)}\n` +
                    `${quote(`Latin: ${r.latin}`)}\n` +
                    `${quote(`Arab: ${r.arab}`)}\n` +
                    `${quote(`Arti: ${r.translate_id}`)}`
                ).join(
                    "\n" +
                    "-----\n"
                );
                return ctx.reply(
                    ` ${bold("Asmaul Husna")}\n` +
                    "\n" +
                    `Daftar semua Asmaul Husna:\n` +
                    `${resultText}\n` +
                    "\n" +
                    global.msg.footer
                );
            }

            const index = parseInt(input);

            if (isNaN(index) || index < 1 || index > 99) return ctx.reply(quote(`${bold("[ ! ]")} Nomor Asmaul Husna tidak valid. Harap masukkan nomor antara 1 dan 99 atau ketik "all" untuk melihat semua Asmaul Husna.`));

            const selectedName = asmaulhusna.find((r) => parseInt(r.number) === index);

            if (selectedName) {
                const {
                    latin,
                    arab,
                    translate_id
                } = selectedName;

                return ctx.reply(
                    `${quote(`Nomor: ${index}`)}\n` +
                    `${quote(`Latin: ${latin}`)}\n` +
                    `${quote(`Arab: ${arab}`)}\n` +
                    `${quote(`Arti: ${translate_id}`)}\n` +
                    "\n" +
                    global.msg.footer
                );
            }
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(quote(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`));
        }
    }
};