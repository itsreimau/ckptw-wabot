const {
    getList
} = require("../tools/list.js");
const {
    createAPIUrl
} = require("../tools/api.js");
const {
    ucword
} = require("../tools/simple.js");
const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");
const mime = require("mime-types");

module.exports = {
    name: "randomimage",
    aliases: ["rimg", "randomimg"],
    category: "internet",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true,
            coin: 3
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const input = ctx._args.length ? ctx._args.join(" ") : null;

        if (!input) return ctx.reply(
            `${global.msg.argument} Bingung? Ketik ${monospace(`${ctx._used.prefix + ctx._used.command} list`)} untuk melihat daftar.\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} japan`)}`
        );

        if (ctx._args[0] === "list") {
            const listText = await getList("randomimage");

            return ctx.reply(listText);
        }

        const list = ["china", "vietnam", "thailand", "indonesia", "korea", "japan", "malaysia", "shinobu", "waifu", "neko", "hubbleimg"];

        if (!list.some(item => input.includes(item))) return ctx.reply(`Bingung? Ketik ${monospace(`${ctx._used.prefix + ctx._used.command} list`)} untuk melihat daftar.`);

        try {
            const apiUrl = createAPIUrl("widipe", `/${input}`, {});

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