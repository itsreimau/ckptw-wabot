const {
    monospace,
    quote
} = require("@itsreimau/ckptw-mod");

module.exports = {
    name: "how",
    aliases: ["howgay", "howpintar", "howcantik", "howganteng", "howgabut", "howgila", "howlesbi", "howstress", "howbucin", "howjones", "howsadboy"],
    category: "entertainment",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(tools.msg.generateCommandExample(ctx.used, "itsreimau"))}\n` +
            quote(tools.msg.generateNotes([`Ketik ${monospace(`${ctx.used.prefix + ctx.used.command} list`)} untuk melihat daftar.`]))
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