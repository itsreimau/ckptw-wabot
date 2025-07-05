module.exports = {
    name: "waifuim",
    category: "entertainment",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (input?.toLowerCase() === "list") {
            const listText = await tools.list.get("waifuim");
            return await ctx.reply({
                text: listText,
                footer: config.msg.footer,
                interactiveButtons: []
            });
        }

        try {
            const listWaifuim = ["ass", "ecchi", "ero", "hentai", "maid", "milf", "oppai", "oral", "paizuri", "selfies", "uniform", "waifu"];
            const waifuim = listWaifuim.includes(input) ? input : tools.cmd.getRandomElement(listWaifuim);
            const result = tools.api.createUrl("nekorinn", `/waifuim/${waifuim}`);

            return await ctx.reply({
                image: {
                    url: result
                },
                mimetype: tools.mime.lookup("jpg"),
                caption: formatter.quote(`Kategori: ${tools.msg.ucwords(waifuim)}`),
                footer: config.msg.footer,
                buttons: [{
                    buttonId: `${ctx.used.prefix + ctx.used.command} ${input || ""}`,
                    buttonText: {
                        displayText: "Ambil Lagi"
                    },
                    type: 1
                }],
                headerType: 1
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};