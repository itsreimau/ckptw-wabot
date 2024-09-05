const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "asmaulhusna",
    category: "islamic",
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

        const input = ctx.args.join(" ") || null;

        if (!input) return ctx.reply(
            `${quote(`📌 ${await global.tools.msg.translate(await global.msg.argument, userLanguage)}`)}\n` +
            quote(`${await global.tools.msg.translate("Contoh", userLanguage)}: ${monospace(`${ctx._used.prefix + ctx._used.command} 7`)}`)
        );

        try {
            const apiUrl = await global.tools.api.createUrl("https://raw.githubusercontent.com", `/ramadhankukuh/database/master/src/religi/islam/asmaulhusna.json`, {});
            const {
                data
            } = await axios.get(apiUrl);
            const asmaulhusna = data.result;

            if (input.toLowerCase() === "all") {
                const resultText = asmaulhusna.map((a) =>
                    `${quote(`${await global.tools.msg.translate("Nomor", userLanguage)}: ${a.number}`)}\n` +
                    `${quote(`${await global.tools.msg.translate("Latin", userLanguage)}: ${a.latin}`)}\n` +
                    `${quote(`${await global.tools.msg.translate("Arab", userLanguage)}: ${a.arab}`)}\n` +
                    `${quote(`${await global.tools.msg.translate("Arti", userLanguage)}: ${a.translate_id}`)}`
                ).join(
                    "\n" +
                    `${quote("─────")}\n`
                );
                return ctx.reply(
                    `${quote(await global.tools.msg.translate("Daftar semua Asmaul Husna:", userLanguage))}\n` +
                    `${resultText}\n` +
                    "\n" +
                    global.msg.footer
                );
            }

            const index = parseInt(input);

            if (isNaN(index) || index < 1 || index > 99) return ctx.reply(quote(`⚠ ${await global.tools.msg.translate('Nomor Asmaul Husna tidak valid. Harap masukkan nomor antara 1 dan 99 atau ketik "all" untuk melihat semua Asmaul Husna.', userLanguage)}`));

            const selectedName = asmaulhusna.find((a) => parseInt(a.number) === index);

            if (selectedName) {
                const {
                    latin,
                    arab,
                    translate_id
                } = selectedName;

                return ctx.reply(
                    `${quote(`${await global.tools.msg.translate("Nomor", userLanguage)}: ${index}`)}\n` +
                    `${quote(`${await global.tools.msg.translate("Latin", userLanguage)}: ${latin}`)}\n` +
                    `${quote(`${await global.tools.msg.translate("Arab", userLanguage)}: ${arab}`)}\n` +
                    `${quote(`${await global.tools.msg.translate("Arti", userLanguage)}: ${translate_id}`)}\n` +
                    "\n" +
                    global.msg.footer
                );
            }
        } catch (error) {
            console.error("Error:", error);
            if (error.response.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(quote(`⚠ ${await global.tools.msg.translate("Terjadi kesalahan", userLanguage)}: ${error.message}`));
        }
    }
};