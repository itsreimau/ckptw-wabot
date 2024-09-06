module.exports = {
    name: "ping",
    category: "info",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true
        });
        if (status) return ctx.reply(message);

        return ctx.reply("Pong!");
    }
};