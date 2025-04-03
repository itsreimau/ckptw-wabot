const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "ppcouple",
    aliases: ["ppcp"],
    category: "entertainment",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const apiUrl = tools.api.createUrl("otinxsandip", "/dp");

        try {
            const result = (await axios.get(apiUrl)).data;

            return await Promise.all([
                ctx.reply({
                    image: {
                        url: result.male
                    },
                    mimetype: mime.lookup("png")
                }),
                ctx.reply({
                    image: {
                        url: result.female
                    },
                    mimetype: mime.lookup("png")
                })
            ]);
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};