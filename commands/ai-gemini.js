require('../config.js');
const {
    createAPIUrl
} = require('../lib/api.js');
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

module.exports = {
    name: 'gemini',
    category: 'ai',
    code: async (ctx) => {
        const input = ctx._args.join(' ');

        const msgType = ctx.getMessageType();
        const quotedMessage = ctx.msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        const readmore = '\u200E'.repeat(4001);

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} apa itu whatsapp?`)}\n` +
            `${readmore}\n` +
            'Catatan: AI ini dapat melihat gambar dan menjawab pertanyaan tentang gambar tersebut. Kirim gambar dan tanyakan apa saja!'
        );

        try {
            const type = quotedMessage ? ctx._self.getContentType(quotedMessage) : null;
            const object = type ? quotedMessage[type] : null;

            const buffer = (type === 'imageMessage') ? await download(object, type.slice(0, -7)) : await ctx.getMediaMessage(ctx._msg, 'buffer');

            if (buffer) {
                const imageLink = await getImageLink(buffer);
                const apiUrl = createAPIUrl('otinxsandip', `/gemini2`, {
                    prompt: input,
                    url: imageLink
                });
                const response = await fetch(apiUrl);
                const data = await response.json();

                return ctx.reply(data.answer);
            }

            const apiUrl = createAPIUrl('otinxsandip', `/gemini`, {
                prompt: input,
                url: imageLink
            });
            const response = await fetch(apiUrl);
            const data = await response.json();

            return ctx.reply(data.answer);
        } catch (error) {
            console.error('Error', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};