// Import modul dan dependensi
const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");

function generateInstruction(actions, mediaTypes) {
    if (!actions || !actions.length) return "'actions' yang diperlukan harus ditentukan!";

    let translatedMediaTypes;
    if (typeof mediaTypes === "string") {
        translatedMediaTypes = [mediaTypes];
    } else if (Array.isArray(mediaTypes)) {
        translatedMediaTypes = mediaTypes;
    } else {
        return "'mediaTypes' harus berupa string atau array string!";
    }

    const mediaTypeTranslations = {
        "audio": "audio",
        "contact": "kontak",
        "document": "dokumen",
        "gif": "GIF",
        "image": "gambar",
        "liveLocation": "lokasi langsung",
        "location": "lokasi",
        "payment": "pembayaran",
        "poll": "polling",
        "product": "produk",
        "ptt": "pesan suara",
        "reaction": "reaksi",
        "sticker": "stiker",
        "templateMessage": "pesan template",
        "text": "teks",
        "video": "video",
        "viewOnce": "sekali lihat"
    };

    const translatedMediaTypeList = translatedMediaTypes.map(type => mediaTypeTranslations[type]);

    let mediaTypesList;
    if (translatedMediaTypeList.length > 1) {
        const lastMediaType = translatedMediaTypeList[translatedMediaTypeList.length - 1];
        mediaTypesList = translatedMediaTypeList.slice(0, -1).join(", ") + `, atau ${lastMediaType}`;
    } else {
        mediaTypesList = translatedMediaTypeList[0];
    }

    const actionTranslations = {
        "send": "Kirim",
        "reply": "Balas"
    };

    const instructions = actions.map(action => `${actionTranslations[action]}`);
    const actionList = instructions.join(actions.length > 1 ? " atau " : "");

    return `📌 ${actionList} ${mediaTypesList}!`;
}

function generateCommandExample(used, args) {
    if (!used) return "'used' harus diberikan!";

    if (!args) return "'args' harus diberikan!";

    const commandMessage = `Contoh: ${monospace(`${used.prefix + used.command} ${args}`)}`;
    return commandMessage;
}

function generatesFlagInformation(flags) {
    if (typeof flags !== "object" || !flags) return "'flags' harus berupa objek!";

    const flagInfo = "Flag:\n" +
        Object.entries(flags).map(([flag, description]) =>
            quote(`• ${monospace(flag)}: ${description}`)
        ).join("\n");

    return flagInfo;
}

function generateNotes(notes) {
    if (!Array.isArray(notes)) return "'notes' harus berupa string!";

    const notesInfo = "Catatan:\n" +
        notes.map(note =>
            quote(`• ${note}`)
        ).join("\n");

    return notesInfo;
}

module.exports = {
    generateInstruction,
    generateCommandExample,
    generatesFlagInformation,
    generateNotes
};