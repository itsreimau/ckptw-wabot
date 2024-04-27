const {
    handler
} = require('../handler.js');
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
        const handlerObj = await handler(ctx, {
            banned: true
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        if (!ctx._args.length) return ctx.reply(
            `${global.msg.argument} Bingung? Ketik ${monospace(`${ctx._used.prefix + ctx._used.command} list`)} untuk melihat daftar.\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} 21 35`)}`
        );

        if (ctx._args[0] === 'list') {
            const resultText = await getList();

            return ctx.reply(
                `❖ ${bold('Daftar')}\n` +
                '\n' +
                `${resultText}\n` +
                '\n' +
                global.msg.footer
            );
        }
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
                throw new Error(global.msg.notFound);
            }

            return ctx.reply(formatAya(data));
        } else {
            const data = await fetchData(suraNumber);
            if (!data) {
                throw new Error(global.msg.notFound);
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

function getList() {
    return `➤ Surah: Al-Fatihah (1)\n` +
        `➤ Ayat: 7\n` +
        `-----\n` +
        `➤ Surah: Al-Baqarah (2)\n` +
        `➤ Ayat: 286\n` +
        `-----\n` +
        `➤ Surah: Al-Imran (3)\n` +
        `➤ Ayat: 200\n` +
        `-----\n` +
        `➤ Surah: An-Nisa' (4)\n` +
        `➤ Ayat: 176\n` +
        `-----\n` +
        `➤ Surah: Al-Ma'idah (5)\n` +
        `➤ Ayat: 120\n` +
        `-----\n` +
        `➤ Surah: Al-An'am (6)\n` +
        `➤ Ayat: 165\n` +
        `-----\n` +
        `➤ Surah: Al-A'raf (7)\n` +
        `➤ Ayat: 206\n` +
        `-----\n` +
        `➤ Surah: Al-Anfal (8)\n` +
        `➤ Ayat: 75\n` +
        `-----\n` +
        `➤ Surah: At-Tawbah (9)\n` +
        `➤ Ayat: 129\n` +
        `-----\n` +
        `➤ Surah: Yunus (10)\n` +
        `➤ Ayat: 109\n` +
        `-----\n` +
        `➤ Surah: Hud (11)\n` +
        `➤ Ayat: 123\n` +
        `-----\n` +
        `➤ Surah: Yusuf (12)\n` +
        `➤ Ayat: 111\n` +
        `-----\n` +
        `➤ Surah: Ar-Ra'd (13)\n` +
        `➤ Ayat: 43\n` +
        `-----\n` +
        `➤ Surah: Ibrahim (14)\n` +
        `➤ Ayat: 52\n` +
        `-----\n` +
        `➤ Surah: Al-Hijr (15)\n` +
        `➤ Ayat: 99\n` +
        `-----\n` +
        `➤ Surah: An-Nahl (16)\n` +
        `➤ Ayat: 128\n` +
        `-----\n` +
        `➤ Surah: Al-Isra' (17)\n` +
        `➤ Ayat: 111\n` +
        `-----\n` +
        `➤ Surah: Al-Kahf (18)\n` +
        `➤ Ayat: 110\n` +
        `-----\n` +
        `➤ Surah: Maryam (19)\n` +
        `➤ Ayat: 98\n` +
        `-----\n` +
        `➤ Surah: Ta-Ha (20)\n` +
        `➤ Ayat: 135\n` +
        `-----\n` +
        `➤ Surah: Al-Anbiya' (21)\n` +
        `➤ Ayat: 112\n` +
        `-----\n` +
        `➤ Surah: Al-Hajj (22)\n` +
        `➤ Ayat: 78\n` +
        `-----\n` +
        `➤ Surah: Al-Mu'minun (23)\n` +
        `➤ Ayat: 118\n` +
        `-----\n` +
        `➤ Surah: An-Nur (24)\n` +
        `➤ Ayat: 64\n` +
        `-----\n` +
        `➤ Surah: Al-Furqan (25)\n` +
        `➤ Ayat: 77\n` +
        `-----\n` +
        `➤ Surah: Ash-Shu'ara' (26)\n` +
        `➤ Ayat: 227\n` +
        `-----\n` +
        `➤ Surah: An-Naml (27)\n` +
        `➤ Ayat: 93\n` +
        `-----\n` +
        `➤ Surah: Al-Qasas (28)\n` +
        `➤ Ayat: 88\n` +
        `-----\n` +
        `➤ Surah: Al-Ankabut (29)\n` +
        `➤ Ayat: 69\n` +
        `-----\n` +
        `➤ Surah: Ar-Rum (30)\n` +
        `➤ Ayat: 60\n` +
        `-----\n` +
        `➤ Surah: Luqman (31)\n` +
        `➤ Ayat: 34\n` +
        `-----\n` +
        `➤ Surah: As-Sajda (32)\n` +
        `➤ Ayat: 30\n` +
        `-----\n` +
        `➤ Surah: Al-Ahzab (33)\n` +
        `➤ Ayat: 73\n` +
        `-----\n` +
        `➤ Surah: Saba' (34)\n` +
        `➤ Ayat: 54\n` +
        `-----\n` +
        `➤ Surah: Fatir (35)\n` +
        `➤ Ayat: 45\n` +
        `-----\n` +
        `➤ Surah: Ya-Sin (36)\n` +
        `➤ Ayat: 83\n` +
        `-----\n` +
        `➤ Surah: As-Saffat (37)\n` +
        `➤ Ayat: 182\n` +
        `-----\n` +
        `➤ Surah: Sad (38)\n` +
        `➤ Ayat: 88\n` +
        `-----\n` +
        `➤ Surah: Az-Zumar (39)\n` +
        `➤ Ayat: 75\n` +
        `-----\n` +
        `➤ Surah: Ghafir (40)\n` +
        `➤ Ayat: 85\n` +
        `-----\n` +
        `➤ Surah: Fussilat (41)\n` +
        `➤ Ayat: 54\n` +
        `-----\n` +
        `➤ Surah: Ash-Shura (42)\n` +
        `➤ Ayat: 53\n` +
        `-----\n` +
        `➤ Surah: Az-Zukhruf (43)\n` +
        `➤ Ayat: 89\n` +
        `-----\n` +
        `➤ Surah: Ad-Dukhan (44)\n` +
        `➤ Ayat: 59\n` +
        `-----\n` +
        `➤ Surah: Al-Jathiyah (45)\n` +
        `➤ Ayat: 37\n` +
        `-----\n` +
        `➤ Surah: Al-Ahqaf (46)\n` +
        `➤ Ayat: 35\n` +
        `-----\n` +
        `➤ Surah: Muhammad (47)\n` +
        `➤ Ayat: 38\n` +
        `-----\n` +
        `➤ Surah: Al-Fath (48)\n` +
        `➤ Ayat: 29\n` +
        `-----\n` +
        `➤ Surah: Al-Hujurat (49)\n` +
        `➤ Ayat: 18\n` +
        `-----\n` +
        `➤ Surah: Qaf (50)\n` +
        `➤ Ayat: 45\n` +
        `-----\n` +
        `➤ Surah: Adh-Dhariyat (51)\n` +
        `➤ Ayat: 60\n` +
        `-----\n` +
        `➤ Surah: At-Tur (52)\n` +
        `➤ Ayat: 49\n` +
        `-----\n` +
        `➤ Surah: An-Najm (53)\n` +
        `➤ Ayat: 62\n` +
        `-----\n` +
        `➤ Surah: Al-Qamar (54)\n` +
        `➤ Ayat: 55\n` +
        `-----\n` +
        `➤ Surah: Ar-Rahman (55)\n` +
        `➤ Ayat: 78\n` +
        `-----\n` +
        `➤ Surah: Al-Waqi'ah (56)\n` +
        `➤ Ayat: 96\n` +
        `-----\n` +
        `➤ Surah: Al-Hadid (57)\n` +
        `➤ Ayat: 29\n` +
        `-----\n` +
        `➤ Surah: Al-Mujadila (58)\n` +
        `➤ Ayat: 22\n` +
        `-----\n` +
        `➤ Surah: Al-Hashr (59)\n` +
        `➤ Ayat: 24\n` +
        `-----\n` +
        `➤ Surah: Al-Mumtahanah (60)\n` +
        `➤ Ayat: 13\n` +
        `-----\n` +
        `➤ Surah: As-Saff (61)\n` +
        `➤ Ayat: 14\n` +
        `-----\n` +
        `➤ Surah: Al-Jumu'ah (62)\n` +
        `➤ Ayat: 11\n` +
        `-----\n` +
        `➤ Surah: Al-Munafiqun (63)\n` +
        `➤ Ayat: 11\n` +
        `-----\n` +
        `➤ Surah: At-Taghabun (64)\n` +
        `➤ Ayat: 18\n` +
        `-----\n` +
        `➤ Surah: At-Talaq (65)\n` +
        `➤ Ayat: 12\n` +
        `-----\n` +
        `➤ Surah: At-Tahrim (66)\n` +
        `➤ Ayat: 12\n` +
        `-----\n` +
        `➤ Surah: Al-Mulk (67)\n` +
        `➤ Ayat: 30\n` +
        `-----\n` +
        `➤ Surah: Al-Qalam (68)\n` +
        `➤ Ayat: 52\n` +
        `-----\n` +
        `➤ Surah: Al-Haqqah (69)\n` +
        `➤ Ayat: 52\n` +
        `-----\n` +
        `➤ Surah: Al-Ma'arij (70)\n` +
        `➤ Ayat: 44\n` +
        `-----\n` +
        `➤ Surah: Nuh (71)\n` +
        `➤ Ayat: 28\n` +
        `-----\n` +
        `➤ Surah: Al-Jinn (72)\n` +
        `➤ Ayat: 28\n` +
        `-----\n` +
        `➤ Surah: Al-Muzzammil (73)\n` +
        `➤ Ayat: 20\n` +
        `-----\n` +
        `➤ Surah: Al-Muddathir (74)\n` +
        `➤ Ayat: 56\n` +
        `-----\n` +
        `➤ Surah: Al-Qiyamah (75)\n` +
        `➤ Ayat: 40\n` +
        `-----\n` +
        `➤ Surah: Al-Insan (76)\n` +
        `➤ Ayat: 31\n` +
        `-----\n` +
        `➤ Surah: Al-Mursalat (77)\n` +
        `➤ Ayat: 50\n` +
        `-----\n` +
        `➤ Surah: An-Naba' (78)\n` +
        `➤ Ayat: 40\n` +
        `-----\n` +
        `➤ Surah: An-Nazi'at (79)\n` +
        `➤ Ayat: 46\n` +
        `-----\n` +
        `➤ Surah: 'Abasa (80)\n` +
        `➤ Ayat: 42\n` +
        `-----\n` +
        `➤ Surah: At-Takwir (81)\n` +
        `➤ Ayat: 29\n` +
        `-----\n` +
        `➤ Surah: Al-Infitar (82)\n` +
        `➤ Ayat: 19\n` +
        `-----\n` +
        `➤ Surah: Al-Mutaffifin (83)\n` +
        `➤ Ayat: 36\n` +
        `-----\n` +
        `➤ Surah: Al-Inshiqaq (84)\n` +
        `➤ Ayat: 25\n` +
        `-----\n` +
        `➤ Surah: Al-Buruj (85)\n` +
        `➤ Ayat: 22\n` +
        `-----\n` +
        `➤ Surah: At-Tariq (86)\n` +
        `➤ Ayat: 17\n` +
        `-----\n` +
        `➤ Surah: Al-A'la (87)\n` +
        `➤ Ayat: 19\n` +
        `-----\n` +
        `➤ Surah: Al-Ghashiyah (88)\n` +
        `➤ Ayat: 26\n` +
        `-----\n` +
        `➤ Surah: Al-Fajr (89)\n` +
        `➤ Ayat: 30\n` +
        `-----\n` +
        `➤ Surah: Al-Balad (90)\n` +
        `➤ Ayat: 20\n` +
        `-----\n` +
        `➤ Surah: Ash-Shams (91)\n` +
        `➤ Ayat: 15\n` +
        `-----\n` +
        `➤ Surah: Al-Lail (92)\n` +
        `➤ Ayat: 21\n` +
        `-----\n` +
        `➤ Surah: Ad-Duha (93)\n` +
        `➤ Ayat: 11\n` +
        `-----\n` +
        `➤ Surah: Ash-Sharh (94)\n` +
        `➤ Ayat: 8\n` +
        `-----\n` +
        `➤ Surah: At-Tin (95)\n` +
        `➤ Ayat: 8\n` +
        `-----\n` +
        `➤ Surah: Al-'Alaq (96)\n` +
        `➤ Ayat: 19\n` +
        `-----\n` +
        `➤ Surah: Al-Qadr (97)\n` +
        `➤ Ayat: 5\n` +
        `-----\n` +
        `➤ Surah: Al-Bayyinah (98)\n` +
        `➤ Ayat: 8\n` +
        `-----\n` +
        `➤ Surah: Az-Zalzalah (99)\n` +
        `➤ Ayat: 8\n` +
        `-----\n` +
        `➤ Surah: Al-'Adiyat (100)\n` +
        `➤ Ayat: 11\n` +
        `-----\n` +
        `➤ Surah: Al-Qari'ah (101)\n` +
        `➤ Ayat: 11\n` +
        `-----\n` +
        `➤ Surah: At-Takathur (102)\n` +
        `➤ Ayat: 8\n` +
        `-----\n` +
        `➤ Surah: Al-'Asr (103)\n` +
        `➤ Ayat: 3\n` +
        `-----\n` +
        `➤ Surah: Al-Humazah (104)\n` +
        `➤ Ayat: 9\n` +
        `-----\n` +
        `➤ Surah: Al-Fil (105)\n` +
        `➤ Ayat: 5\n` +
        `-----\n` +
        `➤ Surah: Quraish (106)\n` +
        `➤ Ayat: 4\n` +
        `-----\n` +
        `➤ Surah: Al-Ma'un (107)\n` +
        `➤ Ayat: 7\n` +
        `-----\n` +
        `➤ Surah: Al-Kawthar (108)\n` +
        `➤ Ayat: 3\n` +
        `-----\n` +
        `➤ Surah: Al-Kafirun (109)\n` +
        `➤ Ayat: 6\n` +
        `-----\n` +
        `➤ Surah: An-Nasr (110)\n` +
        `➤ Ayat: 3\n` +
        `-----\n` +
        `➤ Surah: Al-Masad (111)\n` +
        `➤ Ayat: 5\n` +
        `-----\n` +
        `➤ Surah: Al-Ikhlas (112)\n` +
        `➤ Ayat: 4\n` +
        `-----\n` +
        `➤ Surah: Al-Falaq (113)\n` +
        `➤ Ayat: 5\n` +
        `-----\n` +
        `➤ Surah: An-Nas (114)\n` +
        `➤ Ayat: 6`
}

function formatAya(data) {
    return `${bold('❖ Al-Quran')}\n` +
        '\n' +
        `${data.text.arab}\n` +
        `➤ ${italic(`${data.text.transliteration.en}`)}\n` +
        `➤ ${data.translation.id}\n` +
        `➤ Surah ${data.surah.name.transliteration.id}: ${data.number.inSurah}\n` +
        '\n' +
        global.msg.footer;
}

function formatSura(data) {
    const versesText = data.verses.map(verse => {
        return `${bold(`Ayat ${toArabicNumeral(verse.number.inSurah)}:`)}\n` +
            `${verse.text.arab} (${verse.text.transliteration.en})\n` +
            `${italic(verse.translation.id)}`;
    }).join('\n');

    return `${bold('❖ Al-Quran')}\n` +
        '\n' +
        `➤ ${bold(`Surah ${data.name.transliteration.id}`)}\n` +
        `➤ ${data.revelation.id}\n` +
        `${versesText}\n` +
        '\n' +
        global.msg.footer;
}

function toArabicNumeral(number) {
    return number.toString()
        .replace(/\d/g, digit => (String.fromCodePoint(0x660 + parseInt(digit))));
}