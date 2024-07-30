const {
    getList
} = require("../tools/list.js");
const {
    createAPIUrl
} = require("../tools/api.js");
const {
    ucword
} = require("../tools/general.js");
const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "randomimage",
    aliases: ["imagerandom", "imgr", "randomimg", "rimg"],
    category: "internet",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            coin: 3
        });
        if (status) return ctx.reply(message);

        const input = ctx._args.join(" ") || null;

        if (!input) return ctx.reply(
            `${global.msg.argument} Bingung? Ketik ${monospace(`${ctx._used.prefix + ctx._used.command} list`)} untuk melihat daftar.\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} japan`)}`
        );

        if (ctx._args[0] === "list") {
            const listText = await getList("randomimage");

            return ctx.reply(listText);
        }

        const list = ["china", "hubbleimg", "indonesia", "japan", "korea", "malaysia", "neko", "shinobu", "thailand", "vietnam", "waifu"];
        if (!list.some(item => input.includes(item))) return ctx.reply(`Bingung? Ketik ${monospace(`${ctx._used.prefix + ctx._used.command} list`)} untuk melihat daftar.`);

        try {
            const apiUrl = createAPIUrl("widipe", `/${input}`, {});

            const listWithResUrl = ["hubbleimg", "neko", "shinobu", "waifu"];
            if (listWithResUrl.some(item => input.includes(item))) {
                const response = await axios.get(apiUrl);

                const data = await response.data;

                return await ctx.reply({
                    image: {
                        url: data.result.url
                    },
                    mimetype: mime.contentType("png"),
                    caption: `❖ ${bold("Random Image")}\n` +
                        "\n" +
                        `➲ Kueri: ${ucword(input)}\n` +
                        "\n" +
                        global.msg.footer
                });
            }

            return await ctx.reply({
                image: {
                    url: apiUrl
                },
                mimetype: mime.contentType("png"),
                caption: `❖ ${bold("Random Image")}\n` +
                    "\n" +
                    `➲ Kueri: ${ucword(input)}\n` +
                    "\n" +
                    global.msg.footer
            });
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};