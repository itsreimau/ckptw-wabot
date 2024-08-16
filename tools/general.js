const {
    S_WHATSAPP_NET
} = require("@whiskeysockets/baileys");

async function checkAdmin(ctx, id) {
    const members = await ctx.group().members();
    const find = members.find((m) => m.id == id);
    if (find?.admin) return true;
}

exports.convertMsToDuration = (ms) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));
    let durationString = "";
    if (hours > 0) durationString += hours + " jam ";
    if (minutes > 0) durationString += minutes + " menit ";
    if (seconds > 0) durationString += seconds + " detik";
    return durationString;
};

exports.formatSize = (bytes) => {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 Byte";
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
};

exports.getRandomElement = (arr) => {
    if (arr.length === 0) return undefined;
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
};

exports.isCmd = (ctx, obj) => {
    const prefixRegex = new RegExp(ctx._config.prefix, "i");
    const content = obj.m.content && obj.m.content.trim();
    if (!prefixRegex.test(content)) return false;
    const [cmdName] = content.slice(1).trim().toLowerCase().split(/\s+/);
    for (const cmd of ctx._config.cmd.values()) {
        if (cmd.name === cmdName || (cmd.aliases && cmd.aliases.includes(cmdName))) return true;
    }
    return false;
};

exports.isAdmin = async (ctx, obj) => {
    const id = obj.id || ctx._sender.jid;
    const isAdmin = await checkAdmin(ctx, id);
    return isAdmin ? 1 : 0;
};

exports.isBotAdmin = async (ctx) => {
    const id = ctx._client.user.split(":")[0] + S_WHATSAPP_NET;
    const isBotAdmin = await checkAdmin(ctx, id);
    return isBotAdmin ? 1 : 0;
};

exports.isOwner = (ctx, obj) => {
    const id = obj.id || ctx._sender.jid.replace(/@.*|:.*/g, '');
    const isOwner = global.owner.number === id || global.owner.co.includes(id);
    return isOwner ? 1 : 0;
};

exports.ucword = (str) => {
    return str.toLowerCase().replace(/\b(\w)/g, (s) => s.toUpperCase());
};