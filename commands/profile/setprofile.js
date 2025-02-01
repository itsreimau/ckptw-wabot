const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "setprofile",
    aliases: ["set", "setp", "setprof"],
    category: "profile",
    permissions: {},
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(`${tools.msg.generateInstruction(["send"], ["text"])}`)}\n` +
            `${quote(tools.msg.generateCommandExample(ctx.used, "autolevelup"))}\n` +
            quote(tools.msg.generateNotes([`Ketik ${monospace(`${ctx.used.prefix + ctx.used.command} list`)} untuk melihat daftar.`]))
        );

        if (ctx.args[0] === "list") {
            const listText = await tools.list.get("setprofile");
            return await ctx.reply(listText);
        }

        try {
            const senderId = tools.general.getID(ctx.sender.jid);;
            let setKey;

            switch (input.toLowerCase()) {
                case "autolevelup":
                    setKey = `user.${senderId}.autolevelup`;
                    break;
                default:
                    return await ctx.reply(quote(`❎ Teks tidak valid.`));
            }

            const currentStatus = await db.get(setKey) || false;
            const newStatus = !currentStatus;
            await db.set(setKey, newStatus);

            const statusText = newStatus ? "diaktifkan" : "dinonaktifkan";
            return await ctx.reply(quote(`✅ Fitur '${input}' berhasil ${statusText}!`));
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};