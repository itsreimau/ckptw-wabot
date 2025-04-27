const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "kapankah",
    aliases: ["kapan"],
    category: "entertainment",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.cmd.generateCommandExample(ctx.used, "evangelion itu peak?"))
        );

        try {
            const randomNumber = Math.floor(Math.random() * 60 + 1);
            const times = ["detik", "menit", "jam", "hari", "minggu", "bulan", "tahun", "dekade", "abad"];
            const time = tools.general.getRandomElement(times);

            return await ctx.reply(quote(`${randomNumber} ${time} lagi ...`));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};