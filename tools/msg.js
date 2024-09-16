const {
    monospace
} = require("@mengkodingan/ckptw");

function generateInstruction(actions, mediaTypes) {
    if (!actions || !actions.length) {
        throw new Error("Necessary actions must be determined.");
    }

    if (!mediaTypes || !mediaTypes.length) {
        throw new Error("Media type must be specified.");
    }

    const actionTranslations = {
        "send": "Kirim",
        "reply": "Balas"
    };

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


    const translatedMediaTypes = mediaTypes.map(type => mediaTypeTranslations[type]);
    let mediaTypesList = translatedMediaTypes.join(", ");

    if (translatedMediaTypes.length > 2) {
        const lastMediaType = translatedMediaTypes[translatedMediaTypes.length - 1];
        mediaTypesList = translatedMediaTypes.slice(0, -1).join(", ") + `, atau ${lastMediaType}`;
    }

    const instructions = actions.map(action => `${actionTranslations[action]}`);
    const actionList = instructions.join(actions.length > 1 ? " atau " : "");

    return `📌 ${actionList} ${mediaTypesList}!`;
}

function generateCommandExample(command, args) {
    if (!command) {
        throw new Error("A command must be provided.");
    }

    if (!args) {
        throw new Error("Arguments must be provided.");
    }

    const commandMessage = `Contoh: ${monospace(`${command} ${args}`)}`;
    return commandMessage;
}

module.exports = {
    generateInstruction,
    generateCommandExample
};