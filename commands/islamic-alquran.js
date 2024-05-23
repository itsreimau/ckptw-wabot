const {
    createAPIUrl
} = require("../tools/api.js");
const {
    bold,
    italic,
    monospace
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
    name: "alquran",
    aliases: ["quran"],
    category: "islamic",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true,
            coin: 3
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        if (!ctx._args.length)
            return ctx.reply(
                `${global.msg.argument} Bingung? Ketik ${monospace(`${ctx._used.prefix + ctx._used.command} list`)} untuk melihat daftar.\n` +
                `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} 21 35`)}`
            );

        if (ctx._args[0] === "list") {
            const listText = fs.readFileSync(path.resolve(__dirname, "../assets/txt/list-alquran.txt"), "utf8");

            return ctx.reply(`❖ ${bold("Daftar")}\n` + "\n" + `${listText}\n` + "\n" + global.msg.footer);
        }

        try {
            const [sura, aya] = ctx._args;
            const suraNumber = parseInt(sura);
            const ayaNumber = parseInt(aya);

            if (isNaN(sura) && isNaN(aya)) throw new Error("Gunakan angka.");

            if (suraNumber < 1 || suraNumber > 114) throw new Error(`Surah ${suraNumber} tidak ada.`);

            if (aya) {
                if (ayaNumber < 1) throw new Error("Ayat harus lebih dari 0.");

                const data = await fetchData(suraNumber, ayaNumber);

                if (!data) throw new Error(global.msg.notFound);

                return ctx.reply(formatAya(data));
            } else {
                const data = await fetchData(suraNumber);
                if (!data) throw new Error(global.msg.notFound);

                return ctx.reply(formatSura(data));
            }
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};

async function fetchData(sura, aya) {
    const apiUrl = createAPIUrl("https://api.quran.gading.dev", `/surah/${sura}/${aya || ""}`);

    try {
        const response = await axios.get(apiUrl);
        if (response.ok) {
            const json = await response.data;
            return json.data;
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
}

function formatAya(data) {
    return (
        `${bold("❖ Al-Quran")}\n` +
        "\n" +
        `${data.text.arab}\n` +
        `➤ ${italic(`${data.text.transliteration.en}`)}\n` +
        `➤ ${data.translation.id}\n` +
        `➤ Surah ${data.surah.name.transliteration.id}: ${data.number.inSurah}\n` +
        "\n" +
        global.msg.footer
    );
}

function formatSura(data) {
    const versesText = data.verses.map((verse) => {
        return `${bold(`Ayat ${toArabicNumeral(verse.number.inSurah)}:`)}\n` +
            `${verse.text.arab} (${verse.text.transliteration.en})\n` +
            `${italic(verse.translation.id)}`;
    }).join("\n");

    return `${bold("❖ Al-Quran")}\n` +
        "\n" +
        `➤ ${bold(`Surah ${data.name.transliteration.id}`)}\n` +
        `➤ ${data.revelation.id}\n` +
        `${versesText}\n` +
        "\n" +
        global.msg.footer;
}

function toArabicNumeral(number) {
    return number.toString().replace(/\d/g, (digit) => String.fromCodePoint(0x660 + parseInt(digit)));
}