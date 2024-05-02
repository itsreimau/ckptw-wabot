const {
    downloadContentFromMessage
} = require('@whiskeysockets/baileys');
const axios = require('axios');
const cheerio = require('cheerio');
const FormData = require('form-data');

/**
 * Function to check if the user is an admin in the group.
 * @param {object} ctx - The context object.
 * @param {string} id - The ID of the user.
 * @returns {number} Returns 1 if the user is an admin, otherwise returns 0.
 */
async function checkAdmin(ctx, id) {
    const group = await ctx._client.groupMetadata(ctx.id);
    const formattedId = `${id}@s.whatsapp.net`;

    return group.participants.filter(v => (v.admin === 'superadmin' || v.admin === 'admin') && v.id == formattedId).length ? true : false;
}

/**
 * Function to convert milliseconds to human-readable duration.
 * @param {number} ms - The time duration in milliseconds.
 * @returns {string} Returns the human-readable duration string.
 */
exports.convertMsToDuration = (ms) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));
    let durationString = '';

    if (hours > 0) durationString += hours + ' jam ';

    if (minutes > 0) durationString += minutes + ' menit ';

    if (seconds > 0) durationString += seconds + ' detik';

    return durationString;
}

/**
 * Function to download content from a message.
 * @param {object} object - The object containing message content.
 * @param {string} type - The type of content to download.
 * @returns {Buffer} Returns the downloaded content as a buffer.
 */
exports.download = async (object, type) => {
    const stream = await downloadContentFromMessage(object, type);
    let buffer = Buffer.from([]);

    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }

    return buffer;
}

/**
 * Function to format file size into human-readable format.
 * @param {number} bytes - The size of the file in bytes.
 * @returns {string} Returns the human-readable file size string.
 */
exports.formatSize = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    if (bytes === 0) return '0 Byte';

    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

/*
 * Function to get a random element from an array.
 * @param {Array} arr - The input array.
 * @returns {*} Returns a random element from the array. If the array is empty, returns undefined.
 */
exports.getRandomElement = (arr) => {
    if (arr.length === 0) return undefined;

    const randomIndex = Math.floor(Math.random() * arr.length);

    return arr[randomIndex];
}

/**
 * Function to check if a message is a command.
 * @param {object} m - The message object.
 * @param {object} ctx - The context object.
 * @returns {boolean} Returns true if the message is a command, otherwise false.
 */
exports.isCmd = (m, ctx) => {
    const prefixRegex = new RegExp(ctx._config.prefix, 'i');
    const content = m.content && m.content.trim();

    if (!prefixRegex.test(content)) return false;

    const [cmdName] = content.slice(1).trim().toLowerCase().split(/\s+/);

    for (const cmd of ctx._config.cmd.values()) {
        if (cmd.name === cmdName || (cmd.aliases && cmd.aliases.includes(cmdName))) return true;
    }

    return false;
}

/**
 * Function to check if the user is an admin.
 * @param {object} ctx - The context object.
 * @param {number} number - The user number.
 * @returns {number} Returns 1 if the user is an admin, otherwise returns 0.
 */
exports.isAdmin = async (ctx, number) => {
    const isAdmin = await checkAdmin(ctx, number || ctx._sender.jid.split('@')[0]);
    return isAdmin ? 1 : 0;
}

/**
 * Function to check if the bot is an admin of the group.
 * @param {object} ctx - The context object.
 * @returns {number} Returns 1 if the bot is an admin of the group, otherwise returns 0.
 */
exports.isAdminOf = async (ctx) => {
    const isAdminOfGroup = await checkAdmin(ctx, ctx._client.user.id.split(':')[0]);
    return isAdminOfGroup ? 1 : 0;
}

/**
 * Function to check if the user is the owner.
 * @param {number} number - The user number.
 * @returns {number} Returns 1 if the user is the owner, otherwise returns 0.
 */
exports.isOwner = (number) => {
    const isOwner = number.includes(global.owner.number);
    return isOwner ? 1 : 0;
}

/**
 * Function to convert a string to title case.
 * @param {string} str - The string to convert.
 * @returns {string} Returns the title cased string.
 */
exports.ucword = (str) => {
    return str.toLowerCase().replace(/\b(\w)/g, s => s.toUpperCase());
}

/**
 * Converts a string to title case.
 * @param {string} str - The string to convert.
 * @returns {string} The title cased string.
 */
exports.webp2mp4File = (source) => {
    return new Promise((resolve, reject) => {
        const form = new FormData();
        let isUrl = typeof source === 'string' && /https?:\/\//.test(source);
        form.append('new-image-url', isUrl ? source : "");
        form.append('new-image', isUrl ? "" : source, Date.now() + "-image.webp");

        axios({
            method: 'post',
            url: 'https://s6.ezgif.com/webp-to-mp4',
            data: form,
            headers: {
                'Content-Type': `multipart/form-data; boundary=${form._boundary}`
            }
        }).then(({
            data
        }) => {
            const bodyFormThen = new FormData();
            const $ = cheerio.load(data);
            const file = $('input[name="file"]').attr('value');
            const token = $('input[name="token"]').attr('value');
            const convert = $('input[name="file"]').attr('value');

            bodyFormThen.append('file', file);
            bodyFormThen.append('convert', "Convert WebP to MP4!");

            axios({
                method: 'post',
                url: 'https://ezgif.com/webp-to-mp4/' + file,
                data: bodyFormThen,
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${bodyFormThen._boundary}`
                }
            }).then(({
                data
            }) => {
                const $ = cheerio.load(data);
                const result = 'https:' + $('div#output > p.outfile > video > source').attr('src');
                resolve(result);
            }).catch(reject);
        }).catch(reject);
    });
}