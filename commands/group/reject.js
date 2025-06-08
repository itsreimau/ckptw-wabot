const {
    quote
} = require("@itsreimau/ckptw-mod");

module.exports = {
    name: "reject",
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(tools.msg.generateCommandExample(ctx.used, tools.cmd.getID(ctx.sender.jid)))}\n` +
            quote(tools.msg.generateNotes([`Ketik ${monospace(`${ctx.used.prefix + ctx.used.command} all`)} untuk menolak semua anggota yang tertunda.`]))
        );

        const pending = await ctx.group().pendingMembers();

        if (["a", "all"].includes(input.toLowerCase())) {
            if (pending.length === 0) return await ctx.reply(quote("✅ Tidak ada anggota yang menunggu persetujuan."));

            try {
                const allJids = pending.map(p => p.jid);
                await ctx.group().rejectPendingMembers(allJids);

                return await ctx.reply(quote(`✅ Berhasil menolak semua anggota (${allJids.length}).`));
            } catch (error) {
                return await tools.cmd.handleError(ctx, error, false);
            }
        }

        const accountJid = `${input.replace(/[^\d]/g, "")}@s.whatsapp.net`;

        const isPending = pending.some(p => p.jid === accountJid);
        if (!isPending) return await ctx.reply(quote("❎ Akun tidak ditemukan di daftar anggota yang menunggu persetujuan."));

        try {
            await ctx.group().rejectPendingMembers([accountJid]);

            return await ctx.reply(quote("✅ Berhasil ditolak!"));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};