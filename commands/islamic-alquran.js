const {
    createAPIUrl
} = require('../lib/api.js');
const {
    bold,
    italic,
    monospace
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'alquran',
    aliases: ['quran'],
    category: 'islamic',
    code: async (ctx) => {
        if (!ctx._args.length) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} 21 35`)}`
        );

        const [sura, aya] = ctx._args;

        if (isNaN(sura)) return ctx.reply(`${bold('[ ! ]')} Gunakan format teks angka.`);

        if (aya && isNaN(aya)) return ctx.reply(`${bold('[ ! ]')} Gunakan angka untuk input parameter.`);

        const suraNumber = parseInt(sura);
        if (suraNumber < 1 || suraNumber > 114) return ctx.reply(`${bold('[ ! ]')} Maaf, surah nomor ${suraNumber} tidak ada.`);

        if (aya) {
            const ayaNumber = parseInt(aya);
            if (ayaNumber < 1) return ctx.reply(`${bold('[ ! ]')} Maaf, nomor ayat harus lebih dari 0.`);

            const data = await fetchData(suraNumber, ayaNumber);
            if (!data) {
                return ctx.reply(global.msg.notFound);
            }

            return ctx.reply(formatAya(data));
        } else {
            const data = await fetchData(suraNumber);
            if (!data) {
                return ctx.reply(global.msg.notFound);
            }

            return ctx.reply(formatSura(data));
        }
    }
};

async function fetchData(sura, aya) {
    const apiUrl = createAPIUrl('https://api.quran.gading.dev', `/surah/${sura}/${aya || ''}`);

    try {
        const response = await fetch(apiUrl);
        if (response.ok) {
            const json = await response.json();
            return json.data;
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
}

function formatAya(data) {
    return `${bold('❖ Al-Quran')}\n` +
        `\n` +
        `${data.text.arab}\n` +
        `• ${italic(`${data.text.transliteration.en}`)}\n` +
        `• ${data.translation.id}\n` +
        `• Surah ${data.surah.name.transliteration.id}: ${data.number.inSurah}\n` +
        `\n` +
        global.msg.footer;
}

function formatSura(data) {
    const versesText = data.verses.map(verse => {
        return `${bold(`Ayat ${toArabicNumeral(verse.number.inSurah)}:`)}\n` +
            `${verse.text.arab} (${verse.text.transliteration.en})\n` +
            `${italic(verse.translation.id)}`;
    }).join('\n');

    return `${bold('❖ Al-Quran')}\n` +
        `\n` +
        `• ${bold(`Surah ${data.name.transliteration.id}`)}\n` +
        `• ${data.revelation.id}\n` +
        `${versesText}\n` +
        `\n` +
        global.msg.footer;
}

function toArabicNumeral(number) {
    return number.toString()
        .replace(/\d/g, digit => (String.fromCodePoint(0x660 + parseInt(digit))));
}