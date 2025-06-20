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
        const groupJid = ctx.isGroup ? ctx.id : (ctx.args[0] ? `${ctx.args[0].replace(/[^\d]/g, "")}@g.us` : null);

        if (!groupJid) return await ctx.reply({
            text: `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
                `${quote(tools.msg.generateCmdExample(ctx.used, `${ctx.isGroup ? "" : "1234567890"}`))}\n` +
                quote(tools.msg.generateNotes(["Gunakan di grup untuk otomatis menghapus sewa grup tersebut."]))
        });

        try {
            const group = await ctx.group(groupJid) || null;
            if (!group) return await ctx.reply(quote("❎ Grup tidak valid atau bot tidak ada di grup tersebut!"));

            const groupId = ctx.getId(groupJid) || null;

            await db.delete(`group.${groupId}.sewa`);
            await db.delete(`group.${groupId}.sewaExpiration`);

            const groupSubject = await group.subject() || null;
            const groupOwner = await group.owner() || null;

            if (groupOwner) await ctx.sendMessage(groupOwner, {
                text: quote(`🎉 Sewa bot untuk grup ${groupSubject} telah dihentikan oleh Owner!`)
            });

            return await ctx.reply(quote(`✅ Berhasil menghapus sewa bot untuk grup ${groupSubject}!`));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error);
        }
    }
};