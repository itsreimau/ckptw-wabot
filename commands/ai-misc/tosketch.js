const {
    quote
} = require("@itsreimau/ckptw-mod");
const mime = require("mime-types");

module.exports = {
    name: "tosketch",
    category: "ai-misc",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        const msgType = ctx.getMessageType();
        const [checkMedia, checkQuotedMedia] = await Promise.all([
            tools.cmd.checkMedia(msgType, "image"),
            tools.cmd.checkQuotedMedia(ctx.quoted, "image")
        ]);

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(
            `${quote(tools.cmd.generateInstruction(["send", "reply"], "image"))}\n` +
            quote(tools.cmd.generatesFlagInformation({
                "-s <text>": "Atur gaya (tersedia: anime, lineart, simplex, intricateline, sketch, pencil, ink, manga, gouache, colorrough, bgline, inkpainting | default: anime)"
            }))
        );

        try {
            const flag = tools.cmd.parseFlag(input, {
                "-s": {
                    type: "value",
                    key: "style",
                    validator: (val) => /^(anime|lineart|simplex|intricateline|sketch|pencil|ink|manga|gouache|colorrough|bgline|inkpainting)$/.test(val),
                    parser: (val) => val
                }
            });

            const styles = {
                anime: "Anime Sketch",
                lineart: "Line Art",
                simplex: "Simplex",
                doodle: "Doodle",
                intricateline: "Intricate Line",
                sketch: "Sketch",
                pencil: "Pencil Sketch",
                ink: "Ink Sketch",
                manga: "Manga Sketch",
                gouache: "Gouache",
                colorrough: "Color Rough",
                bgline: "BG Line",
                inkpainting: "Ink Painting"
            };
            const style = styles[flag.style] || "Anime Sketch";

            const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted.media.toBuffer();
            const uploadUrl = await tools.general.upload(buffer, "image");
            const result = tools.api.createUrl("fasturl", "/imgedit/tosketch", {
                imageUrl: uploadUrl,
                style
            });

            return await ctx.reply({
                image: {
                    url: result
                },
                mimetype: mime.lookup("png"),
                caption: `${quote(`Gaya: ${style}`)}\n` +
                    "\n" +
                    config.msg.footer
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};