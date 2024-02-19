const {
    getContentType
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

exports.Quoted = (ctx) => {
    const i = ctx.msg.message.extendedTextMessage ? ctx.msg.message.extendedTextMessage.contextInfo.quotedMessage ? true : false : false;
    const type = i ? getContentType(ctx.msg.message.extendedTextMessage.contextInfo.quotedMessage) : null
    const data = {
        isQuoted: i,
        type,
        data: {
            viaType: i ? ctx.msg.message.extendedTextMessage.contextInfo.quotedMessage[type] : null,
            normal: i ? ctx.msg.message.extendedTextMessage.contextInfo.quotedMessage : null
        },
    }

    return data;
}