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
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(tools.msg.generateCommandExample(`${ctx.used.prefix}${ctx.used.command}`, "21 35"))}\n` +
            `${quote(tools.msg.generateNotes([`Ketik ${monospace(`${ctx.used.prefix}${ctx.used.command} list`)} untuk melihat daftar.`]))}`
        );

        if (surat === "list") {
            const listText = await tools.list.get("alquran");
            return await ctx.reply(listText);
        }

        if (isNaN(surat) || surat < 1 || surat > 114) return await ctx.reply(quote(`❎ Surah harus berupa nomor antara 1 dan 114!`));

        try {
            const apiUrl = tools.api.createUrl("https://equran.id", `/api/v2/surat/${surat}`);
            const {
                data
            } = (await axios.get(apiUrl)).data;

            if (ayat) {
                if (ayat.includes("-")) {
                    const [startAyat, endAyat] = ayat.split("-").map(Number);

                    if (isNaN(startAyat) || isNaN(endAyat) || startAyat < 1 || endAyat < startAyat) return await ctx.reply(quote(`❎ Rentang ayat tidak valid!`));

                    const verses = data.ayat.filter(d => d.nomorAyat >= startAyat && d.nomorAyat <= endAyat);
                    if (!verses.length) return await ctx.reply(quote(`❎ Ayat dalam rentang ${startAyat}-${endAyat} tidak ada!`));

                    const versesText = verses.map(v =>
                        `${bold(`Ayat ${v.nomorAyat}:`)}\n` +
                        `${v.teksArab} (${v.teksLatin})\n` +
                        `${italic(v.teksIndonesia)}`
                    ).join("\n");
                    return await ctx.reply(
                        `${bold(`Surah ${data.namaLatin}`)}\n` +
                        `${quote(data.arti)}\n` +
                        `${quote("─────")}\n` +
                        `${versesText}\n` +
                        "\n" +
                        config.msg.footer
                    );
                }

                const singleAyat = parseInt(ayat);
                if (isNaN(singleAyat) || singleAyat < 1) return await ctx.reply(quote(`❎ Ayat harus berupa nomor yang valid dan lebih besar dari 0!`));

                const verse = data.ayat.find(d => d.nomorAyat === singleAyat);
                if (!verse) return await ctx.reply(quote(`❎ Ayat ${singleAyat} tidak ada!`));

                return await ctx.reply(
                    `${verse.teksArab} (${verse.teksLatin})\n` +
                    `${italic(verse.teksIndonesia)}\n` +
                    "\n" +
                    config.msg.footer
                );
            }

            const versesText = data.ayat.map(d =>
                `${bold(`Ayat ${d.nomorAyat}:`)}\n` +
                `${d.teksArab} (${d.teksLatin})\n` +
                `${italic(d.teksIndonesia)}`
            ).join("\n");
            return await ctx.reply(
                `${bold(`Surah ${data.namaLatin}`)}\n` +
                `${quote(data.arti)}\n` +
                `${quote("─────")}\n` +
                `${versesText}\n` +
                "\n" +
                config.msg.footer
            );
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};