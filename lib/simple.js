require('../config.js');
const {
    downloadContentFromMessage
} = require('@whiskeysockets/baileys');
const uploadToImgbb = require('imgbb-uploader');

let lastDate = new Date();
let counter = 1;

const generateFileName = () => {
    let currentDate = new Date();
    if (currentDate.getDate() !== lastDate.getDate()) {
        counter = 1; // Reset counter jika tanggal berubah
        lastDate = currentDate;
    }
    let year = currentDate.getFullYear();
    let month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    let day = currentDate.getDate().toString().padStart(2, '0');
    let index = counter.toString().padStart(3, '0');
    counter++; // Tambah counter
    return `FILE-${year}${month}${day}-${index}`;
}

exports.convertMsToDuration = (ms) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));
    let durationString = '';

    if (hours > 0) {
        durationString += hours + ' jam ';
    }
    if (minutes > 0) {
        durationString += minutes + ' menit ';
    }
    if (seconds > 0) {
        durationString += seconds + ' detik';
    }

    return durationString;
}

exports.download = async (object, type) => {
    const stream = await downloadContentFromMessage(object, type);
    let buffer = Buffer.from([]);

    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }

    return buffer;
}

exports.getImageLink = async (buffer) => {
    const options = {
        apiKey: global.apiKey.imgbb,
        name: generateFileName(),
        expiration: 3600,
        base64string: await buffer.toString('base64')
    };

    return uploadToImgbb(options).then(result => result.url);
}

exports.isCmd = (m, ctx) => {
    const prefixRegex = new RegExp(ctx._config.prefix, 'i');
    const content = m.content.trim();

    if (!prefixRegex.test(content)) return false;

    const [cmdName] = content.slice(1).trim().toLowerCase().split(/\s+/);

    for (const cmd of ctx._config.cmd.values()) {
        if (cmd.name === cmdName || (cmd.aliases && cmd.aliases.includes(cmdName))) {
            return true;
        }
    }

    return false;
}