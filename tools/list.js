const api = require("./api.js");
const general = require("./general.js");
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
        let menuText =
            `Hai ${ctx.sender.pushName || "Kak"}, berikut adalah daftar perintah yang tersedia!\n` +
            "\n" +
            `${quote(`Tanggal: ${moment.tz(config.system.timeZone).format("DD/MM/YY")}`)}\n` +
            `${quote(`Waktu: ${moment.tz(config.system.timeZone).format("HH:mm:ss")}`)}\n` +
            "\n" +
            `${quote(`Uptime: ${general.convertMsToDuration(Date.now() - config.bot.readyAt)}`)}\n` +
            `${quote(`Database: ${config.bot.dbSize} (Simpl.DB - JSON)`)}\n` +
            `${quote(`Library: @mengkodingan/ckptw`)}\n` +
            "\n" +
            `${italic("Jangan lupa berdonasi agar bot tetap online!")}\n` +
            `${config.msg.readmore}\n`;

        for (const category of Object.keys(tag)) {
            const categoryCommands = Array.from(cmd.values())
                .filter(command => command.category === category)
                .map(command => ({
                    name: command.name,
                    aliases: command.aliases,
                    handler: command.handler || {}
                }));

            if (categoryCommands.length > 0) {
                menuText += `◆ ${bold(tag[category])}\n`;

                categoryCommands.forEach(cmd => {
                    let handlerText = "";
                    if (cmd.handler.coin) handlerText += "ⓒ";
                    if (cmd.handler.group) handlerText += "Ⓖ";
                    if (cmd.handler.owner) handlerText += "Ⓞ";
                    if (cmd.handler.premium) handlerText += "Ⓟ";
                    if (cmd.handler.private) handlerText += "ⓟ";

                    menuText += quote(monospace(`${ctx._used.prefix + cmd.name} ${handlerText}`));

                    if (category === "general" && cmd.aliases && cmd.aliases.length > 0) {
                        menuText += `\n` + cmd.aliases.map(alias => quote(monospace(`${ctx._used.prefix + alias}`))).join("\n");
                    }
                    menuText += "\n";
                });

                menuText += "\n";
            }
        }


        menuText += config.msg.footer;
        return menuText;
    };

    try {
        switch (type) {
            case "alkitab": {
                const data = (await axios.get(api.createUrl("https://beeble.vercel.app", "/api/v1/passage/list", {}))).data.data;
                text = data.map(d =>
                        `Buku: ${d.name} (${d.abbr})\n` +
                        `Jumlah Bab: ${d.chapter}\n`
                    ).join(`${quote("─────")}\n`) +
                    config.msg.footer;
                break;
            }
            case "alquran": {
                const data = (await axios.get(api.createUrl("https://equran.id", "/api/v2/surat", {}))).data.data;
                text = data.map(d =>
                        `${quote(`Surah: ${d.namaLatin} (${d.nomor})`)}\n` +
                        `${quote(`Jumlah Ayat: ${d.jumlahAyat}`)}\n`
                    ).join(`${quote("─────")}\n`) +
                    "\n" +
                    config.msg.footer;
                break;
            }
            case "claim": {
                const data = ["daily", "weekly", "monthly", "yearly", "premium", "freetrial"];
                text = `${data.map(quote).join("\n")}\n` +
                    "\n" +
                    config.msg.footer;
                break;
            }
            case "jadwaltv": {
                const data = (await axios.get(api.createUrl("aemt", "/jadwaltv", {}))).data.message.split("Berikut list tv yang tersedia: ")[1].split(", ");
                text = `${data.map(quote).join("\n")}\n` +
                    "\n" +
                    config.msg.footer;
                break;
            }
            case "mode": {
                const data = ["group", "private", "public", "self"];
                text = `${data.map(quote).join("\n")}\n` +
                    "\n" +
                    config.msg.footer;
                break;
            }
            case "setgroup": {
                const data = ["antilink", "welcome"];
                text = `${data.map(quote).join("\n")}\n` +
                    "\n" +
                    config.msg.footer;
                break;
            }
            case "setprofile": {
                const data = ["autolevelup"];
                text = `${data.map(quote).join("\n")}\n` +
                    "\n" +
                    config.msg.footer;
                break;
            }
            case "group": {
                const data = ["open", "close", "lock", "unlock"];
                text = `${data.map(quote).join("\n")}\n` +
                    "\n" +
                    config.msg.footer;
                break;
            }
            case "translate": {
                const data = (await axios.get(api.createUrl("nyxs", "/tools/translate", {})).catch(err => err.response?.data?.available_languange)) || [];
                text = data.map(d =>
                        `${quote(`Kode: ${d.code}`)}\n` +
                        `${quote(`Bahasa: ${d.bahasa}`)}\n`
                    ).join(`${quote("─────")}\n`) +
                    "\n" +
                    config.msg.footer;
                break;
            }
            case "tts": {
                const data = (await axios.get(api.createUrl("nyxs", "/tools/tts", {}))).data.available_languange;
                text = data.map(d =>
                        `${quote(`Kode: ${d.code}`)}\n` +
                        `${quote(`Bahasa: ${d["bahasa negara"]}`)}\n`
                    ).join(`${quote("─────")}\n`) +
                    "\n" +
                    config.msg.footer;
                break;
            }
            case "waifudiffusion": {
                const data = ["Cute-Anime", "Studio-Ghibli", "Anime", "Waifu", "Vintage-Anime", "Soft-Anime"];
                text = `${data.map((item, index) => quote(`${item} (${index + 1})`)).join("\n")}\n` +
                    "\n" +
                    config.msg.footer;
                break;
            }
            case "menu": {
                const {
                    cmd
                } = ctx._config;
                const tag = {
                    general: "General",
                    ai: "AI",
                    converter: "Converter",
                    downloader: "Downloader",
                    entertainment: "Entertainment",
                    group: "Group",
                    maker: "Maker",
                    profile: "Profile",
                    search: "Search",
                    tools: "Tools",
                    owner: "Owner",
                    information: "Information",
                    misc: "Miscellaneous"
                };

                if (!cmd || cmd.size === 0) {
                    text = quote("⚠️ Terjadi kesalahan: Tidak ada perintah yang ditemukan.");
                } else {
                    text = generateMenuText(cmd, tag);
                }
                break;
            }
            default: {
                console.error(`[${config.pkg.name}] Error:`, error);
                text = quote(`❎ Tidak diketahui: ${type}`);
                break;
            }
        }
    } catch (error) {
        console.error(`[${config.pkg.name}] Error:`, error);
        text = quote(`⚠️ Terjadi kesalahan: ${error.message}`);
    }

    return text;
}

module.exports = {
    get
};