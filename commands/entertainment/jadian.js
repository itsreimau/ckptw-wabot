const {
    quote
} = require("@mengkodingan/ckptw");

function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

module.exports = {
    name: "jadian",
    aliases: ["jodoh"],
    category: "entertainment",
    permissions: {
        coin: 5,
        group: true
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || quote("👋 Halo, Dunia!");

        try {
            const members = await ctx.group().members();
            const mentions = members.map(m => m.id);
            let a = getRandom(members).id.split('@')[0]
            let b
            do{ 
                b = getRandom(members).id.split('@')[0]
            }while (b === a)

            return await ctx.reply({
                text: quote(`@${a} ❤️ @${b} \n \n`) + config.msg.footer,
                mentions: [a, b]
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};