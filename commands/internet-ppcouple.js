const {
    createAPIUrl
} = require("../tools/api.js");
const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "ppcouple",
    aliases: ["ppcp"],
    category: "internet",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true,
            coin: 3
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        try {
            const apiUrl = createAPIUrl("sandipbaruwal", "/dp", {});
            const response = await axios.get(apiUrl);

            if (response.status !== 200) throw new Error(global.msg.notFound);

            const data = await response.data;

            const maleUrl = data.male;
            const maleResponse = await axios.get(maleUrl, {
                responseType: "arraybuffer"
            });
            const maleBuffer = Buffer.from(maleResponse.data, "binary");

            const femaleUrl = data.male;
            const femaleResponse = await axios.get(femaleUrl, {
                responseType: "arraybuffer"
            });
            const femaleBuffer = Buffer.from(maleResponse.data, "binary");

            await ctx.reply({
                image: maleBuffer,
                mimetype: mime.contentType("png"),
                caption: null
            });
            return await ctx.reply({
                image: femaleBuffer,
                mimetype: mime.contentType("png"),
                caption: null
            });
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};