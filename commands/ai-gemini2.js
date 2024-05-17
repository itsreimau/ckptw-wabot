const {
    createAPIUrl
} = require('../tools/api.js');
const {
    download
} = require('../tools/simple.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');
const axios = require('axios');
const {
    MessageType
} = require('@mengkodingan/ckptw/lib/Constant');
const mime = require('mime-types');
const {
    uploadByBuffer
} = require('telegraph-uploader');

module.exports = {
    name: 'gemini2',
    category: 'ai',
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true,
            coin: 1
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} jelaskan gambar ini.`)}\n` +
            `${global.msg.readmore}\n` +
            'Catatan: AI ini dapat melihat gambar dan menjawab pertanyaan tentang gambar tersebut. Kirim gambar dan tanyakan apa saja!'
        );

        const msgType = ctx.getMessageType();
        const quotedMessage = ctx._msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        if (msgType !== MessageType.imageMessage && msgType !== MessageType.videoMessage && !quotedMessage) return ctx.reply(`${bold('[ ! ]')} Berikan atau balas media berupa gambar!`);

        try {
            const type = quotedMessage ? ctx._self.getContentType(quotedMessage) : null;
            const object = type ? quotedMessage[type] : null;
            const buffer = (type === 'imageMessage') ? await download(object, type.slice(0, -7)) : await ctx.getMediaMessage(ctx._msg, 'buffer');
            const uplRes = await uploadByBuffer(buffer, mime.contentType('png'));
            const apiUrl = createAPIUrl('sandipbaruwal', `/gemini2`, {
                prompt: input,
                url: uplRes.link
            });
            const response = await axios.get(apiUrl);

            if (response.status !== 200) throw new Error(global.msg.notFound);

            const data = await response.data;

            return ctx.reply(data.answer);
        } catch (error) {
            console.error('Error', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};