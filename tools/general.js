const {
    S_WHATSAPP_NET
} = require("@whiskeysockets/baileys");

async function checkAdmin(ctx, id) {
    try {
        const members = await ctx.group().members();
        return members.filter((m) => (m.admin === "superadmin" || m.admin === "admin") && m.id == id).length ? true : false;
    } catch (error) {
        console.error("Error:", error);
        return false;
    }
}

function convertMsToDuration(ms) {
    try {
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / (1000 * 60)) % 60);
        const hours = Math.floor(ms / (1000 * 60 * 60));
        let durationString = "";
        if (hours > 0) durationString += hours + " jam ";
        if (minutes > 0) durationString += minutes + " menit ";
        if (seconds > 0) durationString += seconds + " detik";
        return durationString;
    } catch (error) {
        console.error("Error:", error);
        return "";
    }
}

function formatSize(bytes) {
    try {
        const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
        if (bytes === 0) return "0 Byte";
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
    } catch (error) {
        console.error("Error:", error);
        return "";
    }
}

function getRandomElement(arr) {
    try {
        if (arr.length === 0) return undefined;
        const randomIndex = Math.floor(Math.random() * arr.length);
        return arr[randomIndex];
    } catch (error) {
        console.error("Error:", error);
        return undefined;
    }
}

function isCmd(m, ctx) {
    try {
        const prefixRegex = new RegExp(ctx._config.prefix, "i");
        const content = m.content && m.content.trim();
        if (!prefixRegex.test(content)) return false;
        const [cmdName] = content.slice(1).trim().toLowerCase().split(/\s+/);
        for (const cmd of ctx._config.cmd.values()) {
            if (cmd.name === cmdName || (cmd.aliases && cmd.aliases.includes(cmdName))) return true;
        }
        return false;
    } catch (error) {
        console.error("Error:", error);
        return false;
    }
}

async function isAdmin(ctx, obj) {
    try {
        const id = obj.id || ctx.sender.jid;
        const isAdmin = await checkAdmin(ctx, id);
        return isAdmin ? 1 : 0;
    } catch (error) {
        console.error("Error:", error);
        return 0;
    }
}

async function isBotAdmin(ctx) {
    try {
        const id = ctx._client.user.id.split(":")[0] + S_WHATSAPP_NET;
        const isBotAdmin = await checkAdmin(ctx, id);
        return isBotAdmin ? 1 : 0;
    } catch (error) {
        console.error("Error:", error);
        return 0;
    }
}

function isOwner(ctx, obj) {
    try {
        const id = obj.id || ctx.sender.jid.replace(/@.*|:.*/g, "");
        const isOwner = obj.selfOwner ? ctx._client.user.id.split(":")[0] === id || global.owner.number === id || global.owner.co.includes(id) : global.owner.number === id || global.owner.co.includes(id);
        return isOwner ? 1 : 0;
    } catch (error) {
        console.error("Error:", error);
        return 0;
    }
}

function ucword(str) {
    try {
        return str.toLowerCase().replace(/\b(\w)/g, (s) => s.toUpperCase());
    } catch (error) {
        console.error("Error:", error);
        return "";
    }
}

module.exports = {
    convertMsToDuration,
    formatSize,
    getRandomElement,
    isCmd,
    isAdmin,
    isBotAdmin,
    isOwner,
    ucword
};