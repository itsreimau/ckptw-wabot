function convertMsToDuration(ms, specificUnits = []) {
    if (ms < 1) return "0 milidetik";
    if (ms < 1000) return specificUnits.includes("milidetik") ? `${Math.floor(ms)} milidetik` : "0 milidetik";

    const timeValues = {
        tahun: Math.floor(ms / (1000 * 60 * 60 * 24 * 365.25)),
        bulan: Math.floor((ms / (1000 * 60 * 60 * 24 * 30.44)) % 12),
        minggu: Math.floor((ms / (1000 * 60 * 60 * 24 * 7)) % 4.345),
        hari: Math.floor((ms / (1000 * 60 * 60 * 24)) % 7),
        jam: Math.floor((ms / (1000 * 60 * 60)) % 24),
        menit: Math.floor((ms / (1000 * 60)) % 60),
        detik: Math.floor((ms / 1000) % 60),
        milidetik: Math.floor(ms % 1000)
    };

    if (specificUnits && specificUnits.length > 0) {
        const resultParts = [];
        for (const unit of specificUnits) {
            if (timeValues.hasOwnProperty(unit)) {
                const value = timeValues[unit];
                if (value > 0 || unit === "milidetik") {
                    resultParts.push(`${value} ${unit}`);
                }
            }
        }
        return resultParts.length > 0 ? resultParts.join(" ") : `0 ${specificUnits[0]}`;
    }

    const parts = [];
    if (timeValues.tahun) parts.push(`${timeValues.tahun} tahun`);
    if (timeValues.bulan) parts.push(`${timeValues.bulan} bulan`);
    if (timeValues.minggu) parts.push(`${timeValues.minggu} minggu`);
    if (timeValues.hari) parts.push(`${timeValues.hari} hari`);
    if (timeValues.jam) parts.push(`${timeValues.jam} jam`);
    if (timeValues.menit) parts.push(`${timeValues.menit} menit`);
    if (timeValues.detik) parts.push(`${timeValues.detik} detik`);

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

    const units = ["yBytes", "zBytes", "aBytes", "fBytes", "pBytes", "nBytes", "µBytes", "mBytes", "Bytes", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];

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

    const units = ["yBytes", "zBytes", "aBytes", "fBytes", "pBytes", "nBytes", "µBytes", "mBytes", "Bytes", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];

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
    formatSizePerSecond,
    generateCmdExample,
    generateInstruction,
    generatesFlagInfo,
    generateNotes,
    ucwords
};