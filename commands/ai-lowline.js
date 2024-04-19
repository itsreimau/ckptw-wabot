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
        const quotedMessageText = ctx._msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.text;

        if (quotedMessageText && input) {
            prompt = `Previous message: ${quotedMessageText}\n` +
                `Message: ${input}`;
        } else if (quotedMessageText) {
            prompt = quotedMessageText;
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