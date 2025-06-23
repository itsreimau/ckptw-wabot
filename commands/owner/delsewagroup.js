const {
    quote
} = require("@itsreimau/ckptw-mod");

module.exports = {
    name: "delsewagroup",
    aliases: ["delsewa", "delsewagrup", "dsg"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const groupJid = ctx.isGroup() ? ctx.id : (ctx.args[0] ? `${ctx.args[0].replace(/[^\d]/g, "")}@g.us` : null);

        if (!groupJid) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(tools.msg.generateCmdExample(ctx.used, "1234567890"))}\n` +
            quote(tools.msg.generateNotes(["Gunakan di grup untuk otomatis menghapus sewa grup tersebut."]))
        );

        if (!await ctx.group(groupJid).catch(() => null)) return await ctx.reply(quote("❎ Grup tidak valid atau bot tidak ada di grup tersebut!"));

        try {
            const groupId = ctx.getId(groupJid) || null;

            await db.delete(`group.${groupId}.sewa`);
            await db.delete(`group.${groupId}.sewaExpiration`);

            const groupOwner = await ctx.group(groupJid).owner().catch(() => null);
            const groupMentions = [{
                groupJid: `${group.id}@g.us`,
                groupSubject: await ctx.group(groupJid).name().catch(() => null)
            }];

            if (groupOwner) await ctx.sendMessage(groupOwner, {
                text: quote(`📢 Sewa bot untuk grup @${groupMentions.groupJid} telah dihentikan oleh Owner!`),
                contextInfo: {
                    groupMentions
                }
            });
            return await ctx.reply(quote(`✅ Berhasil menghapus sewa bot untuk grup ini!`));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error);
        }
    }
};