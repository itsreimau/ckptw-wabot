// Impor modul dan dependensi yang diperlukan
const api = require("./api.js");
const axios = require("axios");
const util = require("node:util");

async function get(type) {
    try {
        let text = "";

        const createList = (data, formatter) => `${data.map(formatter).join(`\n${formatter.quote("─────")}\n`)}\n` +
            "\n" +
            config.msg.footer;

        switch (type) {
            case "alkitab": {
                const data = (await axios.get(api.createUrl("https://api-alkitab.vercel.app", "/api/book"))).data.data;
                text = createList(data, d =>
                    `${formatter.quote(`Buku: ${d.name} (${d.abbr})`)}\n` +
                    `${formatter.quote(`Jumlah Bab: ${d.chapter}`)}`
                );
                break;
            }
            case "alquran": {
                const data = (await axios.get(api.createUrl("nekorinn", "/religious/nuquran-listsurah"))).data.result.list;
                text = createList(data, d =>
                    `${formatter.quote(`Surah: ${d.name} (${d.id})`)}\n` +
                    `${formatter.quote(`Jumlah Ayat: ${d.verse_count}`)}`
                );
                break;
            }
            case "cecan": {
                const data = ["china", "indonesia", "japan", "vietnam", "korea", "malaysia", "thailand"];
                text = createList(data, d => formatter.quote(d));
                break;
            }
            case "claim": {
                const data = [
                    "daily (Hadiah harian)",
                    "weekly (Hadiah mingguan)",
                    "monthly (Hadiah bulanan)",
                    "yearly (Hadiah tahunan)"
                ];
                text = createList(data, d => formatter.quote(d));
                break;
            }
            case "fixdb": {
                const data = [
                    "user (Data pengguna)",
                    "group (Data grup)",
                    "menfess (Data menfess)"
                ];
                text = createList(data, d => formatter.quote(d));
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
                text = createList(data, d => formatter.quote(d));
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
                text = createList(data, d => formatter.quote(d));
                break;
            }
            case "mode": {
                const data = [
                    "group (Mode group, hanya merespons dalam obrolan grup)",
                    "private (Mode private, hanya merespons dalam obrolan pribadi)",
                    "public (Mode publik, merespons dalam obrolan grup dan obrolan pribadi)",
                    "self (Mode self, hanya merespons dirinya sendiri dan ownernya)"
                ];
                text = createList(data, d => formatter.quote(d));
                break;
            }
            case "osettext": {
                const data = [
                    "donate (Variabel yang tersedia: %tag%, %name%, %prefix%, %command%, %footer%, %readmore%) (Atur teks donasi)",
                    "price (Variabel yang tersedia: %tag%, %name%, %prefix%, %command%, %footer%, %readmore%) (Atur teks harga)"
                ];
                text = createList(data, d => formatter.quote(d));
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
                text = createList(data, d => formatter.quote(d));
                break;
            }
            case "setprofile": {
                const data = [
                    "autolevelup (Otomatis naik level)",
                    "username (Nama pengguna)"
                ];
                text = createList(data, d => formatter.quote(d));
                break;
            }
            case "settext": {
                const data = [
                    "goodbye (Teks goodbye, variabel yang tersedia: %tag%, %subject%, %description%)",
                    "intro (Teks intro)",
                    "welcome (Teks welcome, variabel yang tersedia: %tag%, %subject%, %description%)"
                ];
                text = createList(data, d => formatter.quote(d));
                break;
            }
            case "translate": {
                const data = (await axios.get(api.createUrl("https://raw.githubusercontent.com", "/itsecurityco/to-google-translate/refs/heads/master/supported_languages.json"))).data;
                text = createList(data, d =>
                    `${formatter.quote(`Kode: ${d.code}`)}\n` +
                    `${formatter.quote(`Bahasa: ${d.language}`)}`
                );
                break;
            }
            case "ttsmp3": {
                const data = ["zeina", "nicole", "russell", "ricardo", "camila", "vitoria", "brian", "amy", "emma", "chantal", "enrique", "lucia", "conchita", "zhiyu", "naja", "mads", "ruben", "lotte", "mathieu", "celine", "lea", "vicki", "marlene", "hans", "karl", "dora", "aditi", "raveena", "giorgio", "carla", "bianca", "takumi", "mizuki", "seoyeon", "mia", "liv", "jan", "maja", "ewa", "jacek", "cristiano", "ines", "carmen", "tatyana", "maxim", "astrid", "filiz", "kimberly", "ivy", "kendra", "justin", "joey", "matthew", "salli", "joanna", "penelope", "lupe", "miguel", "gwyneth", "geraint"];
                text = createList(data, d => formatter.quote(d));
                break;
            }
            case "waifuim": {
                const data = ["ass", "ecchi", "ero", "hentai", "maid", "milf", "oppai", "oral", "paizuri", "selfies", "uniform", "waifu"];
                text = createList(data, d => formatter.quote(d));
                break;
            }
            case "waifusm": {
                const data = ["animal", "animalears", "anusview", "ass", "barefoot", "bed", "bell", "bikini", "blonde", "bondage", "bra", "breasthold", "breasts", "bunnyears", "bunnygirl", "chain", "closeview", "cloudsview", "cum", "dress", "drunk", "elbowgloves", "erectnipples", "fateseries", "fingering", "flatchest", "food", "foxgirl", "gamecg", "genshin", "glasses", "gloves", "greenhair", "hatsunemiku", "hcatgirl", "headband", "headdress", "headphones", "hentaimiku", "hloli", "hneko", "hololive", "horns", "inshorts", "japanesecloths", "necklace", "nipples", "nobra", "nsfwbeach", "nsfwbell", "nsfwdemon", "nsfwidol", "nsfwmaid", "nsfwmenu", "nsfwvampire", "nude", "openshirt", "pantyhose", "pantypull", "penis", "pinkhair", "ponytail", "pussy", "schoolswimsuit", "schooluniform", "seethrough", "sex", "sex2", "sex3", "shirt", "shirtlift", "skirt", "spreadlegs", "spreadpussy", "squirt", "stockings", "sunglasses", "swimsuit", "tail", "tattoo", "tears", "thighhighs", "thogirls", "topless", "torncloths", "touhou", "twintails", "uncensored", "underwear", "vocaloid", "weapon", "white", "whitehair", "wings", "withflowers", "withguns", "withpetals", "withtie", "withtree", "wolfgirl", "yuri"];
                text = createList(data, d => formatter.quote(d));
                break;
            }
            default: {
                text = formatter.quote(`❎ Tipe tidak diketahui: ${type}`);
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