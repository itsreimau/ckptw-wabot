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
        "text": "teks",
        "image": "gambar",
        "gif": "GIF",
        "video": "video",
        "sticker": "stiker"
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

    const commandMessage = `Contoh: ${monospace(command + args)}`;
    return commandMessage;
}

module.exports = {
    generateInstruction,
    generateCommandExample
};