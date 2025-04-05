// Impor modul dan dependensi yang diperlukan
const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const util = require("node:util");

async function checkMedia(msgTypeContent, requiredMedia) {
    if (!msgTypeContent || !requiredMedia) return false;

    const mediaList = Array.isArray(requiredMedia) ? requiredMedia : [requiredMedia];

    return mediaList.some(media => {
        if (media === "document") return msgTypeContent.documentMessage || msgTypeContent.documentWithCaptionMessage;

        if (media === "viewOnce") {
            const typesWithViewOnce = ["imageMessage", "videoMessage", "audioMessage"];
            return typesWithViewOnce.some(type => msgTypeContent[type]?.viewOnce);
        }

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
            video: "videoMessage"
        };

        const type = mediaMap[media];
        if (Array.isArray(type)) return type.some(t => msgTypeContent[t]);

        return !!msgTypeContent[type];
    });
}

async function checkQuotedMedia(quoted, requiredMedia) {
    if (!quoted || !requiredMedia) return false;

    const mediaList = Array.isArray(requiredMedia) ? requiredMedia : [requiredMedia];

    return mediaList.some(media => {
        if (media === "viewOnce") {
            const typesWithViewOnce = ["imageMessage", "videoMessage", "audioMessage"];
            return typesWithViewOnce.some(type => quoted[type]?.viewOnce);
        }

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
            video: quoted.videoMessage
        };

        const mediaContent = quotedMediaMap[media];
        return media === "text" ? mediaContent && mediaContent.length > 0 : !!mediaContent;
    });
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
        "contact": "kontak",
        "document": "dokumen",
        "gif": "GIF",
        "image": "gambar",
        "liveLocation": "lokasi langsung",
        "location": "lokasi",
        "payment": "pembayaran",
        "poll": "polling",
        "product": "produk",
        "ptt": "pesan suara",
        "reaction": "reaksi",
        "sticker": "stiker",
        "templateMessage": "pesan template",
        "text": "teks",
        "video": "video",
        "viewOnce": "sekali lihat"
    };

    const translatedMediaTypeList = translatedMediaTypes.map(type => mediaTypeTranslations[type]);

    let mediaTypesList;
    if (translatedMediaTypeList.length > 1) {
        const lastMediaType = translatedMediaTypeList[translatedMediaTypeList.length - 1];
        mediaTypesList = translatedMediaTypeList.slice(0, -1).join(", ") + `, atau ${lastMediaType}`;
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

function generateCommandExample(used, args) {
    if (!used) return "'used' harus diberikan!";

    if (!args) return "'args' harus diberikan!";

    const commandMessage = `Contoh: ${monospace(`${used.prefix + used.command} ${args}`)}`;
    return commandMessage;
}

function generatesFlagInformation(flags) {
    if (typeof flags !== "object" || !flags) return "'flags' harus berupa objek!";

    const flagInfo = "Flag:\n" +
        Object.entries(flags).map(([flag, description]) =>
            quote(`• ${monospace(flag)}: ${description}`)
        ).join("\n");

    return flagInfo;
}

function generateNotes(notes) {
    if (!Array.isArray(notes)) return "'notes' harus berupa string!";

    const notesInfo = "Catatan:\n" +
        notes.map(note =>
            quote(`• ${note}`)
        ).join("\n");

    return notesInfo;
}

async function handleError(ctx, error, useAxios) {
    const errorText = util.format(error);
    consolefy.error(`Error: ${errorText}`);
    if (config.system.reportErrorToOwner) await ctx.replyWithJid(`${config.owner.id}@s.whatsapp.net`, {
        text: `${quote(`⚠️ Terjadi kesalahan:`)}\n` +
            `${quote("─────")}\n` +
            monospace(errorText)
    });
    if (useAxios && error.status !== 200) return await ctx.reply(config.msg.notFound);
    return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
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


module.exports = {
    checkMedia,
    checkQuotedMedia,
    generateInstruction,
    generateCommandExample,
    generatesFlagInformation,
    generateNotes,
    handleError,
    parseFlag
};