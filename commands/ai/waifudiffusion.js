const {
    quote
} = require("@mengkodingan/ckptw");
const mime = require("mime-types");

module.exports = {
    name: "waifudiffusion",
    aliases: ["waifudiff", "wdiff"],
    category: "ai",
    handler: {
        banned: true,
        cooldown: true
    },
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, module.exports.handler);
        if (status) return await ctx.reply(message);

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(global.tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "moon"))}\n` +
            quote(global.tools.msg.generateNotes([`Ketik ${monospace(`${ctx._used.prefix + ctx._used.command} list`)} untuk melihat daftar.`]))
        );

        if (ctx.args[0] === "list") {
            const listText = await global.tools.list.get("waifudiffusion");
            return await ctx.reply(listText);
        }

        try {
            const type = ["Cute-Anime", "Studio-Ghibli", "Anime", "Waifu", "Vintage-Anime", "Soft-Anime"];
            const flag = global.tools.general.parseFlag(input, {
                "-s": {
                    type: "value",
                    key: "style",
                    validator: (val) => !isNaN(val) && parseInt(val) > 0 && parseInt(val) <= type.length,
                    parser: (val) => type[parseInt(val) - 1]
                }
            });

            const apiUrl = global.tools.api.createUrl("ryzendesu", "/api/ai/waifu-diff", {
                prompt: flag.input,
                style: flag.style || global.tools.general.getRandomElement(type)
            });

            return await ctx.reply({
                image: {
                    url: apiUrl
                },
                mimetype: mime.lookup("png"),
                caption: `${quote(`Prompt: ${input}`)}\n` +
                    `${quote(`Gaya: ${flag.style || "Acak"}`)}\n` +
                    "\n" +
                    global.config.msg.footer
            });
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            if (error.status !== 200) return await ctx.reply(global.config.msg.notFound);
            return await ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};