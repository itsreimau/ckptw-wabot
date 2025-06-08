const {
    quote
} = require("@itsreimau/ckptw-mod");
const mime = require("mime-types");

module.exports = {
    name: "quoteimage",
    aliases: ["quoteimg"],
    category: "maker",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || ctx.quoted?.conversation || Object.values(ctx.quoted).map(q => q?.text || q?.caption).find(Boolean) || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(tools.msg.generateCommandExample(ctx.used, "get in the fucking robot, shinji!"))}\n` +
            quote(tools.msg.generateNotes(["Balas atau quote pesan untuk menjadikan teks sebagai input target, jika teks memerlukan baris baru."]))
        );

        if (input.length > 1000) return await ctx.reply(quote("❎ Maksimal 1000 kata!"));

        try {
            const profilePictureUrl = await ctx.core.profilePictureUrl(ctx.sender.jid, "image").catch(() => "https://i.pinimg.com/736x/70/dd/61/70dd612c65034b88ebf474a52ccc70c4.jpg");
            const userName = await db.get(`user.${tools.cmd.getID(ctx.sender.jid)}.username`) || "@guest";
            const result = tools.api.createUrl("paxsenix", "/maker/fakequote", {
                text: input,
                url: profilePictureUrl,
                username: userName,
                name: ctx.sender.pushName,
                isGrayscale: true,
                watermark: `Created by ${config.bot.name}`
            });

            return await ctx.reply({
                image: {
                    url: result
                },
                mimetype: mime.lookup("png")
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};