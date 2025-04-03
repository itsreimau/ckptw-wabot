const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const mime = require("mime-types");

module.exports = {
    name: "penghitaman",
    aliases: ["hitamkan"],
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
                "-f <number>": "Atur filter hitam (tersedia: coklat, hitam, nerd, piggy, carbon, botak | default: coklat)"
            }))
        );

        try {
            const flag = tools.general.parseFlag(input, {
                "-f": {
                    type: "value",
                    key: "filter",
                    validator: (val) => /^[coklat|hitam|nerd|piggy|carbon|botak]$/.test(val),
                    parser: (val) => val
                }
            });
            const filter = flag?.filter || "coklat";

            const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted?.media.toBuffer();
            const uploadUrl = await tools.general.upload(buffer, "image");
            const result = tools.api.createUrl("http://negroify.wosib11334.serv00.net", "/api/penghitaman", {
                imageUrl: uploadUrl,
                filter
            });

            return await ctx.reply({
                image: {
                    url: result
                },
                mimetype: mime.lookup("png"),
                caption: `${quote(`Filter: ${tools.general.ucword(filter)}`)}\n` +
                    "\n" +
                    config.msg.footer
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};