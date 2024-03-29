const {
    createAPIUrl
} = require('../lib/api.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'emi',
    category: 'ai',
    code: async (ctx) => {
        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} cat`)}`
        );

        try {
            const apiUrl = createAPIUrl('ai_tools', `/emi`, {
                prompt: input
            });

            const filePath = path.join(__dirname, '..', 'tmp', `IMG-${ctx._msg.messageTimestamp}`);

            const response = await fetch(apiUrl);
            const buffer = await response.buffer();
            fs.writeFileSync(filePath, buffer);

            await ctx.reply({
                image: {
                    url: filePath
                },
                caption: `• Prompt: ${input}`
            });

            fs.unlinkSync(filePath);
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};