const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "cekkhodam",
    aliases: ["checkkhodam", "khodam"],
    category: "entertainment",
    handler: {
        banned: true,
        cooldown: true,
        coin: [10, "text", 1]
    },
    code: async (ctx) => {
        const status = await handler(ctx, module.exports.handler);
        if (status) return;

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "john doe"))
        );

        try {
            const apiUrl = tools.api.createUrl("https://raw.githubusercontent.com", `/SazumiVicky/cek-khodam/main/khodam/list.txt`, {});
            const {
                data
            } = await axios.get(apiUrl);
            const list = data.split('\n').filter(l => l.trim().length > 0);
            const khodam = list[Math.floor(Math.random() * list.length)];

            return await ctx.reply(
                `${quote(`Nama: ${input}`)}\n` +
                `${quote(`Khodam: ${khodam}`)}\n` +
                "\n" +
                config.msg.footer
            );
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return message.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};