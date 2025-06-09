// Impor modul dan dependensi yang diperlukan
const api = require("./api.js");
const {
    monospace,
    quote
} = require("@itsreimau/ckptw-mod");
const uploader = require("@zanixongroup/uploader");
const axios = require("axios");
const didYouMean = require("didyoumean");
const util = require("node:util");

const formatBotName = (botName) => {
    if (!botName) return null;

    botName = botName.toLowerCase();
    return botName.replace(/[aiueo0-9\W_]/g, "");
};

async function checkMedia(type, required) {
    if (!type || !required) return false;

    const mediaMap = {
        audio: "audioMessage",
        document: ["documentMessage", "documentWithCaptionMessage"],
        gif: "videoMessage",
        groupStatusMention: "groupStatusMentionMessage",
        image: "imageMessage",
        sticker: "stickerMessage",
        video: "videoMessage"
    };

    const mediaList = Array.isArray(required) ? required : [required];

    for (const media of mediaList) {
        const mappedType = mediaMap[media];
        if (!mappedType) continue;

        if (Array.isArray(mappedType)) {
            if (mappedType.includes(type)) return media;
        } else {
            if (type === mappedType) return media;
        }
    }

    return false;
}

async function checkQuotedMedia(type, required) {
    if (!type || !required) return false;

    const typeMediaMap = {
        audio: type.audioMessage,
        document: type.documentMessage || type.documentWithCaptionMessage,
        gif: type.videoMessage,
        image: type.imageMessage,
        sticker: type.stickerMessage,
        text: type.conversation || type.extendedTextMessage?.text,
        video: type.videoMessage
    };

    const mediaList = Array.isArray(required) ? required : [required];

    for (const media of mediaList) {
        if (media === "text") {
            const mediaContent = typeMediaMap.text;
            if (mediaContent && mediaContent.length > 0) return media;
        } else if (media === "viewOnce") {
            const viewOnceMediaKeys = ["audioMessage", "imageMessage", "videoMessage"];
            if (viewOnceMediaKeys.some(key => type[key]?.viewOnce === true)) return media;
        } else {
            if (typeMediaMap[media]) return media;
        }
    }

    return false;
}

function fakeMetaAiQuotedText(text) {
    if (!text) return null;

    const quoted = {
        key: {
            participant: "13135550002@s.whatsapp.net",
            remoteJid: "status@broadcast"
        },
        message: {
            extendedTextMessage: {
                text
            }
        }
    };
    return quoted;
}

function generateUID(id, withBotName) {
    if (!id) return null;

    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        const charCode = id.charCodeAt(i);
        hash = (hash * 31 + charCode) % 1000000007;
    }

    const uniquePart = id.split("").reverse().join("").charCodeAt(0).toString(16);
    let uid = `${Math.abs(hash).toString(16).toLowerCase()}-${uniquePart}`;
    if (withBotName) uid += `_${formatBotName(config.bot.name)}-wabot`;

    return uid;
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

async function handleError(ctx, error, useAxios) {
    const isGroup = ctx.isGroup();
    const groupJid = isGroup ? ctx.id : null;
    const groupSubject = isGroup ? await ctx.group(groupJid).name() : null;
    const errorText = util.format(error);

    consolefy.error(`Error: ${errorText}`);
    if (config.system.reportErrorToOwner) await ctx.replyWithJid(`${config.owner.id}@s.whatsapp.net`, {
        text: `${quote(isGroup ? `⚠️ Terjadi kesalahan dari grup: @${groupJid}, oleh: @${tools.cmd.getID(ctx.sender.jid)}` : `⚠️ Terjadi kesalahan dari: @${tools.cmd.getID(ctx.sender.jid)}`)}\n` +
            `${quote("─────")}\n` +
            monospace(errorText),
        contextInfo: {
            mentionedJid: [ctx.sender.jid],
            groupMentions: isGroup ? [{
                groupJid,
                groupSubject
            }] : []
        }
    });
    if (useAxios && error.status !== 200) return await ctx.reply(config.msg.notFound);
    return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
}

function isCmd(content, bot) {
    if (!content || !bot) return null;

    const prefix = content.charAt(0);
    if (!new RegExp(bot.prefix, "i").test(content)) return false;

    const [cmdName, ...inputArray] = content.slice(1).trim().toLowerCase().split(/\s+/);
    const input = inputArray.join(" ");

    const commands = Array.from(bot.cmd.values());
    const matchedCmd = commands.find(c => c.name === cmdName || c.aliases?.includes(cmdName));

    if (matchedCmd) return {
        msg: content,
        prefix,
        name: cmdName,
        input
    };

    const mean = didYouMean(cmdName, commands.flatMap(c => [c.name, ...(c.aliases || [])]));

    return mean ? {
        msg: content,
        prefix,
        cmd: cmdName,
        input,
        didyoumean: mean
    } : false;
}

function isOwner(id, messageId) {
    if (!id) return false;

    if (config.system.selfOwner) {
        if (messageId?.startsWith("3EB0")) return false; // Anti rce (aka backdoor) ygy
        return config.bot.id === id || config.owner.id === id || config.owner.co.includes(id);
    }

    return config.owner.id === id || config.owner.co.includes(id);
}

function isUrl(url) {
    if (!url) return false;

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return urlRegex.test(url);
}

function parseFlag(argsString, customRules = {}) {
    if (!argsString) return {
        input: ""
    };

    const options = {};
    const input = [];

    const args = argsString.trim().split(/\s+/);

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        if (customRules[arg]) {
            const rule = customRules[arg];

            if (rule.type === "value") {
                const value = args[i + 1];

                if (value && rule.validator(value)) {
                    options[rule.key] = rule.parser(value);
                    i++;
                } else {
                    options[rule.key] = rule.default || null;
                }
            } else if (rule.type === "boolean") {
                options[rule.key] = true;
            }
        } else {
            input.push(arg);
        }
    }

    options.input = input.join(" ");
    return options;
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

async function upload(buffer, type = "any", host = config.system.uploaderHost) {
    if (!buffer) return null;

    const hosts = {
        any: ["FastUrl", "Nyxs", "Litterbox", "Cloudku", "Catbox", "Uguu"],
        image: ["Quax", "Ryzen", "TmpErhabot", "Shojib", "IDNet", "Erhabot", "Pomf"],
        video: ["Quax", "Ryzen", "TmpErhabot", "Videy", "Pomf"],
        audio: ["Quax", "Ryzen", "TmpErhabot", "Pomf"],
        document: ["IDNet"]
    };

    let availableHosts = [...hosts.any];
    if (type !== "any" && hosts[type]) availableHosts = [...hosts[type]];

    const realHost = availableHosts.find(h => h.toLowerCase() === host.toLowerCase());

    let hostsToTry = realHost ? [realHost, ...availableHosts.filter(h => h !== realHost)] : availableHosts;

    for (const currentHost of hostsToTry) {
        try {
            const url = await uploader[currentHost](buffer);
            if (url) return url;
        } catch (error) {
            consolefy.error(`Error: ${error}`);
        }
    }

    return null;
}

module.exports = {
    checkMedia,
    checkQuotedMedia,
    fakeMetaAiQuotedText,
    generateUID,
    getID,
    getRandomElement,
    handleError,
    isCmd,
    isOwner,
    isUrl,
    parseFlag,
    translate,
    upload
};