// Import modul dan dependensi
const api = require("./api.js");
const axios = require("axios");
const cheerio = require("cheerio");
const didyoumean = require("didyoumean");
const FormData = require("form-data");
const {
    fromBuffer
} = require("file-type");

async function checkMedia(msgType, requiredMedia) {
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
        video: "videoMessage",
        viewOnce: "viewOnceMessageV2"
    };

    const mediaList = Array.isArray(requiredMedia) ? requiredMedia : [requiredMedia];

    return mediaList.some(media => {
        if (media === "document") {
            return mediaMap[media].includes(msgType);
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
        return media === "text" ? mediaContent && mediaContent.length > 0 : mediaContent;
    });
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
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
    if (byteCount === 0) return "0 Bytes";

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
    if (typeof id !== "string") {
        id = id.toString();
    }

    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        const charCode = id.charCodeAt(i);
        hash = (hash * 31 + charCode) % 1000000007;
    }

    const uniquePart = id.split("").reverse().join("").charCodeAt(0).toString(16);

    return `${Math.abs(hash).toString(16).toLowerCase()}-${uniquePart}`;
}

function getID(jid) {
    return jid.split("@")[0].split(":")[0];
}

function getRandomElement(arr) {
    if (!arr.length) return null;

    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

function isCmd(content, config) {
    const prefixRegex = new RegExp(config.prefix, "i");

    if (!prefixRegex.test(content)) return false;

    const prefix = content.charAt(0);
    const [cmdName, ...inputArray] = content.slice(1).trim().toLowerCase().split(/\s+/);
    const input = inputArray.join(" ");

    const cmd = config.cmd;
    const listCmd = Array.from(cmd.values()).flatMap(command => {
        const aliases = Array.isArray(command.aliases) ? command.aliases : [];
        return [command.name, ...aliases];
    });

    const matchedCmd = cmd.get(cmdName) || Array.from(cmd.values()).find(c => c.aliases && c.aliases.includes(cmdName));

    if (matchedCmd) {
        return {
            msg: content,
            prefix,
            name: cmdName,
            input
        };
    }

    const mean = didyoumean(cmdName, listCmd);

    if (mean) {
        return {
            msg: content,
            prefix,
            cmd: cmdName,
            input,
            didyoumean: mean
        };
    }

    return false;
}

function isOwner(id) {
    if (config.system.selfOwner) return config.bot.id === id || config.owner.id === id || config.owner.co.includes(id);

    return config.owner.id === id || config.owner.co.includes(id);
}

function isUrl(url) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return urlRegex.test(url);
}

function parseFlag(argsString, customRules = {}) {
    if (!argsString || argsString.trim() === "") return false;

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
        consolefy.error(`Error: ${error}`);
        return null;
    }
}

function ucword(str) {
    if (!str || str.trim() === "") return false;

    return str.toLowerCase().replace(/\b(\w)/g, (s) => s.toUpperCase());
}

async function upload(buffer) {
    try {
        const {
            ext
        } = await fromBuffer(buffer);

        let form = new FormData();
        form.append("file", buffer, `tmp.${ext}`);

        const apiUrl = api.createUrl("https://uploader.nyxs.pw", "/upload", {});
        const response = await axios.post(apiUrl, form, {
            headers: {
                ...form.getHeaders()
            }
        });

        const $ = cheerio.load(response.data);
        const url = $("a").attr("href");

        return url;
    } catch (error) {
        consolefy.error(`Error: ${error}`);
        return null;
    }
}

module.exports = {
    checkMedia,
    checkQuotedMedia,
    clamp,
    convertMsToDuration,
    formatSize,
    generateUID,
    getID,
    getRandomElement,
    isCmd,
    isOwner,
    isUrl,
    parseFlag,
    translate,
    ucword,
    upload
};