const {
    italic,
    monospace,
    quote
} = require("@itsreimau/ckptw-mod");
const axios = require("axios");

module.exports = {
    name: "alquran",
    aliases: ["quran"],
    category: "tool",
    permissions: {},
    code: async (ctx) => {
        const [surat, ayat] = ctx.args;

        if (!surat && !ayat) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(tools.msg.generateCommandExample(ctx.used, "21 35"))}\n` +
            `${quote(tools.msg.generateNotes([`Ketik ${monospace(`${ctx.used.prefix + ctx.used.command} list`)} untuk melihat daftar.`]))}`
        );

        if (["l", "list"].includes(surat.toLowerCase())) {
            const listText = await tools.list.get("alquran");
            return await ctx.reply(listText);
        }

        if (isNaN(surat) || surat < 1 || surat > 114) return await ctx.reply(quote("❎ Surah harus berupa nomor antara 1 sampai 114!"));

        try {
            const apiUrl = tools.api.createUrl("nekorinn", "/religious/nuquran-surah", {
                id: surat
            });
            const result = (await axios.get(apiUrl)).data.result;

            const verses = result.verses;

            if (ayat) {
                if (ayat.includes("-")) {
                    const [startAyat, endAyat] = ayat.split("-").map(Number);

                    if (isNaN(startAyat) || isNaN(endAyat) || startAyat < 1 || endAyat < startAyat) return await ctx.reply(quote("❎ Rentang ayat tidak valid!"));

                    const selectedVerses = verses.filter(v => v.number >= startAyat && v.number <= endAyat);
                    if (!selectedVerses.length) return await ctx.reply(quote(`❎ Ayat dalam rentang ${startAyat}-${endAyat} tidak ada!`));

                    const versesText = selectedVerses.map(v =>
                        `${quote(`Ayat ${v.number}:`)}\n` +
                        `${v.text} (${v.transliteration})\n` +
                        `${italic(v.translation_id)}`
                    ).join("\n");
                    return await ctx.reply(
                        `${quote(`Surat: ${result.name}`)}\n` +
                        `${quote(`Arti: ${result.translate}`)}\n` +
                        `${quote("─────")}\n` +
                        `${versesText}\n` +
                        "\n" +
                        config.msg.footer
                    );
                }

                const singleAyat = parseInt(ayat);
                if (isNaN(singleAyat) || singleAyat < 1) return await ctx.reply(quote("❎ Ayat harus berupa nomor yang valid dan lebih besar dari 0!"));

                const verse = verses.find(v => v.number === singleAyat);
                if (!verse) return await ctx.reply(quote(`❎ Ayat ${singleAyat} tidak ada!`));

                return await ctx.reply(
                    `${quote(`Surat: ${result.name}`)}\n` +
                    `${quote(`Arti: ${result.translate}`)}\n` +
                    `${quote("─────")}\n` +
                    `${verse.text} (${verse.transliteration})\n` +
                    `${italic(verse.translation_id)}\n` +
                    "\n" +
                    config.msg.footer
                );
            }

            const versesText = verses.map(v =>
                `${quote(`Ayat ${v.number}:`)}\n` +
                `${v.text} (${v.transliteration})\n` +
                `${italic(v.translation_id)}`
            ).join("\n");
            return await ctx.reply(
                `${quote(`Surah ${result.name}`)}\n` +
                `${quote(result.translate)}\n` +
                `${quote("─────")}\n` +
                `${versesText}\n\n` +
                "\n" +
                config.msg.footer
            );
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};