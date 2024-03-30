module.exports = {
    name: 'base64',
    category: 'tools',
    code: async (ctx) => {
        const input = ctx._args.join(' ');

        ctx.reply(Buffer.from(input, 'utf-8').toString('base64'));
    }
};