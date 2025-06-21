const {
    quote
} = require("@itsreimau/ckptw-mod");

module.exports = {
    name: "listsewagroup",
    aliases: ["listsewa"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        try {
            const groups = (await db.toJSON()).group;
            const sewaGroups = [];

            for (const groupId in groups) {
                if (groups[groupId].sewa === true) {
                    sewaGroups.push({
                        id: groupId,
                        expiration: groups[groupId].sewaExpiration
                    });
                }
            }

            let resultText = "";
            const groupMentions = [];

            for (const group of sewaGroups) {
                const groupJid = `${group.id}@g.us`;
                const groupInfo = await ctx.group(groupJid).catch(() => null);

                if (groupInfo) {
                    const metadata = await groupInfo.metadata().catch(() => null);
                    const groupName = metadata?.subject || group.id;

                    groupMentions.push({
                        groupJid,
                        groupSubject: groupName
                    });

                    if (group.expiration) {
                        const daysLeft = Math.ceil((group.expiration - Date.now()) / (24 * 60 * 60 * 1000));
                        resultText += `${quote(`@${groupJid} (${daysLeft} hari tersisa)`)}\n`;
                    } else {
                        resultText += `${quote(`@${groupJid} (Sewa permanen)`)}\n`;
                    }
                }
            }

            return await ctx.reply({
                text: `${resultText || config.msg.notFound}\n` +
                    "\n" +
                    config.msg.footer,
                contextInfo: {
                    groupMentions
                }
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error);
        }
    }
};