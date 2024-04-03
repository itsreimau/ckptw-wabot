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
    name: 'imgcls',
    aliases: ['imageclassification'],
    category: 'tools',
    code: async (ctx) => {
        try {
            const msgType = ctx.getMessageType();
            const quotedMessage = ctx.msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

            if (msgType !== MessageType.imageMessage && msgType !== MessageType.videoMessage && !quotedMessage)
                return ctx.reply(`${bold('[ ! ]')} Berikan atau balas media berupa gambar, GIF, atau video!`);

            const type = quotedMessage ? ctx._self.getContentType(quotedMessage) : null;
            const object = type ? quotedMessage[type] : null;

            const buffer = (type === 'imageMessage') ? await download(object, type.slice(0, -7)) : await ctx.getMediaMessage(ctx._msg, 'buffer');

            const imageLink = await getImageLink(buffer);
            const apiUrl = createAPIUrl('itzpire', `tools/image-classification`, {
                url: imageLink
            });
            const response = await fetch(apiUrl);
            const data = await response.json();

            const femaleScore = data.data[0].score;
            const maleScore = data.data[1].score;
            const resultText = (femaleScore > maleScore || femaleScore === 1) ?
                `• Perempuan: ${femaleScore}\n• Pria: ${maleScore}\n` :
                `• Pria: ${maleScore}\n• Perempuan: ${femaleScore}\n`;

            const resultText = data.data
                .sort((a, b) => b.score - a.score)
                .map((item) => {
                    const scorePercentage = Math.min(Math.max(item.score * 100, 0), 100); // Memastikan skor dalam rentang 0-100
                    return `• ${bold(ucword(item.label))}: ${scorePercentage.toFixed(2)}%\n`;
                })
                .join('');

            return ctx.reply(
                `❖ ${bold('Image Classification')}\n` +
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