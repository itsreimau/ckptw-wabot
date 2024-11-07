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
    handler: {
        banned: true,
        cooldown: true
    },
    code: async (ctx) => {
        const status = await handler(ctx, module.exports.handler);
        if (status) return;

        const [suraNumber, ayaInput] = await Promise.all([
            parseInt(ctx.args[0]),
            ctx.args[1]
        ]);

        if (!ctx.args.length) return await ctx.reply(
            `${quote(`${tools.msg.generateInstruction(["send"], ["text"])}`)}\n` +
            `${quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "21 35"))}\n` +
            quote(tools.msg.generateNotes([`Ketik ${monospace(`${ctx._used.prefix + ctx._used.command} list`)} untuk melihat daftar.`]))
        );

        if (ctx.args[0] === "list") {
            const listText = await tools.list.get("alquran");
            return await ctx.reply(listText);
        }

        try {
            if (isNaN(suraNumber) || suraNumber < 1 || suraNumber > 114) return await ctx.reply(quote(`❎ Surah ${suraNumber} tidak ada.`));

            const apiUrl = tools.api.createUrl("https://equran.id", `/api/v2/surat/${suraNumber}`);
            const {
                data
            } = (await axios.get(apiUrl)).data;

            if (ayaInput) {
                if (ayaInput.includes("-")) {
                    const [startAya, endAya] = ayaInput.split("-").map(num => parseInt(num));

                    if (isNaN(startAya) || isNaN(endAya) || startAya < 1 || endAya < startAya) return await ctx.reply(quote(`❎ Rentang ayat tidak valid.`));

                    const verses = data.ayat.filter((d) => d.nomorAyat >= startAya && d.nomorAyat <= endAya);
                    if (verses.length === 0) return await ctx.reply(quote(`❎ Ayat dalam rentang ${startAya}-${endAya} tidak ada.`));

                    const versesText = verses.map((d) => {
                        return `${bold(`Ayat ${d.nomorAyat}:`)}\n` +
                            `${d.teksArab} (${d.teksLatin})\n` +
                            `${italic(d.teksIndonesia)}`;
                    }).join("\n");

                    return await ctx.reply(
                        `${bold(`Surah ${data.namaLatin}`)}\n` +
                        `${quote(`${data.arti}`)}\n` +
                        `${quote("─────")}\n` +
                        `${versesText}\n` +
                        "\n" +
                        config.msg.footer
                    );
                } else {
                    const ayaNumber = parseInt(ayaInput);

                    if (isNaN(ayaNumber) || ayaNumber < 1) return await ctx.reply(quote(`❎ Ayat harus lebih dari 0.`));

                    const aya = data.ayat.find((d) => d.nomorAyat === ayaNumber);
                    if (!aya) return await ctx.reply(quote(`❎ Ayat ${ayaNumber} tidak ada.`));

                    return await ctx.reply(
                        `${aya.teksArab} (${aya.teksLatin})\n` +
                        `${italic(aya.teksIndonesia)}\n` +
                        "\n" +
                        config.msg.footer
                    );
                }
            } else {
                const versesText = data.ayat.map((d) => {
                    return `${bold(`Ayat ${d.nomorAyat}:`)}\n` +
                        `${d.teksArab} (${d.teksLatin})\n` +
                        `${italic(d.teksIndonesia)}`;
                }).join("\n");
                return await ctx.reply(
                    `${bold(`Surah ${data.namaLatin}`)}\n` +
                    `${quote(`${data.arti}`)}\n` +
                    `${quote("─────")}\n` +
                    `${versesText}\n` +
                    "\n" +
                    config.msg.footer
                );
            }
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};