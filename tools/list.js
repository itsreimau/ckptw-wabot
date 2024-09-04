const {
    createUrl
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
const moment = require("moment-timezone");
const fetch = require("node-fetch");

async function get(type, ctx) {
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
                menuText += `◈ ${bold(tags[category])}\n`;

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
            case "alkitab": {
                const response = await fetch(createUrl("https://beeble.vercel.app", "/api/v1/passage/list", {}));
                const data = await response.json();
                text = data.data.map(b =>
                    `${quote(`Buku: ${b.name} (${b.abbreviation})`)}\n` +
                    `${quote(`Jumlah pasal: ${b.total_chapter}`)}\n` +
                    `${quote(`Ayat yang tersimpan: ${b.saved_verse}`)}\n`
                ).join("\n");
                break;
            }

            default:
                text = generateMenuText(ctx._config.cmd, global.system.cmdTags);
                break;
        }
    } catch (err) {
        text = `${bold("Maaf kak! Sepertinya ada masalah saat memuat daftar perintah.")}\n${quote(`Error: ${err.message}`)}\n\nMohon hubungi pengembang untuk memperbaikinya.`;
    }

    return text;
};

module.exports = {
    get
};