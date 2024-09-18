const api = require("./api.js");
const axios = require("axios");
const {
    S_WHATSAPP_NET
} = require("@whiskeysockets/baileys");

async function checkAdmin(ctx, id) {
    try {
        const members = await ctx.group().members();
        return members.filter((m) => (m.admin === "superadmin" || m.admin === "admin") && m.id == id).length ? true : false;
    } catch (error) {
        console.error(`[${global.config.pkg.name}] Error:`, error);
        return null;
    }
}

function convertMsToDuration(ms) {
    try {
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / (1000 * 60)) % 60);
        const hours = Math.floor(ms / (1000 * 60 * 60));
        let durationString = "";

        if (hours > 0) {
            durationString += hours + " jam ";
        }
        if (minutes > 0) {
            durationString += minutes + " menit ";
        }
        if (seconds > 0) {
            durationString += seconds + " detik";
        }

        return durationString;
    } catch (error) {
        console.error(`[${global.config.pkg.name}] Error:`, error);
        return null;
    }
}

function formatSize(bytes) {
    try {
        const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
        if (bytes === 0) {
            return "0 Byte";
        }
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
    } catch (error) {
        console.error(`[${global.config.pkg.name}] Error:`, error);
        return null;
    }
}

function getRandomElement(arr) {
    try {
        if (arr.length === 0) {
            return null;
        }
        const randomIndex = Math.floor(Math.random() * arr.length);
        return arr[randomIndex];
    } catch (error) {
        console.error(`[${global.config.pkg.name}] Error:`, error);
        return null;
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
        console.error(`[${global.config.pkg.name}] Error:`, error);
        return null;
    }
}

async function isAdmin(ctx, id) {
    try {
        const jid = id || ctx.sender.jid;
        const isAdmin = await checkAdmin(ctx, jid);
        return isAdmin;
    } catch (error) {
        console.error(`[${global.config.pkg.name}] Error:`, error);
        return null;
    }
}

async function isBotAdmin(ctx) {
    try {
        const id = ctx._client.user.id.split(":")[0] + S_WHATSAPP_NET;
        const isBotAdmin = await checkAdmin(ctx, id);
        return isBotAdmin;
    } catch (error) {
        console.error(`[${global.config.pkg.name}] Error:`, error);
        return null;
    }
}

function isOwner(ctx, id, selfOwner) {
    try {
        const jid = id || ctx.sender.jid.replace(/@.*|:.*/g, null);
        const isOwner = selfOwner ? ctx._client.user.id.split(":")[0] === jid || global.config.owner.number === jid || global.config.owner.co.includes(id) : global.config.owner.number === jid || global.config.owner.co.includes(id);
        return isOwner;
    } catch (error) {
        console.error(`[${global.config.pkg.name}] Error:`, error);
        return null;
    }
}

async function translate(text, to) {
    const apiUrl = api.createUrl("nyxs", "/tools/translate", {
        text,
        to
    });

    try {
        const {
            data
        } = await axios.get(apiUrl);
        return data.result;
    } catch (error) {
        console.error(`[${global.config.pkg.name}] Error:`, error);
        return null;
    }
}

function ucword(str) {
    try {
        return str.toLowerCase().replace(/\b(\w)/g, (s) => s.toUpperCase());
    } catch (error) {
        console.error(`[${global.config.pkg.name}] Error:`, error);
        return null;
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
    translate,
    ucword
};