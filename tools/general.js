const {
    downloadContentFromMessage
} = require("@whiskeysockets/baileys");

async function convertMsToDuration(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));
    let durationString = "";

    if (hours > 0) durationString += hours + " jam ";

    if (minutes > 0) durationString += minutes + " menit ";

    if (seconds > 0) durationString += seconds + " detik";

    return durationString;
};

async function download(object, type) {
    const stream = await downloadContentFromMessage(object, type);
    let buffer = Buffer.from([]);

    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }

    return buffer;
};

async function formatSize(bytes) {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

    if (bytes === 0) return "0 Byte";

    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));

    return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
};

async function getRandomElement(arr) {
    if (arr.length === 0) return undefined;

    const randomIndex = Math.floor(Math.random() * arr.length);

    return arr[randomIndex];
};

async function isCmd(m, ctx) {
    const prefixRegex = new RegExp(ctx._config.prefix, "i");
    const content = m.content && m.content.trim();

    if (!prefixRegex.test(content)) return false;

    const [cmdName] = content.slice(1).trim().toLowerCase().split(/\s+/);

    for (const cmd of ctx._config.cmd.values()) {
        if (cmd.name === cmdName || (cmd.aliases && cmd.aliases.includes(cmdName))) return true;
    }

    return false;
};

async function isAdmin(ctx, number) {
    const isAdmin = await checkAdmin(ctx, number || ctx._sender.jid.split("@")[0]);

    return isAdmin ? 1 : 0;
};

async function isBotAdmin(ctx) {
    const isBotAdmin = await checkAdmin(ctx, ctx._client.user.id.split(":")[0]);

    return isBotAdmin ? 1 : 0;
};

async function isOwner(ctx, number) {
    const isOwner = ctx._client.user.id.split(":")[0] == number || global.owner.number === number || global.owner.co.includes(number);

    return isOwner ? 1 : 0;
};

function ucword(str) {
    return str.toLowerCase().replace(/\b(\w)/g, (s) => s.toUpperCase());
}

module.exports = {
    convertMsToDuration,
    download,
    formatSize,
    getRandomElement,
    isCmd,
    isAdmin,
    isBotAdmin,
    isOwner,
    ucword
};