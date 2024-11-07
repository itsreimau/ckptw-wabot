const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const mime = require("mime-types");

module.exports = {
    name: "waifudiffusion",
    aliases: ["waifudiff", "wdiff"],
    category: "ai",
    handler: {
        banned: true,
        cooldown: true,
        coin: [10, "image", 3]
    },
    code: async (ctx) => {
        const status = await handler(ctx, module.exports.handler);
        if (status) return;

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "moon -s 5"))}\n` +
            `${quote(tools.msg.generatesFlagInformation({
                "-s <number>": "Jenis gaya."
            }))}\n` +
            quote(tools.msg.generateNotes([`Ketik ${monospace(`${ctx._used.prefix + ctx._used.command} list`)} untuk melihat daftar.`]))
        );

        if (ctx.args[0] === "list") {
            const listText = await tools.list.get("waifudiffusion");
            return await ctx.reply(listText);
        }

        try {
            const type = ["Cute-Anime", "Studio-Ghibli", "Anime", "Waifu", "Vintage-Anime", "Soft-Anime"];
            const flag = tools.general.parseFlag(input, {
                "-s": {
                    type: "value",
                    key: "style",
                    validator: (val) => !isNaN(val) && parseInt(val) > 0 && parseInt(val) <= type.length,
                    parser: (val) => type[parseInt(val) - 1]
                }
            });

            const apiUrl = tools.api.createUrl("ryzendesu", "/api/ai/waifu-diff", {
                prompt: flag.input,
                style: flag.style || tools.general.getRandomElement(type)
            });

            return await ctx.reply({
                image: {
                    url: apiUrl
                },
                mimetype: mime.lookup("png"),
                caption: `${quote(`Prompt: ${input}`)}\n` +
                    `${quote(`Gaya: ${flag.style || "Acak"}`)}\n` +
                    "\n" +
                    config.msg.footer
            });
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};