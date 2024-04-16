const {
    handler
} = require('../handler.js');
const {
    bold
} = require('@mengkodingan/ckptw');
const {
    MessageType
} = require('@mengkodingan/ckptw/lib/Constant');

module.exports = {
    name: 'setpp',
    category: 'group',
    code: async (ctx) => {
        handler(ctx, {
            admin: true,
            botAdmin: true,
            group: true,
            owner: true
        });

        const msgType = ctx.getMessageType();
        const quotedMessage = ctx.msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        if (msgType !== MessageType.imageMessage && !quotedMessage) return ctx.reply(`${bold('[ ! ]')} Berikan atau balas media berupa gambar!`);

        try {
            const type = quotedMessage ? ctx._self.getContentType(quotedMessage) : null;
            const object = type ? quotedMessage[type] : null;

            const buffer = (type === 'imageMessage') ? await download(object, type.slice(0, -7)) : await ctx.getMediaMessage(ctx._msg, 'buffer');

            await ctx._client.updateProfilePicture(ctx.id, buffer);

            return ctx.reply(`${bold('[ ! ]')} Berhasil mengubah gambar profil foto grup!`);
        } catch (error) {
            console.error('Error', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};