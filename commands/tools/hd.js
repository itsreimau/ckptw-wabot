const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const {
    MessageType
} = require("@mengkodingan/ckptw/lib/Constant");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "hd",
    aliases: ["colorize", "enhance", "enhancer", "hd", "hdr", "remini", "unblur"],
    category: "tools",
    handler: {
        coin: [10, "image", 3]
    },
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        const input = ctx.args.join(" ") || null;
        const msgType = ctx.getMessageType();

        const [checkMedia, checkQuotedMedia] = await Promise.all([
            tools.general.checkMedia(msgType, "image", ctx),
            tools.general.checkQuotedMedia(ctx.quoted, "image")
        ]);

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send", "reply"], "image"))}\n` +
            quote(tools.msg.generatesFlagInformation({
                "-t <number>": "Jenis pemrosesan gambar (1: modelx2, 2: modelx2 25 JXL, 3: modelx4, 4: minecraft_modelx4)."
            }))
        );

        try {
            const types = ["modelx2", "modelx2 25 JXL", "modelx4", "minecraft_modelx4"];
            const flag = tools.general.parseFlag(input, {
                "-t": {
                    type: "value",
                    key: "type",
                    validator: (val) => !isNaN(val) && parseInt(val) > 0 && parseInt(val) <= types.length,
                    parser: (val) => types[parseInt(val) - 1]
                }
            });

            const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted?.media.toBuffer();
            const uploadUrl = await tools.general.upload(buffer);
            const apiUrl = tools.api.createUrl("itzpire", "/tools/enhance", {
                url: uploadUrl,
                type: flag.type || tools.general.getRandomElement(types)
            }, null, ["url"]);
            const {
                data
            } = await axios.get(apiUrl);

            return await ctx.reply({
                image: {
                    url: data.result.img
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