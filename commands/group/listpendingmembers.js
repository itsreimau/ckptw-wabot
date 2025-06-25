module.exports = {
    name: "listpendingmembers",
    aliases: ["pendingmembers"],
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        const pending = await ctx.group().pendingMembers();

        if (!pending || pending.length === 0) return await ctx.reply(formatter.quote("✅ Tidak ada anggota yang menunggu persetujuan."));

        try {
            const resultText = pending.map((member, index) => {
                const id = ctx.getId(member.jid);
                return formatter.quote(`${index + 1}. ${id}`);
            }).join("\n");

            return await ctx.reply(
                `${resultText}\n` +
                "\n" +
                config.msg.footer
            );
        } catch (error) {
            return await tools.cmd.handleError(ctx, error);
        }
    }
};