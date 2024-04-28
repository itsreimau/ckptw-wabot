const {
    handler
} = require('../handler.js');
const {
    download
} = require('../tools/simple.js');
const {
    bold
} = require('@mengkodingan/ckptw');
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path = require('path');

module.exports = {
    name: 'toimg',
    aliases: ['toimage'],
    category: 'converter',
    code: async (ctx) => {
        const handlerObj = await handler(ctx, {
            banned: true
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const quotedMessage = ctx._msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        if (!quotedMessage) return ctx.reply(`${bold('[ ! ]')} Berikan atau balas media berupa sticker!`);

        try {
            const type = quotedMessage ? ctx._self.getContentType(quotedMessage) : null;
            const object = type ? quotedMessage[type] : null;
            const buffer = (type === 'stickerMessage') ? await download(object, type.slice(0, -7)) : null;

            const inputPath = path.resolve(__dirname, '../tmp/input.webp');
            const outputPath = path.resolve(__dirname, '../tmp/output.png');

            fs.writeFileSync(inputPath, buffer);

            await exec(`ffmpeg -i ${inputPath} ${outputPath}`);

            const imgBuffer = fs.readFileSync(outputPath);

            fs.unlinkSync(inputPath);
            fs.unlinkSync(outputPath);

            return ctx.reply({
                image: imgBuffer,
                caption: null
            });
        } catch (error) {
            console.error('Error', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};
