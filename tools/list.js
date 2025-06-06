// Impor modul dan dependensi yang diperlukan
const api = require("./api.js");
const {
    quote
} = require("@itsreimau/ckptw-mod");
const axios = require("axios");
const util = require("node:util");

async function get(type) {
    try {
        let text = "";

        const createList = (data, formatter) => `${data.map(formatter).join(
            "\n" +
            `${quote("─────")}\n`)}\n` +
            "\n" +
            config.msg.footer;

        switch (type) {
            case "alkitab": {
                const data = (await axios.get(api.createUrl("https://api-alkitab.vercel.app", "/api/book"))).data.data;
                text = createList(data, d =>
                    `${quote(`Buku: ${d.name} (${d.abbr})`)}\n` +
                    `${quote(`Jumlah Bab: ${d.chapter}`)}`
                );
                break;
            }
            case "alquran": {
                const data = (await axios.get(api.createUrl("nekorinn", "/religious/nuquran-listsurah"))).data.result.list;
                text = createList(data, d =>
                    `${quote(`Surah: ${d.name} (${d.id})`)}\n` +
                    `${quote(`Jumlah Ayat: ${d.verse_count}`)}`
                );
                break;
            }
            case "claim": {
                const data = [
                    "daily (Hadiah harian)",
                    "weekly (Hadiah mingguan)",
                    "monthly (Hadiah bulanan)",
                    "yearly (Hadiah tahunan)"
                ];
                text = createList(data, d => quote(d));
                break;
            }
            case "fixdb": {
                const data = [
                    "user (Data pengguna)",
                    "group (Data grup)",
                    "menfess (Data menfess)"
                ];
                text = createList(data, d => quote(d));
                break;
            }
            case "group": {
                const data = [
                    "open (Buka grup)",
                    "close (Tutup grup)",
                    "lock (Kunci grup)",
                    "unlock (Buka kunci grup)",
                    "approve (Aktifkan persetujuan masuk)",
                    "disapprove (Nonaktifkan persetujuan masuk)",
                    "invite (Izinkan anggota menambah anggota)",
                    "restrict (Hanya admin yang bisa menambah anggota)"
                ];
                text = createList(data, d => quote(d));
                break;
            }
            case "how": {
                const data = [
                    "howgay (Seberapa gay)",
                    "howpintar (Seberapa pintar)",
                    "howcantik (Seberapa cantik)",
                    "howganteng (Seberapa ganteng)",
                    "howgabut (Seberapa gabut)",
                    "howgila (Seberapa gila)",
                    "howlesbi (Seberapa lesbi)",
                    "howstress (Seberapa stress)",
                    "howbucin (Seberapa bucin)",
                    "howjones (Seberapa jones)",
                    "howsadboy (Seberapa sadboy)"
                ];
                text = createList(data, d => quote(d));
                break;
            }
            case "mode": {
                const data = [
                    "group (Mode group, hanya merespons dalam obrolan grup)",
                    "private (Mode private, hanya merespons dalam obrolan pribadi)",
                    "public (Mode publik, merespons dalam obrolan grup dan obrolan pribadi)",
                    "self (Mode self, hanya merespons dirinya sendiri dan ownernya)"
                ];
                text = createList(data, d => quote(d));
                break;
            }
            case "osettext": {
                const data = [
                    "donate (Variabel yang tersedia: %tag%, %name%, %prefix%, %command%, %footer%, %readmore%) (Atur teks donasi)",
                    "price (Variabel yang tersedia: %tag%, %name%, %prefix%, %command%, %footer%, %readmore%) (Atur teks harga)"
                ];
                text = createList(data, d => quote(d));
                break;
            }
            case "setoption": {
                const data = [
                    "antiaudio (Anti audio)",
                    "Antidocument (Anti dokumen)",
                    "Antigif (Anti GIF)",
                    "Antiimage (Anti gambar)",
                    "antilink (Anti link)",
                    "antinsfw (Anti NSFW, seperti pornografi)",
                    "antispam (Anti spam)",
                    "antisticker (Anti stiker)",
                    "antivideo (Anti video)",
                    "antitoxic (Anti toxic, seperti bahasa kasar)",
                    "autokick (Dikeluarkan secara otomatis, jika ada yang melanggar salah satu opsi 'anti...')",
                    "gamerestrict (Anggota dilarang bermain game)",
                    "welcome (Sambutan member)"
                ];
                text = createList(data, d => quote(d));
                break;
            }
            case "setprofile": {
                const data = [
                    "autolevelup (Otomatis naik level)",
                    "username (Nama pengguna)"
                ];
                text = createList(data, d => quote(d));
                break;
            }
            case "settext": {
                const data = [
                    "goodbye (Teks goodbye, variabel yang tersedia: %tag%, %subject%, %description%)",
                    "intro (Teks intro)",
                    "welcome (Teks welcome, variabel yang tersedia: %tag%, %subject%, %description%)"
                ];
                text = createList(data, d => quote(d));
                break;
            }
            case "translate": {
                const data = (await axios.get(api.createUrl("nyxs", "/tools/translate")).catch(err => err.response.data.available_languange)) || [];
                text = createList(data, d =>
                    `${quote(`Kode: ${d.code}`)}\n` +
                    `${quote(`Bahasa: ${d.bahasa}`)}`
                );
                break;
            }
            case "tts": {
                const data = (await axios.get(api.createUrl("nyxs", "/tools/tts"))).data.available_languange;
                text = createList(data, d =>
                    `${quote(`Kode: ${d.code}`)}\n` +
                    `${quote(`Bahasa: ${d["bahasa negara"]}`)}`
                );
                break;
            }
            default: {
                text = quote(`❎ Tipe tidak diketahui: ${type}`);
                break;
            }
        }

        return text;
    } catch (error) {
        consolefy.error(`Error: ${util.format(error)}`);
        return null;
    }
}

module.exports = {
    get
};