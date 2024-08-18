const {
    createAPIUrl
} = require("../tools/api.js");
const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "crypto",
    aliases: ["coingecko"],
    category: "tools",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            coin: 3
        });
        if (status) return ctx.reply(message);

        const input = ctx._args.join(" ") || null;

        if (!input) return ctx.reply(
            `${quote(global.msg.argument)}\n` +
            quote(`Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} bitcoin`)}`)
        );

        try {
            const result = await coingecko(input);

            if (!result) return ctx.reply(global.msg.notFound);

            const resultText = result.map((r) =>
                `${quote(`${r.cryptoName}`)}\n` +
                `${quote(`Harga: ${r.priceChange}`)}`
            ).join(
                "\n" +
                `${quote("─────")}\n`
            );
            return ctx.reply(
                `${resultText}\n` +
                "\n" +
                global.msg.footer
            );
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};


async function coingecko(search) {
    const apiUrl = createAPIUrl("https://api.coingecko.com", "/api/v3/coins/markets", {
        vs_currency: "usd",
    });

    try {
        const response = await axios.get(apiUrl);
        const data = response.data;
        const result = [];

        data.forEach((crypto) => {
            const cryptoName = `${crypto.name} (${crypto.symbol}) - $${crypto.current_price}`;
            const percentChange = crypto.price_change_percentage_24h.toFixed(2);
            const priceChange = percentChange >= 0 ? `+${percentChange}%` : `${percentChange}%`;

            if (crypto.name.toLowerCase().includes(search.toLowerCase())) {
                const cryptoResult = {
                    cryptoName: cryptoName,
                    priceChange: priceChange
                };
                result.push(cryptoResult);
            }
        });

        return result;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}