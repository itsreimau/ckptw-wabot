const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');
const {
    _ai
} = require('lowline.ai');

module.exports = {
    name: 'lowline',
    aliases: ['ai', 'll', 'gpt', 'chatai'],
    category: 'ai',
    code: async (ctx) => {
        const input = ctx._args.join(' ');

        let prompt;
        const quotedMessage = ctx._msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        if (quotedMessage && input) {
            prompt = `Previous message: ${quotedMessage.conversation || quotedMessage.caption}\n` +
                `Message: ${input}`;
        } else if (quotedMessage) {
            prompt = quotedMessage;
        } else if (input) {
            prompt = input;
        } else {
            return ctx.reply(
                `${global.msg.argument}\n` +
                `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} apa itu whatsapp?`)}`
            );
        }

        try {
            const res = await _ai.generatePlaintext({
                prompt: prompt,
            });

            await ctx.reply(res.result);
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};