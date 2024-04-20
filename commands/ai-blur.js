require('../config.js');
const {
    download,
    getImageLink
} = require('../lib/simple.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');
const {
    MessageType
} = require('@mengkodingan/ckptw/lib/Constant');
const jimp = require('jimp');

module.exports = {
    name: 'blur',
    category: 'ai',
    code: async (ctx) => {
        const msgType = ctx.getMessageType();
        const quotedMessage = ctx._msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        if (msgType !== MessageType.imageMessage && msgType !== MessageType.videoMessage && !quotedMessage) return ctx.reply(`${bold('[ ! ]')} Berikan atau balas media berupa gambar!`);

        try {
            const type = quotedMessage ? ctx._self.getContentType(quotedMessage) : null;
            const object = type ? quotedMessage[type] : null;

            const buffer = (type === 'imageMessage') ? await download(object, type.slice(0, -7)) : await ctx.getMediaMessage(ctx._msg, 'buffer');

            let level = ctx._args[0] || '5';
            let img = await jimp.read(buffer);
            img.blur(isNaN(level) ? 5 : parseInt(level));
            img.getBuffer(jimp.MIME_JPEG, async (err, buffer) => {
                if (err) throw new Error('Tidak dapat mengaburkan gambar!');

                await ctx.reply({
                    image: buffer,
                    caption: null
                });
            });
        } catch (error) {
            console.error('Error', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};