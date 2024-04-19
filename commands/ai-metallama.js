const {
    createAPIUrl
} = require('../lib/api.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'metallama',
    aliases: ['llama'],
    category: 'ai',
    code: async (ctx) => {
        const input = ctx._args.join(' ');

        let prompt;
        const quotedMessageConversation = ctx._msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation;

        if (quotedMessageConversation && input) {
            prompt = `Previous message: ${quotedMessageConversation}\n` +
                `Message: ${input}`;
        } else if (quotedMessageConversation) {
            prompt = quotedMessageConversation;
        } else if (input) {
            prompt = input;
        } else {
            return ctx.reply(
                `${global.msg.argument}\n` +
                `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} apa itu whatsapp?`)}`
            );
        }

        try {
            const apiUrl = createAPIUrl('otinxsandip', '/metallama', {
                prompt: prompt
            });
            const response = await fetch(apiUrl);
            const data = await response.json();

            return ctx.reply(data.answer);
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};