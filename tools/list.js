const api = require('./api.js');
const general = require('./general.js');
const shared = require('./shared.js');
const package = require('../package.json');

async function get(type, ctx) {
    let text = "";

    switch (type) {
        case "alkitab":
            try {
                const apiUrl = api.createUrl("https://beeble.vercel.app", "/api/v1/passage/list", {});
                const response = await shared.axios.get(apiUrl);
                const data = response.data;
                const passages = data.data;

                text = "❖ Daftar Buku Alkitab\n" +
                    "\n";
                passages.forEach(book => {
                    text += `➲ Buku: ${book.name} (${book.abbr})\n`;
                    text += `➲ Bab: ${book.chapter}\n`;
                    text += "-----\n";
                });

                text += global.msg.footer;
            } catch (error) {
                text = `${shared.bold("[ ! ]")} Terjadi kesalahan saat mengambil data Alkitab.`;
            }
            break;
        case "alquran":
            try {
                const apiUrl = api.createUrl("https://equran.id", "/api/v2/surat", {});
                const response = await shared.axios.get(apiUrl);
                const data = response.data;
                const surahs = data.data;
                text =
                    "❖ Daftar Surah Al-Quran\n" +
                    "\n";
                surahs.forEach(surah => {
                    text += `➲ Surah: ${surah.namaLatin} (${surah.nomor})\n`;
                    text += `➲ Ayat: ${surah.jumlahAyat}\n`;
                    text += "-----\n";
                });

                text += global.msg.footer;
            } catch (error) {
                text = `${shared.bold("[ ! ]")} Terjadi kesalahan saat mengambil data Al-Quran.`;
            }
            break;
        case "disable_enable": {
            const list = ["antilink", "welcome"];

            text =
                "❖ Daftar\n" +
                "\n" +
                `➲ ${list.join("\n➲ ")}\n` +
                "\n" +
                global.msg.footer;
        }
        break;
        case "menu": {
            const commandsMap = ctx._self.cmd;
            const tags = {
                "main": "Main",
                "ai": "AI",
                "game": "Game",
                "converter": "Converter",
                "downloader": "Downloader",
                "fun": "Fun",
                "group": "Group",
                "islamic": "Islamic",
                "internet": "Internet",
                "maker": "Maker",
                "tools": "Tools",
                "owner": "Owner",
                "info": "Info",
                "": "No Category"
            };

            if (!commandsMap || commandsMap.size === 0) return `${shared.bold("[ ! ]")} Terjadi kesalahan: Tidak ada perintah yang ditemukan.`;

            const sortedCategories = Object.keys(tags);

            const readmore = "\u200E".repeat(4001);
            text =
                `Hai ${ctx._sender.pushName || "Kak"}, berikut adalah daftar perintah yang tersedia!\n` +
                "\n" +
                `╭ ➲ Waktu aktif: ${general.convertMsToDuration(Date.now() - global.system.startTime) || "kurang dari satu detik."}\n` +
                `│ ➲ Tanggal: ${shared.moment.tz(global.system.timeZone).format("DD/MM/YY")}\n` +
                `│ ➲ Waktu: ${shared.moment.tz(global.system.timeZone).format("HH:mm:ss")}\n` +
                `│ ➲ Versi: ${package.version}\n` +
                `╰ ➲ Prefix: ${ctx._used.prefix}\n` +
                "\n" +
                `${shared.quote("Jangan lupa berdonasi agar bot tetap online!")}\n` +
                `${global.msg.readmore}\n`;

            for (const category of sortedCategories) {
                const categoryCommands = Array.from(commandsMap.values())
                    .filter((command) => command.category === category)
                    .map((command) => ({
                        name: command.name,
                        aliases: command.aliases
                    }));

                if (categoryCommands.length > 0) {
                    text += `╭─「 ${shared.bold(tags[category])} 」\n`;

                    if (category === "main") {
                        text += `│ ➲ ${categoryCommands.map((cmd) => `${ctx._used.prefix || "/"}${cmd.name}${cmd.aliases ? `\n│ ➲ ${cmd.aliases.map((alias) => `${ctx._used.prefix || "/"}${alias}`).join("\n│ ➲ ")}` : ""}`).join("\n│ ➲ ")}\n`;
                    } else {
                        text += `│ ➲ ${categoryCommands.map((cmd) => `${ctx._used.prefix || "/"}${cmd.name}`).join("\n│ ➲ ")}\n`;
                    }

                    text +=
                        "╰────\n" +
                        "\n";
                }
            }

            text += global.msg.footer;
        }
        break;
        case "randomimage": {
            const list = ["china", "hubbleimg", "indonesia", "japan", "korea", "malaysia", "neko", "shinobu", "thailand", "vietnam", "waifu"];

            text =
                "❖ Daftar\n" +
                "\n" +
                `➲ ${list.join("\n➲ ")}\n` +
                "\n" +
                global.msg.footer;
        }
        break;
        default:
            text = `${shared.bold("[ ! ]")} Terjadi kesalahan: Jenis daftar tidak dikenal.`;
            break;
    }

    return text;
}

module.exports = {
    get
};