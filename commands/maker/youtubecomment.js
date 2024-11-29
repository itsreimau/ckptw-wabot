const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const {
    Sticker,
    StickerTypes
} = require("wa-sticker-formatter");

module.exports = {
    name: "youtubecomment",
    aliases: ["ytcomment"],
    category: "maker",
    handler: {
        coin: [10, "text", 1]
    },
    code: async (ctx) => {
        const status = await handler(ctx, module.exports.handler);
        if (status) return;

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "get in the fucking robot, shinji!"))
        );

        try {
            let profilePictureUrl;
            try {
                profilePictureUrl = await ctx._client.profilePictureUrl(ctx.sender.jid, "image");
            } catch (error) {
                profilePictureUrl = "https://i.pinimg.com/736x/70/dd/61/70dd612c65034b88ebf474a52ccc70c4.jpg";
            }

            const apiUrl = tools.api.createUrl("itzpire", "/maker/yt-comment", {
                username: ctx.sender.pushName || "-",
                pp_user: profilePictureUrl,
                comment: input
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