module.exports = {
    name: 'ping',
    category: 'info',
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true,
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        return ctx.reply('Pong!');
    }
};