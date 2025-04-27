const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "jadian",
    aliases: ["jodoh"],
    category: "entertainment",
    permissions: {
        coin: 5,
        group: true
    },
    code: async (ctx) => {
        try {
            const members = await ctx.group().members();
            const mentions = members.map(m => m.id);

            const a = tools.general.getID(tools.general.getRandomElement(members).id);
            let b;
            do {
                b = tools.general.getID(tools.general.getRandomElement(members).id)
            } while (b === a)

            return await ctx.reply({
                text: quote(`@${a} ❤️ @${b}`),
                mentions: [a, b]
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};