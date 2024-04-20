const {
    download
} = require('../lib/simple.js');
const {
    bold
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'tovid',
    aliases: ['tovideo'],
    category: 'converter',
    code: async (ctx) => {
        const quotedMessage = ctx._msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        if (!quotedMessage) return ctx.reply(`${bold('[ ! ]')} Berikan atau balas media berupa gambar, GIF, atau video!`);

        try {
            const type = quotedMessage ? ctx._self.getContentType(quotedMessage) : null;
            const object = type ? quotedMessage[type] : null;

            const buffer = (type === 'stickerMessage') ? await download(object, type.slice(0, -7));

            return ctx.reply({
                video: buffer,
                caption: null
            });
        } catch (error) {
            console.error('Error', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};