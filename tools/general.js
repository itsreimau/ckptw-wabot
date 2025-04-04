// Impor modul dan dependensi yang diperlukan
const api = require("./api.js");
const uploader = require("@zanixongroup/uploader");
const axios = require("axios");
const didyoumean = require("didyoumean");

const formatBotName = (botName) => {
    if (!botName) return null;
    botName = botName.toLowerCase();
    return botName.replace(/[aiueo0-9\W_]/g, "");
}

function convertMsToDuration(ms) {
    if (ms < 1000) return "kurang satu detik";

    const years = Math.floor(ms / (1000 * 60 * 60 * 24 * 365.25));
    const months = Math.floor((ms / (1000 * 60 * 60 * 24 * 30.44)) % 12);
    const weeks = Math.floor((ms / (1000 * 60 * 60 * 24 * 7)) % 4.345);
    const days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 7);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const seconds = Math.floor((ms / 1000) % 60);

    let durationString = "";

    if (years > 0) durationString += years + " tahun ";
    if (months > 0) durationString += months + " bulan ";
    if (weeks > 0) durationString += weeks + " minggu ";
    if (days > 0) durationString += days + " hari ";
    if (hours > 0) durationString += hours + " jam ";
    if (minutes > 0) durationString += minutes + " menit ";
    if (seconds > 0) durationString += seconds + " detik";

    return durationString.trim();
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

function generateUID(id) {
    if (!id) return null;

    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        const charCode = id.charCodeAt(i);
        hash = (hash * 31 + charCode) % 1000000007;
    }

    const uniquePart = id.split("").reverse().join("").charCodeAt(0).toString(16);

    return `${Math.abs(hash).toString(16).toLowerCase()}-${uniquePart}_${formatBotName(config.bot.name)}-wabot`;
}

function getID(jid) {
    if (!jid) return null;

    return jid.split("@")[0].split(":")[0];
}

function getRandomElement(arr) {
    if (!arr || !arr.length) return null;

    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

function isCmd(content, config) {
    if (!content || !config) return null;

    const prefix = content.charAt(0);
    if (!new RegExp(config.prefix, "i").test(content)) return false;

    const [cmdName, ...inputArray] = content.slice(1).trim().toLowerCase().split(/\s+/);
    const input = inputArray.join(" ");

    const commands = Array.from(config.cmd.values());
    const matchedCmd = commands.find(c => c.name === cmdName || c.aliases?.includes(cmdName));

    if (matchedCmd) return {
        msg: content,
        prefix,
        name: cmdName,
        input
    };

    const mean = didyoumean(cmdName, commands.flatMap(c => [c.name, ...(c.aliases || [])]));

    return mean ? {
        msg: content,
        prefix,
        cmd: cmdName,
        input,
        didyoumean: mean
    } : false;
}

function isOwner(id) {
    if (!id) return null;
    if (config.system.selfOwner) return config.bot.id === id || config.owner.id === id || config.owner.co.includes(id);

    return config.owner.id === id || config.owner.co.includes(id);
}

function isUrl(url) {
    if (!url) return null;

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return urlRegex.test(url);
}

async function translate(text, to) {
    if (!text || !to) return null;

    try {
        const apiUrl = api.createUrl("nyxs", "/tools/translate", {
            text,
            to
        });
        const result = (await axios.get(apiUrl)).data.result;
        return result;
    } catch (error) {
        consolefy.error(`Error: ${error}`);
        return null;
    }
}

function ucword(text) {
    if (!text) return false;

    return text.toLowerCase().replace(/\b(\w)/g, (s) => s.toUpperCase());
}

async function upload(buffer, type, host = "FastUrl") {
    if (!buffer || !type) return null;

    const hosts = {
        any: ["FastUrl", "Litterbox", "Catbox", "Uguu"],
        image: ["Pomf", "Quax", "Ryzen", "Shojib", "Erhabot", "TmpErhabot"],
        video: ["Pomf", "Quax", "Videy", "Ryzen", "TmpErhabot"],
        audio: ["Pomf", "Quax", "Ryzen", "TmpErhabot"]
    };

    host = host.toLowerCase();
    const isValid = hosts.any.some(h => h.toLowerCase() === host) || (hosts[type] || []).some(h => h.toLowerCase() === host);

    if (!isValid) return `Host '${host}' tidak mendukung tipe '${type}'`;

    try {
        const url = await uploader[host](buffer);
        return url || `Gagal mengupload ke '${host}'`;
    } catch (err) {
        consolefy.error(`Error: ${err}`);
        return null;
    }
}

module.exports = {
    convertMsToDuration,
    formatSize,
    generateUID,
    getID,
    getRandomElement,
    isCmd,
    isOwner,
    isUrl,
    translate,
    ucword,
    upload
};