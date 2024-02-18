const {
    createAPIUrl
} = require('../lib/api.js');
const {
    Quoted
} = require('../lib/simple.js');
const {
    bold
} = require('@mengkodingan/ckptw');
const {
    MessageType
} = require('@mengkodingan/ckptw/lib/Constant');
const {
    uploadByBuffer
} = require('telegraph-uploader');

module.exports = {
    name: 'enhance',
    aliases: ['hd'],
    category: 'tools',
    code: async (ctx) => {
        let mediaMessage = ctx.msg.message.imageMessage;
        const isq = Quoted(ctx);

        if (isq.isQuoted && (isq.type === 'imageMessage')) {
            mediaMessage = isq.data.viaType;
        }

        if (mediaMessage) {
            if (mediaMessage.url === 'https://web.whatsapp.net') {
                mediaMessage.url = 'https://mmg.whatsapp.net' + mediaMessage.directPath;
            }

            try {
                const stream = await require('@whiskeysockets/baileys').downloadContentFromMessage(mediaMessage, 'image');
                let buffer = Buffer.from([]);
                for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk]);
                }
                const result = await uploadByBuffer(buffer, 'image/png');

                const enhance = createAPIUrl('vihangayt', `/tools/enhance`, {
                    url: result.link
                });

                await ctx.reply({
                    image: {
                        url: enhance
                    },
                    caption: null
                });
            } catch (error) {
                console.error('Error:', error);
                return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
            }
        } else {
            return ctx.reply(`${bold('[ ! ]')} Berikan atau balas media berupa gambar!`);
        }
    }
};