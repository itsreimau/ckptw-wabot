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
            const {
                data
            } = await axios.get(apiUrl);

            return await Promise.all([
                ctx.reply({
                    image: {
                        url: data.male
                    },
                    mimetype: mime.lookup("png")
                }),
                ctx.reply({
                    image: {
                        url: data.female
                    },
                    mimetype: mime.lookup("png")
                })
            ]);
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};