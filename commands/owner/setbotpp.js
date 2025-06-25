module.exports = {
    name: "setbotpp",
    aliases: ["setboticon", "seticonbot", "setppbot"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const messageType = ctx.getMessageType();
        const [checkMedia, checkQuotedMedia] = await Promise.all([
            tools.cmd.checkMedia(messageType, "image"),
            tools.cmd.checkQuotedMedia(ctx.quoted, "image")
        ]);

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(formatter.quote(tools.msg.generateInstruction(["send", "reply"], "image")));

        try {
            const buffer = await ctx.msg.media?.toBuffer() || await ctx.quoted?.media?.toBuffer();
            await ctx.core.updateProfilePicture(ctx.core.user.id, buffer);

            return await ctx.reply(formatter.quote("✅ Berhasil mengubah gambar profil bot!"));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error);
        }
    }
};