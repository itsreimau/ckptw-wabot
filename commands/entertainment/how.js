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
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${formatter.quote(tools.msg.generateCmdExample(ctx.used, "itsreimau"))}\n` +
            formatter.quote(tools.msg.generateNotes([`Ketik ${formatter.monospace(`${ctx.used.prefix + ctx.used.command} list`)} untuk melihat daftar.`]))
        );

        if (ctx.used.command === "how" || ["l", "list"].includes(input.toLowerCase())) {
            const listText = await tools.list.get("how");
            return await ctx.reply(listText);
        }

        try {
            const randomNumber = Math.floor(Math.random() * 100);

            return await ctx.reply(formatter.quote(`${input} itu ${randomNumber}% ${(ctx.used.command.replace("how", "")).toLowerCase()}.`));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error);
        }
    }
};