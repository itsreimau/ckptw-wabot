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
            `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(tools.cmd.generateCommandExample(ctx.used, tools.general.getID(ctx.sender.jid)))}\n` +
            quote(tools.cmd.generateNotes([`Ketik ${monospace(`${ctx.used.prefix + ctx.used.command} all`)} untuk menolak semua anggota yang tertunda.`]))
        );

        const accountJid = `${input.replace(/[^\d]/g, "")}@s.whatsapp.net`;

        const pending = await ctx.group().pendingMembers();
        const isPending = pending.some(p => p.jid === accountJid);

        if (!isPending) return await ctx.reply(quote("❎ Akun tidak ditemukan di daftar anggota yang menunggu persetujuan."));

        try {
            if (input.toLowerCase() === "all") {
                if (pending.length === 0) return await ctx.reply(quote("✅ Tidak ada anggota yang menunggu persetujuan."));

                const allJids = pending.map(p => p.jid);
                await ctx.group().rejectPendingMembers(allJids);

                return await ctx.reply(quote(`✅ Berhasil menolak semua anggota (${allJids.length}).`));
            }

            await ctx.group().rejectPendingMembers([accountJid]);

            return await ctx.reply(quote("✅ Berhasil ditolak!"));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};