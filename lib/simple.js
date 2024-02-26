const {
    downloadContentFromMessage
} = require('@whiskeysockets/baileys');

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