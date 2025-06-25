const mime = require("mime-types");

module.exports = {
    name: "cecan",
    category: "entertainment",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (["l", "list"].includes(input?.toLowerCase())) {
            const listText = await tools.list.get("cecan");
            return await ctx.reply(listText);
        }

        try {
            const listCecan = ["china", "indonesia", "japan", "korea", "thailand", "vietnam"];
            const cecan = listCecan.includes(input) ? input : tools.cmd.getRandomElement(listCecan);
            const result = tools.api.createUrl("siputz", `/api/r/cecan/${cecan}`);

            return await ctx.reply({
                image: {
                    url: result
                },
                mimetype: mime.lookup("jpg"),
                caption: `${formatter.quote(`Kategori: ${tools.msg.ucwords(cecan)}`)}\n` +
                    "\n" +
                    config.msg.footer
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};