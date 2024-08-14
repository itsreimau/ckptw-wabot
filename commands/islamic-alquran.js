const {
    getList
} = require("../tools/list.js");
const {
    createAPIUrl
} = require("../tools/api.js");
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
            coin: 3
        });
        if (status) return ctx.reply(message);

        if (!ctx._args.length) return ctx.reply(
            `${global.msg.argument} Bingung? Ketik ${monospace(`${ctx._used.prefix + ctx._used.command} list`)} untuk melihat daftar.\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} 21 35`)}`
        );

        if (ctx._args[0] === "list") {
            const listText = await getList("alquran");

            return ctx.reply(listText);
        }

        try {
            const suraNumber = parseInt(ctx._args[0]);
            const ayaNumber = parseInt(ctx._args[1]);

            if (isNaN(suraNumber) || suraNumber < 1 || suraNumber > 114) return ctx.reply(`${bold("[ ! ]")} Surah ${suraNumber} tidak ada.`);

            if (ayaNumber && (isNaN(ayaNumber) || ayaNumber < 1)) return ctx.reply(`${bold("[ ! ]")} Ayat harus lebih dari 0.`);

            const apiUrl = createAPIUrl("https://equran.id", `/api/v2/surat/${suraNumber}`);
            const response = await axios.get(apiUrl);
            const {
                data
            } = response.data;

            if (ayaNumber) {
                const aya = data.ayat.find((verse) => verse.nomorAyat === ayaNumber);
                if (!aya) return ctx.reply(`${bold("[ ! ]")} Ayat ${ayaNumber} tidak ada.`);

                return ctx.reply(
                    `${aya.teksArab} (${aya.teksLatin})\n` +
                    `${italic(aya.teksIndonesia)}\n` +
                    "\n" +
                    global.msg.footer
                );
            } else {
                const versesText = data.ayat.map((verse) => {
                    return `${bold(`Ayat ${verse.nomorAyat}:`)}\n` +
                        `${verse.teksArab} (${verse.teksLatin})\n` +
                        `${italic(verse.teksIndonesia)}`;
                }).join("\n");
                return ctx.reply(
                    `${bold(`Surah ${data.namaLatin}`)}\n` +
                    `${quote(`${data.arti}`)}\n` +
                    "-----\n"
                    `${versesText}\n` +
                    "\n" +
                    global.msg.footer
                );
            }
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};