const {
    quote
} = require("@itsreimau/ckptw-mod");
const mime = require("mime-types");

module.exports = {
    name: "negro",
    aliases: ["hitam", "hitamkan", "penghitaman"],
    category: "ai-misc",
    permissions: {
        coin: 10
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
                "-f <text>": "Atur filter hitam (tersedia: brown, black, nerd, piggy, carbon, bald | default: brown)"
            }))
        );

        try {
            const flag = tools.cmd.parseFlag(input, {
                "-f": {
                    type: "value",
                    key: "filter",
                    validator: (val) => /^(brown|black|nerd|piggy|carbon|bald)$/.test(val),
                    parser: (val) => val
                }
            });

            const filter = flag.filter || "brown";

            const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted.media.toBuffer();
            const uploadUrl = await tools.general.upload(buffer, "image");
            const result = tools.api.createUrl("fasturl", "/aiimage/negro", {
                imageUrl: uploadUrl,
                filter
            });

            return await ctx.reply({
                image: {
                    url: result
                },
                mimetype: mime.lookup("png"),
                caption: `${quote(`Filter: ${tools.general.ucwords(filter)}`)}\n` +
                    "\n" +
                    config.msg.footer
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};