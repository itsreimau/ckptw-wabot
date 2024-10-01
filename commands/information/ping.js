module.exports = {
    name: "ping",
    category: "information",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            cooldown: true
        });
        if (status) return ctx.reply(message);

        return ctx.reply("Pong!");
    }
};