exports.Quoted = (ctx) => {
    const i = ctx.msg.message.extendedTextMessage ? ctx.msg.message.extendedTextMessage.contextInfo.quotedMessage ? true : false : false;
    const type = i ? require('@whiskeysockets/baileys').getContentType(ctx.msg.message.extendedTextMessage.contextInfo.quotedMessage) : null
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