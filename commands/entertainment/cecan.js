const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "cecan",
    category: "entertainment",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (["l", "list"].includes(input.toLowerCase())) {
            const listText = await tools.list.get("cecan");
            return await ctx.reply(listText);
        }

        try {
            const listCecan = ["china", "indonesia", "japan", "vietnam", "korea", "malaysia", "thailand"];
            const cecan = listCecan.includes(input) ? input : tools.cmd.getRandomElement(listCecan);
            const apiUrl = tools.api.createUrl("agatz", `/api/${cecan}`);
            const result = (await axios.get(apiUrl)).data.data.url;

            return await ctx.reply({
                image: {
                    url: result
                },
                mimetype: mime.lookup("jpg")
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};