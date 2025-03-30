// Impor modul dan dependensi yang diperlukan
const api = require("./api.js");
const uploader = require("@zanixongroup/uploader");
const axios = require("axios");
const didyoumean = require("didyoumean");
const Jimp = require("jimp");

function formatBotName(botName) {
    if (!botName) return null;
    botName = botName.toLowerCase();
    return botName.replace(/[aiueo0-9\W_]/g, "");
}

async function checkMedia(msgType, requiredMedia) {
    if (!msgType || !requiredMedia) return false;

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
    if (!quoted || !requiredMedia) return false;

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

function parseFlag(argsString, customRules = {}) {
    if (!argsString) return null;

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

async function resizeWithBlur(input, width, height) {
    try {
        let image;

        if (isUrl(input)) {
            const response = await axios.get(input, {
                responseType: "arraybuffer"
            });
            image = await Jimp.read(response.data);
        } else {
            image = await Jimp.read(input);
        }

        const bg = image.clone().resize(width, height).blur(20);

        image.scaleToFit(width, height);
        bg.composite(image, (width - image.bitmap.width) / 2, (height - image.bitmap.height) / 2);

        const buffer = await bg.getBufferAsync(Jimp.MIME_JPEG);
        return {
            url: await upload(buffer, "image"),
            buffer
        };
    } catch (error) {
        consolefy.error(`Error: ${error.message}`);
        return null;
    }
}

async function translate(text, to) {
    if (!text || !to) return null;

    try {
        const apiUrl = api.createUrl("nyxs", "/tools/translate", {
            text,
            to
        });
        const {
            data
        } = await axios.get(apiUrl);
        return data.result;
    } catch (error) {
        consolefy.error(`Error: ${error}`);
        return null;
    }
}

function ucword(text) {
    if (!text) return false;

    return text.toLowerCase().replace(/\b(\w)/g, (s) => s.toUpperCase());
}

async function upload(buffer, type, host) {
    if (!buffer || !type) return null;

    const hosts = {
        any: ["FastUrl", "Litterbox", "Catbox", "Uguu"],
        image: ["Pomf", "Quax", "Ryzen", "Shojib", "Erhabot", "TmpErhabot"],
        video: ["Pomf", "Quax", "Videy", "Ryzen", "TmpErhabot"],
        audio: ["Pomf", "Quax", "Ryzen", "TmpErhabot"]
    };

    try {
        if (host) {
            if (!hosts[type] || !hosts[type].includes(host)) return `Host '${host}' tidak mendukung tipe '${type}'`;
            return await uploader[host](buffer);
        }

        for (const h of (hosts[type] || hosts.any)) {
            try {
                const url = await uploader[h](buffer);
                if (url) return url;
            } catch (err) {
                continue;
            }
        }
    } catch (error) {
        consolefy.error(`Error: ${error.message}`);
        return null;
    }
}

module.exports = {
    checkMedia,
    checkQuotedMedia,
    convertMsToDuration,
    formatSize,
    generateUID,
    getID,
    getRandomElement,
    isCmd,
    isOwner,
    isUrl,
    parseFlag,
    resizeWithBlur,
    translate,
    ucword,
    upload
};