const {
    quote
} = require("@mengkodingan/ckptw");
const mime = require("mime-types");

module.exports = {
    name: "toanimation",
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
                "-s <text>": "Atur style hitam (tersedia: crayon, inkpainting, simpledrawing, witty, tinies, grumpy3d, 90sshoujoumanga, gothic, vector, comicbook, felteddoll, wojak, illustration, mini, clay, 3d, inkpainting, colorrough | default: crayon)"
            }))
        );

        try {
            const flag = tools.cmd.parseFlag(input, {
                "-s": {
                    type: "value",
                    key: "style",
                    validator: (val) => /^(crayon|inkpainting|simpledrawing|witty|tinies|grumpy3d|90sshoujoumanga|gothic|vector|comicbook|felteddoll|wojak|illustration|mini|clay|3d|inkpainting|colorrough)$/.test(val),
                    parser: (val) => val
                }
            });

            const styles = {
                "crayon": "Crayon",
                "inkstains": "Ink Stains",
                "simpledrawing": "Simple Drawing",
                "witty": "Witty",
                "tinies": "Tinies",
                "grumpy3d": "Grumpy 3D",
                "90sshoujoumanga": "90s Shoujo Manga",
                "gothic": "Gothic",
                "vector": "Vector",
                "comicbook": "Comic Book",
                "felteddoll": "Felted Doll",
                "wojak": "Wojak",
                "illustration": "Illustration",
                "mini": "Mini",
                "clay": "Clay",
                "3d": "3D",
                "inkpainting": "Ink Painting",
                "colorrough": "Color Rough"
            };

            const style = styles[flag.style] || "Crayon";

            const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted.media.toBuffer();
            const uploadUrl = await tools.general.upload(buffer, "image");
            const result = tools.api.createUrl("fasturl", "/imgedit/toanimation", {
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