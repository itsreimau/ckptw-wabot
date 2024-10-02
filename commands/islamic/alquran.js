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
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            cooldown: true
        });
        if (status) return ctx.reply(message);

        if (!ctx.args.length) return ctx.reply(
            `${quote(`${global.tools.msg.generateInstruction(["send"], ["text"])} Bingung? Ketik ${monospace(`${ctx._used.prefix + ctx._used.command} list`)} untuk melihat daftar.`)}\n` +
            quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "21 35"))
        );

        if (ctx.args[0] === "list") {
            const listText = await global.tools.list.get("alquran");
            return ctx.reply(listText);
        }

        try {
            const suraNumber = parseInt(ctx.args[0]);
            const ayaInput = ctx.args[1];

            if (isNaN(suraNumber) || suraNumber < 1 || suraNumber > 114) return ctx.reply(quote(`❎ Surah ${suraNumber} tidak ada.`));

            const apiUrl = global.tools.api.createUrl("https://equran.id", `/api/v2/surat/${suraNumber}`);
            const {
                data
            } = (await axios.get(apiUrl)).data;

            if (ayaInput) {
                if (ayaInput.includes("-")) {
                    const [startAya, endAya] = ayaInput.split("-").map(num => parseInt(num));

                    if (isNaN(startAya) || isNaN(endAya) || startAya < 1 || endAya < startAya) return ctx.reply(quote(`❎ Rentang ayat tidak valid.`));

                    const verses = data.ayat.filter((d) => d.nomorAyat >= startAya && d.nomorAyat <= endAya);
                    if (verses.length === 0) return ctx.reply(quote(`❎ Ayat dalam rentang ${startAya}-${endAya} tidak ada.`));

                    const versesText = verses.map((d) => {
                        return `${bold(`Ayat ${d.nomorAyat}:`)}\n` +
                            `${d.teksArab} (${d.teksLatin})\n` +
                            `${italic(d.teksIndonesia)}`;
                    }).join("\n");

                    return ctx.reply(
                        `${bold(`Surah ${data.namaLatin}`)}\n` +
                        `${quote(`${data.arti}`)}\n` +
                        `${quote("─────")}\n` +
                        `${versesText}\n` +
                        "\n" +
                        global.config.msg.footer
                    );
                } else {
                    const ayaNumber = parseInt(ayaInput);

                    if (isNaN(ayaNumber) || ayaNumber < 1) return ctx.reply(quote(`❎ Ayat harus lebih dari 0.`));

                    const aya = data.ayat.find((d) => d.nomorAyat === ayaNumber);
                    if (!aya) return ctx.reply(quote(`❎ Ayat ${ayaNumber} tidak ada.`));

                    return ctx.reply(
                        `${aya.teksArab} (${aya.teksLatin})\n` +
                        `${italic(aya.teksIndonesia)}\n` +
                        "\n" +
                        global.config.msg.footer
                    );
                }
            } else {
                const versesText = data.ayat.map((d) => {
                    return `${bold(`Ayat ${d.nomorAyat}:`)}\n` +
                        `${d.teksArab} (${d.teksLatin})\n` +
                        `${italic(d.teksIndonesia)}`;
                }).join("\n");
                return ctx.reply(
                    `${bold(`Surah ${data.namaLatin}`)}\n` +
                    `${quote(`${data.arti}`)}\n` +
                    `${quote("─────")}\n` +
                    `${versesText}\n` +
                    "\n" +
                    global.config.msg.footer
                );
            }
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            if (error.status !== 200) return ctx.reply(global.config.msg.notFound);
            return ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};