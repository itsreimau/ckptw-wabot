const {
    bold,
    italic,
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "alquran",
    aliases: ["quran"],
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

        if (!ctx.args.length) return ctx.reply(
            `${quote(`⚠ ${await global.tools.msg.translate(`${await global.tools.msg.argument} Bingung? Ketik ${monospace(`${ctx._used.prefix + ctx._used.command} list`)} untuk melihat daftar.`, userLanguage)}`)}\n` +
            quote(`${await global.tools.msg.translate("Contoh", userLanguage)}: ${monospace(`${ctx._used.prefix + ctx._used.command} 21 35`)}`)
        );

        if (ctx.args[0] === "list") {
            const listText = await global.tools.list.get("alquran");
            return ctx.reply(listText);
        }

        try {
            const suraNumber = parseInt(ctx.args[0]);
            const ayaInput = ctx.args[1];

            if (isNaN(suraNumber) || suraNumber < 1 || suraNumber > 114) return ctx.reply(quote(`⚠ ${await global.tools.msg.translate(`Surah ${suraNumber} tidak ada.`, userLanguage)}`));

            const apiUrl = global.tools.api.createUrl("https://equran.id", `/api/v2/surat/${suraNumber}`);
            const response = await axios.get(apiUrl);
            const {
                data
            } = response.data;

            if (ayaInput) {
                if (ayaInput.includes("-")) {
                    const [startAya, endAya] = ayaInput.split("-").map(num => parseInt(num));

                    if (isNaN(startAya) || isNaN(endAya) || startAya < 1 || endAya < startAya) return ctx.reply(quote(`⚠ ${await global.tools.msg.translate(`Rentang ayat tidak valid.`, userLanguage)}`));

                    const verses = data.ayat.filter((d) => d.nomorAyat >= startAya && d.nomorAyat <= endAya);
                    if (verses.length === 0) return ctx.reply(quote(`⚠ ${await global.tools.msg.translate(`Ayat dalam rentang ${startAya}-${endAya} tidak ada.`, userLanguage)}`));

                    const translations = await Promise.all([
                        global.tools.msg.translate("Ayat", userLanguage)
                    ]);
                    const resultText = verses.map((d) => {
                        return `${bold(`${translations[0]} ${d.nomorAyat}:`)}\n` +
                            `${d.teksArab} (${d.teksLatin})\n` +
                            `${italic(d.teksIndonesia)}`;
                    }).join("\n");
                    return ctx.reply(
                        `${bold(`Surah ${data.namaLatin}`)}\n` +
                        `${quote(`${data.arti}`)}\n` +
                        `${quote("─────")}\n` +
                        `${resultText}\n` +
                        "\n" +
                        global.msg.footer
                    );
                } else {
                    const ayaNumber = parseInt(ayaInput);

                    if (isNaN(ayaNumber) || ayaNumber < 1) return ctx.reply(quote(`⚠ ${await global.tools.msg.translate(`Ayat harus lebih dari 0.`, userLanguage)}`));

                    const aya = data.ayat.find((d) => d.nomorAyat === ayaNumber);
                    if (!aya) return ctx.reply(quote(`⚠ ${await global.tools.msg.translate(`Ayat ${ayaNumber} tidak ada.`, userLanguage)}`));

                    return ctx.reply(
                        `${aya.teksArab} (${aya.teksLatin})\n` +
                        `${italic(aya.teksIndonesia)}\n` +
                        "\n" +
                        global.msg.footer
                    );
                }
            } else {
                const translations = await Promise.all([
                    global.tools.msg.translate("Ayat", userLanguage)
                ]);
                const resultText = data.ayat.map((d) => {
                    return `${bold(`${translations[0]} ${d.nomorAyat}:`)}\n` +
                        `${d.teksArab} (${d.teksLatin})\n` +
                        `${italic(d.teksIndonesia)}`;
                }).join("\n");
                return ctx.reply(
                    `${bold(`Surah ${data.namaLatin}`)}\n` +
                    `${quote(`${data.arti}`)}\n` +
                    `${quote("─────")}\n` +
                    `${resultText}\n` +
                    "\n" +
                    global.msg.footer
                );
            }
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(`⛔ ${await global.tools.msg.translate(global.msg.notFound, userLanguage)}`);
            return ctx.reply(quote(`⚠ ${await global.tools.msg.translate("Terjadi kesalahan", userLanguage)}: ${error.message}`));
        }
    }
};