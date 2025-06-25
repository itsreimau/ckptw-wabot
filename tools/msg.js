const units = ["yBytes", "zBytes", "aBytes", "fBytes", "pBytes", "nBytes", "µBytes", "mBytes", "Bytes", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];

function convertMsToDuration(ms) {
    if (ms < 1000) return "kurang satu detik";

    const years = Math.floor(ms / (1000 * 60 * 60 * 24 * 365.25));
    const months = Math.floor((ms / (1000 * 60 * 60 * 24 * 30.44)) % 12);
    const weeks = Math.floor((ms / (1000 * 60 * 60 * 24 * 7)) % 4.345);
    const days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 7);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const seconds = Math.floor((ms / 1000) % 60);

    const parts = [];
    if (years) parts.push(`${years} tahun`);
    if (months) parts.push(`${months} bulan`);
    if (weeks) parts.push(`${weeks} minggu`);
    if (days) parts.push(`${days} hari`);
    if (hours) parts.push(`${hours} jam`);
    if (minutes) parts.push(`${minutes} menit`);
    if (seconds) parts.push(`${seconds} detik`);

    return parts.length > 0 ? parts.join(" ") : "0 detik";
}

function convertSecondToTimecode(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const milliseconds = Math.round((seconds - Math.floor(seconds)) * 1000);

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(3, "0")}`;
}

function formatSize(byteCount) {
    if (!byteCount) return "0 yBytes";

    let index = 8;
    let size = byteCount;

    while (size < 1 && index > 0) {
        size *= 1024;
        index--;
    }

    while (size >= 1024 && index < units.length - 1) {
        size /= 1024;
        index++;
    }

    return `${size.toFixed(2)} ${units[index]}`;
}

function formatSizePerSecond(byteCount) {
    if (!byteCount) return "0 yBytes/s";

    let index = 8;
    let size = byteCount;

    while (size < 1 && index > 0) {
        size *= 1024;
        index--;
    }

    while (size >= 1024 && index < units.length - 1) {
        size /= 1024;
        index++;
    }

    return `${size.toFixed(2)} ${units[index]}/s`;
}

function generateCmdExample(used, args) {
    if (!used) return "'used' harus diberikan!";
    if (!args) return "'args' harus diberikan!";

    const cmdMsg = `Contoh: ${formatter.monospace(`${used.prefix + used.command} ${args}`)}`;
    return cmdMsg;
}

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
        "document": "dokumen",
        "gif": "GIF",
        "image": "gambar",
        "sticker": "stiker",
        "text": "teks",
        "video": "video",
        "viewOnce": "sekali lihat"
    };

    const translatedMediaTypeList = translatedMediaTypes.map(type => mediaTypeTranslations[type]);

    let mediaTypesList;
    if (translatedMediaTypeList.length > 1) {
        const lastMediaType = translatedMediaTypeList[translatedMediaTypeList.length - 1];
        mediaTypesList = `${translatedMediaTypeList.slice(0, -1).join(", ")}, atau ${lastMediaType}`;
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

function generatesFlagInfo(flags) {
    if (typeof flags !== "object" || !flags) return "'flags' harus berupa objek!";

    const flagInfo = "Flag:\n" +
        Object.entries(flags).map(([flag, description]) => formatter.quote(`• ${formatter.monospace(flag)}: ${description}`)).join("\n");
    return flagInfo;
}

function generateNotes(notes) {
    if (!Array.isArray(notes)) return "'notes' harus berupa string!";

    const notesMsg = "Catatan:\n" +
        notes.map(note => formatter.quote(`• ${note}`)).join("\n");
    return notesMsg;
}

function ucwords(text) {
    if (!text) return null;

    return text.toLowerCase().replace(/\b\w/g, (t) => t.toUpperCase());
}

module.exports = {
    convertMsToDuration,
    convertSecondToTimecode,
    formatSize,
    generateCmdExample,
    generateInstruction,
    generatesFlagInfo,
    generateNotes,
    ucwords
};