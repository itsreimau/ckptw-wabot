const {
    quote
} = require("@mengkodingan/ckptw");
const mime = require("mime-types");

module.exports = {
    name: "genshincard",
    category: "maker",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        if (await middleware(ctx, module.exports.permissions)) return;

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx._used, "February 8th|Do you love me?"))
        );

        try {
            const [birthday, description] = input.split("|").map(i => i.trim());
            const profilePictureUrl = await ctx._client.profilePictureUrl(ctx.sender.jid, "image").catch(() => "https://i.pinimg.com/736x/70/dd/61/70dd612c65034b88ebf474a52ccc70c4.jpg");

            const apiUrl = tools.api.createUrl("itzpire", "/maker/genshin-card", {
                username: ctx.sender.pushName || "-",
                birthday: birthday || "January 1st",
                url: profilePictureUrl,
                description: description || "No description"
            });

            return await ctx.reply({
                image: {
                    url: apiUrl
                },
                mimetype: mime.lookup("png")
            });
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};