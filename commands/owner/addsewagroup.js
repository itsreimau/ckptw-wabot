module.exports = {
    name: "addsewagroup",
    aliases: ["addsewa", "addsewagrup", "adg"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const groupJid = ctx.isGroup() ? ctx.id : (ctx.args[0] ? `${ctx.args[0].replace(/[^\d]/g, "")}@g.us` : null);
        const daysAmount = ctx.args[ctx.isGroup() ? 0 : 1] ? parseInt(ctx.args[ctx.isGroup() ? 0 : 1], 10) : null;

        if (!groupJid) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${formatter.quote(tools.msg.generateCmdExample(ctx.used, "1234567890 30"))}\n` +
            `${formatter.quote(tools.msg.generateNotes(["Gunakan di grup untuk otomatis menyewakan grup tersebut."]))}\n` +
            formatter.quote(tools.msg.generatesFlagInfo({
                "-s": "Tetap diam dengan tidak menyiarkan ke orang yang relevan"
            }))
        );

        if (daysAmount && daysAmount <= 0) return await ctx.reply(formatter.quote("❎ Durasi sewa (dalam hari) harus diisi dan lebih dari 0!"));
        if (!await ctx.group(groupJid).catch(() => null)) return await ctx.reply(formatter.quote("❎ Grup tidak valid atau bot tidak ada di grup tersebut!"));

        try {
            const groupId = ctx.getId(groupJid) || null;

            await db.set(`group.${groupId}.sewa`, true);

            const flag = tools.cmd.parseFlag(ctx.args.join(" "), {
                "-s": {
                    type: "boolean",
                    key: "silent"
                }
            });
            if (flag?.silent) {
                const groupOwner = (await ctx.group(groupJid)).owner().catch(() => null);
                const groupMentions = [{
                    groupJid: `${group.id}@g.us`,
                    groupSubject: (await ctx.group(groupJid)).name().catch(() => null)
                }];
            }

            if (daysAmount && daysAmount > 0) {
                const expirationDate = Date.now() + (daysAmount * 24 * 60 * 60 * 1000);
                await db.set(`group.${groupId}.sewaExpiration`, expirationDate);

                if (!flag?.silent && groupOwner) await ctx.sendMessage(groupOwner, {
                    text: formatter.quote(`📢 Bot berhasil disewakan ke grup @${groupMentions.groupJid} selama ${daysAmount} hari!`),
                    contextInfo: {
                        groupMentions
                    }
                });

                return await ctx.reply(formatter.quote(`✅ Berhasil menyewakan bot ke grup ini selama ${daysAmount} hari!`));
            } else {
                await db.delete(`group.${groupId}.sewaExpiration`);

                if (!flag?.silent && groupOwner) await ctx.sendMessage(groupOwner, {
                    text: formatter.quote(`📢 Bot berhasil disewakan ke grup @${groupMentions.groupJid} selamanya!`),
                    contextInfo: {
                        groupMentions
                    }
                });

                return await ctx.reply(formatter.quote(`✅ Berhasil menyewakan bot ke grup ini selamanya!`));
            }
        } catch (error) {
            return await tools.cmd.handleError(ctx, error);
        }
    }
};