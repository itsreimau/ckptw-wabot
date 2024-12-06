const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "price",
    aliases: ["belibot", "rent", "rentbot", "sewa", "sewabot"],
    category: "group",
    handler: {},
    code: async (ctx) => {
        const status = await handler(ctx, module.exports.handler);
        if (status) return;

        try {
            const priceText = await db.get(`bot.text.price`) || quote("❎ Bot ini tidak memiliki harga.");

            return await ctx.reply(priceText);
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};