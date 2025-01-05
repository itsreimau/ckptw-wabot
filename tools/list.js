const api = require("./api.js");
const {
    bold,
    italic,
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

async function get(type, ctx) {
    try {
        let text = "";

        const createList = (data, formatter) =>
            `${data.map(formatter).join(`\n${quote("─────")}\n`)}\n` +
            "\n" +
            config.msg.footer;

        switch (type) {
            case "alkitab": {
                const data = (await axios.get(api.createUrl("https://beeble.vercel.app", "/api/v1/passage/list", {}))).data.data;
                text = createList(data, d =>
                    `${quote(`Buku: ${d.name} (${d.abbr})`)}\n` +
                    `${quote(`Jumlah Bab: ${d.chapter}`)}`
                );
                break;
            }
            case "alquran": {
                const data = (await axios.get(api.createUrl("https://equran.id", "/api/v2/surat", {}))).data.data;
                text = createList(data, d =>
                    `${quote(`Surah: ${d.namaLatin} (${d.nomor})`)}\n` +
                    `${quote(`Jumlah Ayat: ${d.jumlahAyat}`)}`
                );
                break;
            }
            case "claim": {
                const data = ["daily", "weekly", "monthly", "yearly"];
                text = createList(data, d => `${quote(d)}`);
                break;
            }
            case "fixdb": {
                const data = ["user", "group", "menfess"];
                text = createList(data, d => `${quote(d)}`);
                break;
            }
            case "group": {
                const data = ["open", "close", "lock", "unlock"];
                text = createList(data, d => `${quote(d)}`);
                break;
            }
            case "jadwaltv": {
                const data = (await axios.get(api.createUrl("btch", "/jadwaltv", {}))).data.message.split("Berikut list tv yang tersedia: ")[1].split(", ");
                text = createList(data, d => `${quote(d)}`);
                break;
            }
            case "mode": {
                const data = ["group", "private", "public", "self"];
                text = createList(data, d => `${quote(d)}`);
                break;
            }
            case "osettext": {
                const data = ["price (Variabel yang tersedia: %tag%, %name%, %version%, %prefix%, %command%, %watermark%, %footer%, %readmore%)"];
                text = createList(data, d => `${quote(d)}`);
                break;
            }
            case "setoption": {
                const data = ["antilink", "antinsfw", "antisticker", "antitoxic", "autokick", "welcome"];
                text = createList(data, d => `${quote(d)}`);
                break;
            }
            case "setprofile": {
                const data = ["autolevelup"];
                text = createList(data, d => `${quote(d)}`);
                break;
            }
            case "settext": {
                const data = [
                    "goodbye (Variabel yang tersedia: %tag%, %subject%, %description%)",
                    "intro",
                    "welcome (Variabel yang tersedia: %tag%, %subject%, %description%)"
                ];
                text = createList(data, d => `${quote(d)}`);
                break;
            }
            case "translate": {
                const data = (await axios.get(api.createUrl("nyxs", "/tools/translate", {})).catch(err => err.response?.data?.available_languange)) || [];
                text = createList(data, d =>
                    `${quote(`Kode: ${d.code}`)}\n` +
                    `${quote(`Bahasa: ${d.bahasa}`)}`
                );
                break;
            }
            case "tts": {
                const data = (await axios.get(api.createUrl("nyxs", "/tools/tts", {}))).data.available_languange;
                text = createList(data, d =>
                    `${quote(`Kode: ${d.code}`)}\n` +
                    `${quote(`Bahasa: ${d["bahasa negara"]}`)}`
                );
                break;
            }
            default: {
                console.error(`[${config.pkg.name}] Error: Unknown type ${type}`);
                text = quote(`❎ Tidak diketahui: ${type}`);
                break;
            }
        }

        return text;
    } catch (error) {
        console.error(`[${config.pkg.name}] Error:`, error);
        return null;
    }
}

module.exports = {
    get
};