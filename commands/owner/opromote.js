const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "opromote",
    category: "owner",
    permissions: {
        botAdmin: true,
        group: true,
        owner: true
    },
    code: async (ctx) => {
        const accountJid = ctx.quoted?.senderJid || ctx.msg?.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || null;
        const senderJid = ctx.sender.jid;
        const senderId = tools.general.getID(senderJid);

        if (!accountJid) return await ctx.reply({
            text: `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
                quote(tools.msg.generateCommandExample(ctx.used, `@${senderId}`)),
            mentions: [senderJid]
        });

        try {
            if (await ctx.group().isAdmin(accountJid)) return await ctx.reply(quote(`❎ Dia adalah admin grup!`));

            await ctx.group().promote([accountJid]);

            return await ctx.reply(quote(`✅ Berhasil ditingkatkan dari anggota menjadi admin!`));
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};