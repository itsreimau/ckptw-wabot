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
    name: 'togif',
    category: 'converter',
    code: async (ctx) => {
        const handlerObj = await handler(ctx, {
            banned: true
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const quotedMessage = ctx._msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        if (!quotedMessage) return ctx.reply(`${bold('[ ! ]')} Berikan atau balas media berupa stiker, atau video!`);

        try {
            const type = quotedMessage ? ctx._self.getContentType(quotedMessage) : null;
            const object = type ? quotedMessage[type] : null;
            const buffer = (type === 'stickerMessage') ? await download(object, type.slice(0, -7)) : null;

            const inputPath = path.resolve(__dirname, '../tmp/input.gif');
            const outputPath = path.resolve(__dirname, '../tmp/output.gif');

            fs.writeFileSync(inputPath, buffer);

            await exec(`ffmpeg -i ${inputPath} -vf "fps=10,scale=320:-1:flags=lanczos" -c:v gif ${outputPath}`);

            const gifBuffer = fs.readFileSync(outputPath);

            fs.unlinkSync(inputPath);
            fs.unlinkSync(outputPath);

            return ctx.reply({
                video: gifBuffer,
                caption: null,
                gifPlayback: true
            });
        } catch (error) {
            console.error('Error', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};