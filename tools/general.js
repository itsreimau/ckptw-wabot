const api = require("./api.js");
const axios = require("axios");
const cheerio = require("cheerio");
const FormData = require("form-data");
const {
    fromBuffer
} = require("file-type");
const {
    S_WHATSAPP_NET
} = require("@whiskeysockets/baileys");

async function checkAdmin(ctx, id) {
    try {
        const members = await ctx.group().members();
        return members.some((m) => (m.admin === "superadmin" || m.admin === "admin") && m.id === id);
    } catch (error) {
        console.error(`[${global.config.pkg.name}] Error:`, error);
        return false;
    }
}

async function checkMedia(msgType, requiredMedia, ctx) {
    const mediaMap = {
        audio: "audioMessage",
        contact: "contactMessage",
        document: ["documentMessage", "documentWithCaptionMessage"],
        gif: "videoMessage",
        image: "imageMessage",
        liveLocation: "liveLocationMessage",
        location: "locationMessage",
        payment: "paymentMessage",
        poll: "pollMessage",
        product: "productMessage",
        ptt: "audioMessage",
        reaction: "reactionMessage",
        sticker: "stickerMessage",
        text: () => ctx.args.length > 0 ? "teks" : null,
        video: "videoMessage",
        viewOnce: "viewOnceMessageV2"
    };

    const mediaList = Array.isArray(requiredMedia) ? requiredMedia : [requiredMedia];

    return mediaList.some(media => {
        if (media === "document") {
            return mediaMap[media].includes(msgType);
        } else if (media === "text") {
            return mediaMap[media]();
        }
        return msgType === mediaMap[media];
    });
}

async function checkQuotedMedia(quoted, requiredMedia) {
    const quotedMediaMap = {
        audio: quoted.audioMessage,
        contact: quoted.contactMessage,
        document: quoted.documentMessage || quoted.documentWithCaptionMessage,
        gif: quoted.videoMessage,
        image: quoted.imageMessage,
        liveLocation: quoted.liveLocationMessage,
        location: quoted.locationMessage,
        payment: quoted.paymentMessage,
        poll: quoted.pollMessage,
        product: quoted.productMessage,
        ptt: quoted.audioMessage,
        reaction: quoted.reactionMessage,
        sticker: quoted.stickerMessage,
        text: quoted.conversation || quoted.extendedTextMessage?.text,
        video: quoted.videoMessage,
        viewOnce: quoted.viewOnceMessageV2
    };

    const mediaList = Array.isArray(requiredMedia) ? requiredMedia : [requiredMedia];

    return mediaList.some(media => {
        const mediaContent = quotedMediaMap[media];
        if (mediaContent) {
            if (media === "text") {
                return mediaContent.length > 0;
            } else if (quoted.media) {
                return quoted.media.toBuffer().catch(() => null) !== null;
            }
        }
        return false;
    });
}

function convertMsToDuration(ms) {
    try {
        if (ms < 1000) {
            return "kurang satu detik";
        }

        const years = Math.floor(ms / (1000 * 60 * 60 * 24 * 365.25));
        const months = Math.floor((ms / (1000 * 60 * 60 * 24 * 30.44)) % 12);
        const weeks = Math.floor((ms / (1000 * 60 * 60 * 24 * 7)) % 4.345);
        const days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 7);
        const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((ms / (1000 * 60)) % 60);
        const seconds = Math.floor((ms / 1000) % 60);

        let durationString = "";

        if (years > 0) {
            durationString += years + " tahun ";
        }
        if (months > 0) {
            durationString += months + " bulan ";
        }
        if (weeks > 0) {
            durationString += weeks + " minggu ";
        }
        if (days > 0) {
            durationString += days + " hari ";
        }
        if (hours > 0) {
            durationString += hours + " jam ";
        }
        if (minutes > 0) {
            durationString += minutes + " menit ";
        }
        if (seconds > 0) {
            durationString += seconds + " detik";
        }

        return durationString.trim();
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
        return false;
    }
}

async function isAdmin(ctx, id) {
    try {
        const jid = id || ctx.sender.jid;
        return await checkAdmin(ctx, jid);
    } catch (error) {
        console.error(`[${global.config.pkg.name}] Error:`, error);
        return false;
    }
}

async function isBotAdmin(ctx) {
    try {
        const id = ctx._client.user.id.split(":")[0][0] + S_WHATSAPP_NET;
        return await checkAdmin(ctx, id);
    } catch (error) {
        console.error(`[${global.config.pkg.name}] Error:`, error);
        return false;
    }
}

function isOwner(ctx, id, selfOwner) {
    try {
        const jid = id || ctx.sender.jid.split("@")[0];
        return selfOwner ?
            ctx._client.user.id.split(":")[0] === jid || global.config.owner.number === jid || global.config.owner.co.includes(id) :
            global.config.owner.number === jid || global.config.owner.co.includes(id);
    } catch (error) {
        console.error(`[${global.config.pkg.name}] Error:`, error);
        return false;
    }
}

function parseFlag(argsString, customRules = {}) {
    if (!argsString || argsString.trim() === "") {
        return false;
    }

    const options = {};
    let input = [];

    const args = argsString.split(" ");

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        let isFlag = false;

        for (const flag in customRules) {
            if (arg === flag) {
                const rule = customRules[flag];
                isFlag = true;

                if (rule.type === "value") {
                    const value = args[i + 1];
                    if (value && rule.validator(value)) {
                        options[rule.key] = rule.parser(value);
                        i++;
                    }
                } else if (rule.type === "boolean") {
                    options[rule.key] = true;
                }
                break;
            }
        }

        if (!isFlag) {
            input.push(arg);
        }
    }

    options.input = input.join(" ");

    return options;
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

async function upload(buffer) {
    try {
        const {
            ext
        } = await fromBuffer(buffer);
        if (!ext) {
            throw new Error("Could not determine file type from buffer");
        }

        let form = new FormData();
        form.append("file", buffer, "tmp." + ext);

        const apiUrl = api.createUrl("https://uploader.nyxs.pw", "/upload", {});
        const response = await axios.post(apiUrl, form, {
            headers: {
                ...form.getHeaders()
            }
        });

        const $ = cheerio.load(response.data);
        const url = $("a").attr("href");

        if (!url) throw new Error("URL not found in response");

        return url;
    } catch (error) {
        console.error(`[${global.config.pkg.name}] Error:`, error);
        return null;
    }
}

module.exports = {
    checkMedia,
    checkQuotedMedia,
    convertMsToDuration,
    formatSize,
    getRandomElement,
    isCmd,
    isAdmin,
    isBotAdmin,
    isOwner,
    parseFlag,
    translate,
    ucword,
    upload
};