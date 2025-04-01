const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "negro",
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        const msgType = ctx.getMessageType();
        const [checkMedia, checkQuotedMedia] = await Promise.all([
            tools.general.checkMedia(msgType, "image"),
            tools.general.checkQuotedMedia(ctx.quoted, "image")
        ]);

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send", "reply"], "image"))}\n` +
            quote(tools.msg.generatesFlagInformation({
                "-f <number>": "Atur filter negro (tersedia: coklat, hitam, nerd, piggy, carbon, botak | default: coklat)"
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
            const filter = flag.filter || "coklat";

            const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted?.media.toBuffer();
            const apiUrl = tools.api.createUrl("https://negro.consulting", "/api/process-image", {});
            const result = (await axios.post(apiUrl, {
                imageData: buffer.toString("base64"),
                filter
            })).data.processedImageUrl;

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
            consolefy.error(`Error: ${error}`);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};