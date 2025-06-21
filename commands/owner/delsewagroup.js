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

        const groupMetadata = await ctx.group(groupJid).metadata() || null;

        if (!groupMetadata) return await ctx.reply(quote("❎ Grup tidak valid atau bot tidak ada di grup tersebut!"));

        try {
            const groupId = ctx.getId(groupJid) || null;

            await db.delete(`group.${groupId}.sewa`);
            await db.delete(`group.${groupId}.sewaExpiration`);

            if (groupMetadata?.owner) await ctx.sendMessage(groupMetadata.owner, {
                text: quote(`🎉 Sewa bot untuk grup ${groupMetadata.subject} telah dihentikan oleh Owner!`)
            });

            return await ctx.reply(quote(`✅ Berhasil menghapus sewa bot untuk grup ${groupMetadata.subject}!`));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error);
        }
    }
};