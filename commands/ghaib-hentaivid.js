const {
    createAPIUrl
} = require("../tools/api.js");
const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "hentaivid",
    category: "ghaib",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            premium: true
        });
        if (status) return ctx.reply(message);

        try {
            const apiUrl = await createAPIUrl("agatz", "/api/hentaivid", {
                message: input
            });
            const response = await axios.get(apiUrl);
            const {
                data
            } = response.data;
            const result = getRandomElement(data);

            return await ctx.reply({
                video: {
                    url: result.video_1 || result.video_2
                },
                mimetype: mime.contentType("mp4"),
                caption: `${quote(`Judul: ${result.title}`)}\n` +
                    `${quote(`Kategori: ${result.category}`)}\n` +
                    "\n" +
                    global.msg.footer,
                gifPlayback: false
            });
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};