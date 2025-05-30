const {
    monospace,
    quote
} = require("@itsreimau/ckptw-mod");

module.exports = {
    name: "how",
    aliases: ["howgay", "howpintar", "howcantik", "howganteng", "howgabut", "howgila", "howlesbi", "howstress", "howbucin", "howjones", "howsadboy"],
    category: "entertainment",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(tools.cmd.generateCommandExample(ctx.used, "itsreimau"))}\n` +
            quote(tools.cmd.generateNotes([`Ketik ${monospace(`${ctx.used.prefix + ctx.used.command} list`)} untuk melihat daftar.`]))
        );

        if (ctx.used.command === "how" || ["l", "list"].includes(input.toLowerCase())) {
            const listText = await tools.list.get("how");
            return await ctx.reply(listText);
        }

        try {
            const randomNumber = Math.floor(Math.random() * 100);

            return await ctx.reply(quote(`${input} itu ${randomNumber}% ${(ctx.used.command.replace("how", "")).toLowerCase()}.`));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};