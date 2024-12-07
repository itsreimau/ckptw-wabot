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
        if (await handler(ctx, module.exports.handler)) return;

        try {
            await ctx.reply(config.msg.wait);

            exec(`pm2 restart ${config.pkg.name}`); // PM2
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};