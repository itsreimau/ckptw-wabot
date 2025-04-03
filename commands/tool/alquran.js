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
    category: "tool",
    permissions: {},
    code: async (ctx) => {
        const [surat, ayat] = ctx.args;

        if (!surat && !ayat) return await ctx.reply(
            `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(tools.cmd.generateCommandExample(`${ctx.used.prefix}${ctx.used.command}`, "21 35"))}\n` +
            `${quote(tools.cmd.generateNotes([`Ketik ${monospace(`${ctx.used.prefix}${ctx.used.command} list`)} untuk melihat daftar.`]))}`
        );

        if (surat === "list") {
            const listText = await tools.list.get("alquran");
            return await ctx.reply(listText);
        }

        if (isNaN(surat) || surat < 1 || surat > 114) return await ctx.reply(quote(`❎ Surah harus berupa nomor antara 1 dan 114!`));

        try {
            const apiUrl = tools.api.createUrl("https://equran.id", `/api/v2/surat/${surat}`);
            const result = (await axios.get(apiUrl)).data.data;

            if (ayat) {
                if (ayat.includes("-")) {
                    const [startAyat, endAyat] = ayat.split("-").map(Number);

                    if (isNaN(startAyat) || isNaN(endAyat) || startAyat < 1 || endAyat < startAyat) return await ctx.reply(quote(`❎ Rentang ayat tidak valid!`));

                    const verses = result.ayat.filter(r => r.nomorAyat >= startAyat && r.nomorAyat <= endAyat);
                    if (!verses.length) return await ctx.reply(quote(`❎ Ayat dalam rentang ${startAyat}-${endAyat} tidak ada!`));

                    const versesText = verses.map(r =>
                        `${bold(`Ayat ${r.nomorAyat}:`)}\n` +
                        `${r.teksArab} (${r.teksLatin})\n` +
                        `${italic(r.teksIndonesia)}`
                    ).join("\n");
                    return await ctx.reply(
                        `${bold(`Surah ${result.namaLatin}`)}\n` +
                        `${quote(result.arti)}\n` +
                        `${quote("─────")}\n` +
                        `${versesText}\n` +
                        "\n" +
                        config.msg.footer
                    );
                }

                const singleAyat = parseInt(ayat);
                if (isNaN(singleAyat) || singleAyat < 1) return await ctx.reply(quote(`❎ Ayat harus berupa nomor yang valid dan lebih besar dari 0!`));

                const verse = result.ayat.find(r => r.nomorAyat === singleAyat);
                if (!verse) return await ctx.reply(quote(`❎ Ayat ${singleAyat} tidak ada!`));

                return await ctx.reply(
                    `${verse.teksArab} (${verse.teksLatin})\n` +
                    `${italic(verse.teksIndonesia)}\n` +
                    "\n" +
                    config.msg.footer
                );
            }

            const versesText = result.ayat.map(r =>
                `${bold(`Ayat ${r.nomorAyat}:`)}\n` +
                `${r.teksArab} (${r.teksLatin})\n` +
                `${italic(r.teksIndonesia)}`
            ).join("\n");
            return await ctx.reply(
                `${bold(`Surah ${result.namaLatin}`)}\n` +
                `${quote(result.arti)}\n` +
                `${quote("─────")}\n` +
                `${versesText}\n` +
                "\n" +
                config.msg.footer
            );
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};