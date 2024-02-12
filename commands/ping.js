module.exports = {
    name: 'ping',
    category: 'info',
    code: async (ctx) => {
        ctx.reply('Pong!');
    },
};