const {
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
            charger: true,
            cooldown: true
        });
        if (status) return ctx.reply(message);

        const input = ctx.args.join(" ") || null;

        if (!input) return ctx.reply(
            `${quote(global.tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "7"))
        );

        try {
            const apiUrl = global.tools.api.createUrl("https://raw.githubusercontent.com", "/ramadhankukuh/database/master/src/religi/islam/asmaulhusna.json", {});
            const {
                data
            } = await axios.get(apiUrl);
            const asmaulhusna = data.result;

            if (input.toLowerCase() === "all") {
                const resultText = asmaulhusna.map((a) =>
                    `${quote(`Nomor: ${a.number}`)}\n` +
                    `${quote(`Latin: ${a.latin}`)}\n` +
                    `${quote(`Arab: ${a.arab}`)}\n` +
                    `${quote(`Arti: ${a.translate_id}`)}`
                ).join(
                    "\n" +
                    `${quote("─────")}\n`
                );
                return ctx.reply(
                    `${quote("Daftar semua Asmaul Husna:")}\n` +
                    `${resultText}\n` +
                    "\n" +
                    global.config.msg.footer
                );
            }

            const index = parseInt(input);

            if (isNaN(index) || index < 1 || index > 99) return ctx.reply(quote(`⚠ Nomor Asmaul Husna tidak valid. Harap masukkan nomor antara 1 dan 99 atau ketik "all" untuk melihat semua Asmaul Husna.`));

            const selectedName = asmaulhusna.find((a) => parseInt(a.number) === index);

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
                    global.config.msg.footer
                );
            }
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            if (erroa.status !== 200) return ctx.reply(global.config.msg.notFound);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${erroa.message}`));
        }
    }
};