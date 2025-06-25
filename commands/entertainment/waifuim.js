const mime = require("mime-types");

module.exports = {
    name: "waifuim",
    category: "entertainment",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (["l", "list"].includes(input?.toLowerCase())) {
            const listText = await tools.list.get("waifuim");
            return await ctx.reply(listText);
        }

        try {
            const listWaifuim = ["ass", "ecchi", "ero", "hentai", "maid", "milf", "oppai", "oral", "paizuri", "selfies", "uniform", "waifu"];
            const waifuim = listWaifuim.includes(input) ? input : tools.cmd.getRandomElement(listWaifuim);
            const result = tools.api.createUrl("nekorinn", `/waifuim/${waifuim}`);

            return await ctx.reply({
                image: {
                    url: result
                },
                mimetype: mime.lookup("jpg"),
                caption: `${formatter.quote(`Kategori: ${tools.msg.ucwords(waifuim)}`)}\n` +
                    "\n" +
                    config.msg.footer
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};