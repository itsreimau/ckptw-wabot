const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "crypto",
    aliases: ["coingecko"],
    category: "tools",
    handler: {
        coin: [10, "image", 3]
    },
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "bitcoin"))
        );

        try {
            const result = await coingecko(input);

            if (!result) return await ctx.reply(config.msg.notFound);

            const resultText = result.map((r) =>
                `${quote(`${r.cryptoName}`)}\n` +
                `${quote(`Harga: ${r.priceChange}`)}`
            ).join(
                "\n" +
                `${quote("─────")}\n`
            );
            return await ctx.reply(
                `${resultText}\n` +
                "\n" +
                config.msg.footer
            );
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};

async function coingecko(search) {
    const apiUrl = tools.api.createUrl("https://api.coingecko.com", "/api/v3/coins/markets", {
        vs_currency: "usd"
    });

    try {
        const {
            data
        } = await axios.get(apiUrl);
        const result = [];

        data.forEach((crypto) => {
            const percentChange = crypto.price_change_percentage_24h.toFixed(2);

            if (crypto.name.toLowerCase().includes(search.toLowerCase())) {
                result.push({
                    cryptoName: `${crypto.name} (${crypto.symbol}) - $${crypto.current_price}`,
                    priceChange: percentChange >= 0 ? `+${percentChange}%` : `${percentChange}%`
                });
            }
        });

        return result;
    } catch (error) {
        console.error(`[${config.pkg.name}] Error:`, error);
        return null;
    }
}