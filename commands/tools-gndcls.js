const {
    createAPIUrl
} = require('../lib/api.js');
const {
    download,
    getImageLink,
    ucword
} = require('../lib/simple.js');
const {
    bold
} = require('@mengkodingan/ckptw');
const {
    MessageType
} = require('@mengkodingan/ckptw/lib/Constant');

module.exports = {
    name: 'gndcls',
    aliases: ['genderclassification'],
    category: 'tools',
    code: async (ctx) => {
        const msgType = ctx.getMessageType();
        const quotedMessage = ctx.msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        if (msgType !== MessageType.imageMessage && msgType !== MessageType.videoMessage && !quotedMessage) return ctx.reply(`${bold('[ ! ]')} Berikan atau balas media berupa gambar, GIF, atau video!`);

        try {
            const type = quotedMessage ? ctx._self.getContentType(quotedMessage) : null;
            const object = type ? quotedMessage[type] : null;

            const buffer = (type === 'imageMessage') ? await download(object, type.slice(0, -7)) : await ctx.getMediaMessage(ctx._msg, 'buffer');

            const imageLink = await getImageLink(buffer);
            const apiUrl = createAPIUrl('itzpire', `/tools/gender-classification`, {
                url: imageLink
            });
            const response = await fetch(apiUrl);
            const data = await response.json();

            const resultText = data.data
                .sort((a, b) => b.score - a.score)
                .map((item) => {
                    const scorePercentage = Math.min(Math.max(item.score * 100, 0), 100);
                    return `• ${ucword(item.label)}: ${scorePercentage.toFixed(2)}%\n`;
                })
                .join('');

            return ctx.reply(
                `❖ ${bold('Gender Classification')}\n` +
                `\n` +
                resultText +
                `\n` +
                global.msg.footer
            );
        } catch (error) {
            console.error('Error', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};