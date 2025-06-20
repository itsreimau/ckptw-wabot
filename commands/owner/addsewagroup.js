const {
    quote
} = require("@itsreimau/ckptw-mod");

module.exports = {
    name: "addsewagroup",
    aliases: ["addsewa", "addsewagrup", "adg"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const groupJid = ctx.isGroup ? ctx.id : (ctx.args[0] ? `${ctx.args[0].replace(/[^\d]/g, "")}@g.us` : null);
        const daysAmount = ctx.args[ctx.isGroup ? 0 : 1] ? parseInt(ctx.args[ctx.isGroup ? 0 : 1], 10) : null;

        if (!groupJid) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(tools.msg.generateCmdExample(ctx.used, `${ctx.isGroup ? ctx.getId(ctx.id) : "1234567890"} 30`))}\n` +
            quote(tools.msg.generateNotes(["Gunakan di grup untuk otomatis menyewakan grup tersebut."]))
        );

        if (daysAmount && daysAmount <= 0) return await ctx.reply(quote("❎ Durasi sewa (dalam hari) harus diisi dan lebih dari 0!"));

        try {
            const group = await ctx.group(groupJid) || null;
            if (!group) return await ctx.reply(quote("❎ Grup tidak valid atau bot tidak ada di grup tersebut!"));

            const groupId = ctx.get(groupJid) || null;

            await db.set(`group.${groupId}.sewa`, true);

            const groupOwner = await group.owner() || null;
            const groupSubject = await group.subject() || null;

            if (daysAmount && daysAmount > 0) {
                const expirationDate = Date.now() + (daysAmount * 24 * 60 * 60 * 1000);
                await db.set(`group.${groupId}.sewaExpiration`, expirationDate);

                if (groupOwner) await ctx.sendMessage(groupOwner, {
                    text: quote(`🎉 Bot berhasil disewakan ke grup-mu yaitu ${groupSubject} selama ${daysAmount} hari!`)
                });
                return await ctx.reply(quote(`✅ Berhasil menyewakan bot ke grup ${groupSubject} selama ${daysAmount} hari!`));
            } else {
                await db.delete(`group.${groupId}.sewaExpiration`);

                if (groupOwner) await ctx.sendMessage(groupOwner, {
                    text: quote(`📢 Bot berhasil disewakan ke grup-mu yaitu ${groupSubject} selamanya!`)
                });
                return await ctx.reply(quote(`✅ Berhasil menyewakan bot ke grup ${groupSubject} selamanya!`));
            }
        } catch (error) {
            return await tools.cmd.handleError(ctx, error);
        }
    }
};