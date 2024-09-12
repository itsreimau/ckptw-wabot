const api = require("./api.js");
const general = require("./general.js");
const pkg = require("../package.json");
const {
    bold,
    italic,
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const moment = require("moment-timezone");

async function get(type, ctx) {
    let text = "";

    const generateMenuText = (cmd, tag) => {
        try {
            let menuText =
                `Hai ${ctx.sender.pushName || "Kak"}, berikut adalah daftar perintah yang tersedia!\n` +
                "\n" +
                `${quote(`Waktu aktif: ${general.convertMsToDuration(Date.now() - global.system.startTime) || "kurang dari satu detik."}`)}\n` +
                `${quote(`Tanggal: ${moment.tz(global.system.timeZone).format("DD/MM/YY")}`)}\n` +
                `${quote(`Waktu: ${moment.tz(global.system.timeZone).format("HH:mm:ss")}`)}\n` +
                `${quote(`Versi: ${pkg.version}`)}\n` +
                `${quote(`Prefix: ${ctx._used.prefix}`)}\n` +
                "\n" +
                `${italic("Jangan lupa berdonasi agar bot tetap online!")}\n` +
                `${global.msg.readmore}\n`;

            for (const category of Object.keys(tag)) {
                const categoryCommands = Array.from(cmd.values())
                    .filter(command => command.category === category)
                    .map(command => ({
                        name: command.name,
                        aliases: command.aliases
                    }));

                if (categoryCommands.length > 0) {
                    menuText += `◉ ${bold(tag[category])}\n`;

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
        } catch (error) {
            console.error("Error:", error);
            return quote(`⚠ Terjadi kesalahan: ${error.message}`);
        }
    };

    try {
        switch (type) {
            case "alkitab": {
                try {
                    const alKitabResponse = await axios.get(api.createUrl("https://beeble.vercel.app", "/api/v1/passage/list", {}));
                    text = alKitabResponse.data.data.map(b =>
                        `${quote(`Buku: ${b.name} (${b.abbr})`)}\n` +
                        `${quote(`Jumlah Bab: ${b.chapter}`)}\n` +
                        `${quote("─────")}\n`
                    ).join("");

                    text += global.msg.footer;
                } catch (error) {
                    console.error("Error:", error);
                    text = quote(`⚠ Terjadi kesalahan: ${error.message}`);
                }
                break;
            }
            case "alquran": {
                try {
                    const alquranResponse = await axios.get(api.createUrl("https://equran.id", "/api/v2/surat", {}));
                    text = alquranResponse.data.data.map(s =>
                        `${quote(`Surah: ${s.namaLatin} (${s.nomor})`)}\n` +
                        `${quote(`Jumlah Ayat: ${s.jumlahAyat}`)}\n` +
                        `${quote("─────")}\n`
                    ).join("");

                    text += global.msg.footer;
                } catch (error) {
                    console.error("Error:", error);
                    text = quote(`⚠ Terjadi kesalahan: ${error.message}`);
                }
                break;
            }
            case "disable_enable": {
                try {
                    const deList = ["antilink", "welcome"];
                    text = deList.map(item => quote(item)).join("\n");

                    text += "\n" +
                        global.msg.footer;
                } catch (error) {
                    console.error("Error:", error);
                    text = quote(`⚠ Terjadi kesalahan: ${error.message}`);
                }
                break;
            }
            case "menu": {
                const {
                    cmd
                } = ctx._config;
                const tag = {
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

                if (!cmd || cmd.size === 0) {
                    text = quote("⚠ Terjadi kesalahan: Tidak ada perintah yang ditemukan.");
                } else {
                    text = generateMenuText(cmd, tag);
                }
                break;
            }
            default: {
                console.error("Error:", error);
                text = quote(`⚠ Tidak diketahui: ${type}`);
                break;
            }
        }
    } catch (error) {
        console.error("Error:", error);
        text = quote(`⚠ Terjadi kesalahan: ${error.message}`);
    }

    return text;
}

module.exports = {
    get
};