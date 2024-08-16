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

    const generateMenuText = (cmds, tags) => {
        let menuText =
            `Hai ${ctx._sender.pushName || "Kak"}, berikut adalah daftar perintah yang tersedia!\n` +
            "\n" +
            `${quote(`Waktu aktif: ${convertMsToDuration(Date.now() - global.system.startTime) || "kurang dari satu detik."}`)}\n` +
            `${quote(`Tanggal: ${moment.tz(global.system.timeZone).format("DD/MM/YY")}`)}\n` +
            `${quote(`Waktu: ${moment.tz(global.system.timeZone).format("HH:mm:ss")}`)}\n` +
            `${quote(`Versi: ${pkg.version}`)}\n` +
            `${quote(`Prefix: ${ctx._used.prefix}`)}\n` +
            "\n" +
            `${italic("Jangan lupa berdonasi agar bot tetap online!")}\n` +
            `${global.msg.readmore}\n`;

        for (const category of Object.keys(tags)) {
            const categoryCommands = Array.from(cmds.values())
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
                const alKitabResponse = await axios.get(createAPIUrl("https://beeble.vercel.app", "/api/v1/passage/list", {}));
                text = alKitabResponse.data.data.map(b =>
                    `${quote(`Buku: ${b.name} (${b.abbr})`)}\n` +
                    `${quote(`Jumlah Bab: ${b.chapter}`)}\n` +
                    "-----\n"
                ).join("");

                text += global.msg.footer;
                break;

            case "alquran":
                const alquranResponse = await axios.get(createAPIUrl("https://equran.id", "/api/v2/surat", {}));
                text = alquranResponse.data.data.map(s =>
                    `${quote(`Surah: ${s.namaLatin} (${s.nomor})`)}\n` +
                    `${quote(`Jumlah Ayat: ${s.jumlahAyat}`)}\n` +
                    "-----\n"
                ).join("");

                text += global.msg.footer;
                break;

            case "disable_enable":
                const deList = ["antilink", "welcome"];
                text = "";

                for (const item of deList) {
                    text += `${quote(item)}\n`;
                }

                text += "\n" +
                    global.msg.footer;
                break;

            case "menu":
                const cmds = ctx._self.cmd;
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

                if (!cmds || cmds.size === 0) {
                    text = quote(`⚠ Terjadi kesalahan: Tidak ada perintah yang ditemukan.`);
                } else {
                    text = generateMenuText(cmds, tags);
                }
                break;

            default:
                text = quote(`⚠ Terjadi kesalahan: Jenis daftar tidak dikenal.`);
                break;
        }
    } catch (error) {
        text = quote(`⚠ Terjadi kesalahan: ${error.message}`);
    }

    return text;
};