const {
    quote
} = require("@mengkodingan/ckptw");
const {
    exec
} = require("child_process");

module.exports = {
    name: "restart",
    category: "owner",
    handler: {
        owner: true
    },
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, module.exports.handler);
        if (status) return ctx.reply(message);

        try {
            await ctx.reply(global.config.msg.wait);

            exec(`pm2 restart ${global.config.pkg.name}`); // PM2.
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            return ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};