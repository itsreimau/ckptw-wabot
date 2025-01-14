const {
    quote
} = require("@mengkodingan/ckptw");
const mime = require("mime-types");

module.exports = {
    name: "carbon",
    aliases: ["carbonify"],
    category: "maker",
    handler: {
        coin: 10
    },
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx._used, 'console.log("halo dunia!");'))
        );

        try {
            const apiUrl = tools.api.createUrl("siputzx", "/api/m/carbonify", {
                input
            });

            return await ctx.reply({
                image: {
                    url: apiUrl
                },
                mimetype: mime.lookup("png")
            });
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};