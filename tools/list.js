const {
    createAPIUrl
} = require("./api.js");
const {
    convertMsToDuration
} = require("./general.js");
const pkg = require("../package.json");
const {
    bold,
    italic,
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const moment = require("moment-timezone");

exports.getList = async (type, ctx) => {
    let text = "";

    const generateMenuText = (commandsMap, tags) => {
        let menuText = `Hai ${ctx._sender.pushName || "Kak"}, berikut adalah daftar perintah yang tersedia!\n\n` +
            `${quote(`Waktu aktif: ${convertMsToDuration(Date.now() - global.system.startTime) || "kurang dari satu detik."}`)}\n` +
            `${quote(`Tanggal: ${moment.tz(global.system.timeZone).format("DD/MM/YY")}`)}\n` +
            `${quote(`Waktu: ${moment.tz(global.system.timeZone).format("HH:mm:ss")}`)}\n` +
            `${quote(`Versi: ${pkg.version}`)}\n` +
            `${quote(`Prefix: ${ctx._used.prefix}`)}\n\n` +
            `${italic("Jangan lupa berdonasi agar bot tetap online!")}\n` +
            `${global.msg.readmore}\n`;

        for (const category of Object.keys(tags)) {
            const categoryCommands = Array.from(commandsMap.values())
                .filter(command => command.category === category)
                .map(command => ({
                    name: command.name,
                    aliases: command.aliases
                }));

            if (categoryCommands.length > 0) {
                menuText += `${bold(tags[category])}\n`;

                categoryCommands.forEach(cmd => {
                    menuText += quote(monospace(`${ctx._used.prefix || "/"}${cmd.name}`));
                    if (category === "main" && cmd.aliases && cmd.aliases.length > 0) {
                        menuText += `\n` + cmd.aliases.map(alias => quote(monospace(`${ctx._used.prefix || "/"}${alias}`))).join("\n");
                    }
                    menuText += "\n";
                });

                menuText += "\n";
            }
        }

        menuText += global.msg.footer;
        return menuText;
    };

    try {
        switch (type) {
            case "alkitab":
                const alkitabResponse = await axios.get(createAPIUrl("https://beeble.vercel.app", "/api/v1/passage/list", {}));
                text = alkitabResponse.data.data.map(book =>
                    `${quote(`Buku: ${book.name} (${book.abbr})`)}\n` +
                    `${quote(`Jumlah Bab: ${book.chapter}`)}\n` +
                    "-----\n"
                ).join("");

                text += global.msg.footer;
                break;

            case "alquran":
                const alquranResponse = await axios.get(createAPIUrl("https://equran.id", "/api/v2/surat", {}));
                text = alquranResponse.data.data.map(surah =>
                    `${quote(`Surah: ${surah.namaLatin} (${surah.nomor})`)}\n` +
                    `${quote(`Jumlah Ayat: ${surah.jumlahAyat}`)}\n` +
                    "-----\n"
                ).join("");

                text += global.msg.footer;
                break;

            case "disable_enable":
                const list = ["antilink", "welcome"];
                text = "";

                for (const item of list) {
                    text += `${quote(item)}\n`;
                }

                text += "\n" +
                    global.msg.footer;
                break;

            case "menu":
                const commandsMap = ctx._self.cmd;
                const tags = {
                    main: "Main",
                    ai: "AI",
                    game: "Game",
                    converter: "Converter",
                    downloader: "Downloader",
                    fun: "Fun",
                    group: "Group",
                    islamic: "Islamic",
                    internet: "Internet",
                    maker: "Maker",
                    tools: "Tools",
                    owner: "Owner",
                    info: "Info",
                    "": "No Category"
                };

                if (!commandsMap || commandsMap.size === 0) {
                    text = `${bold("[ ! ]")} Terjadi kesalahan: Tidak ada perintah yang ditemukan.`;
                } else {
                    text = generateMenuText(commandsMap, tags);
                }
                break;

            default:
                text = `${bold("[ ! ]")} Terjadi kesalahan: Jenis daftar tidak dikenal.`;
                break;
        }
    } catch (error) {
        text = `${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`;
    }

    return text;
};