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
    category: "tools",
    handler: {},
    code: async (ctx) => {
        const status = await handler(ctx, module.exports.handler);
        if (status) return;

        const [suratNumber, ayatInput] = await Promise.all([
            parseInt(ctx.args[0]),
            ctx.args[1]
        ]);

        if (!suratNumber && !ayatInput) return await ctx.reply(
            `${quote(`${tools.msg.generateInstruction(["send"], ["text"])}`)}\n` +
            `${quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "21 35"))}\n` +
            quote(tools.msg.generateNotes([`Ketik ${monospace(`${ctx._used.prefix + ctx._used.command} list`)} untuk melihat daftar.`]))
        );

        if (ctx.args[0] === "list") {
            const listText = await tools.list.get("alquran");
            return await ctx.reply(listText);
        }

        if (isNaN(suratNumber) || suratNumber < 1 || suratNumber > 114) return await ctx.reply(quote(`❎ Surah harus berupa nomor antara 1 dan 114!`));

        const apiUrl = tools.api.createUrl("https://equran.id", `/api/v2/surat/${suratNumber}`);
        const {
            data
        } = (await axios.get(apiUrl)).data;

        if (ayatInput) {
            if (isNaN(ayatInput)) return await ctx.reply(quote(`❎ Ayat harus berupa nomor yang valid!`));

            if (ayatInput.includes("-")) {
                const [startAya, endAya] = ayatInput.split("-").map(i => parseInt(i));

                if (isNaN(startAya) || isNaN(endAya) || startAya < 1 || endAya < startAya) return await ctx.reply(quote(`❎ Rentang ayat tidak valid!`));

                const verses = data.ayat.filter(d => d.nomorAyat >= startAya && d.nomorAyat <= endAya);
                if (verses.length === 0) return await ctx.reply(quote(`❎ Ayat dalam rentang ${startAya}-${endAya} tidak ada!`));

                const versesText = verses.map(v =>
                    `${bold(`Ayat ${v.nomorAyat}:`)}\n` +
                    `${v.teksArab} (${v.teksLatin})\n` +
                    `${italic(v.teksIndonesia)}`
                ).join("\n");
                return await ctx.reply(
                    `${bold(`Surah ${data.namaLatin}`)}\n` +
                    `${quote(`${data.arti}`)}\n` +
                    `${quote("─────")}\n` +
                    `${versesText}\n` +
                    "\n" +
                    config.msg.footer
                );
            } else {
                const ayatNumber = parseInt(ayatInput);
                if (isNaN(ayatNumber) || ayatNumber < 1) return await ctx.reply(quote(`❎ Ayat harus berupa nomor yang lebih besar dari 0!`));

                const ayat = data.ayat.find(d => d.nomorAyat === ayatNumber);
                if (!ayat) return await ctx.reply(quote(`❎ Ayat ${ayatNumber} tidak ada!`));

                return await ctx.reply(
                    `${ayat.teksArab} (${ayat.teksLatin})\n` +
                    `${italic(ayat.teksIndonesia)}\n` +
                    "\n" +
                    config.msg.footer
                );
            }
        } else {
            const versesText = data.ayat.map(d => `${bold(`Ayat ${d.nomorAyat}:`)}\n` +
                `${d.teksArab} (${d.teksLatin})\n` +
                `${italic(d.teksIndonesia)}`
            ).join("\n");
            return await ctx.reply(
                `${bold(`Surah ${data.namaLatin}`)}\n` +
                `${quote(`${data.arti}`)}\n` +
                `${quote("─────")}\n` +
                `${versesText}\n` +
                "\n" +
                config.msg.footer
            );
        }
    }
};