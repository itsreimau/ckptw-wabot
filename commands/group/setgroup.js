const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "setgroup",
    aliases: ["setg"],
    category: "group",
    handler: {
        admin: true,
        banned: true,
        botAdmin: true,
        cooldown: true,
        group: true
    },
    code: async (ctx) => {
        const status = await handler(ctx, module.exports.handler);
        if (status) return;

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(`${tools.msg.generateInstruction(["send"], ["text"])}`)}\n` +
            `${quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "antilink"))}\n` +
            quote(tools.msg.generateNotes([`Ketik ${monospace(`${ctx._used.prefix + ctx._used.command} list`)} untuk melihat daftar.`]))
        );

        if (ctx.args[0] === "list") {
            const listText = await tools.list.get("setgroup");
            return await ctx.reply(listText);
        }

        try {
            const groupNumber = ctx.isGroup() ? ctx.id.split("@")[0] : null;
            let setKey;

            switch (input.toLowerCase()) {
                case "antilink":
                    setKey = `group.${groupNumber}.antilink`;
                    break;
                case "welcome":
                    setKey = `group.${groupNumber}.welcome`;
                    break;
                default:
                    return await ctx.reply(quote(`❎ Teks tidak valid.`));
            }

            const currentStatus = await db.get(setKey);
            const newStatus = !currentStatus;

            await db.set(setKey, newStatus);
            const statusText = newStatus ? "diaktifkan" : "dinonaktifkan";
            return await ctx.reply(quote(`✅ Fitur '${input}' berhasil ${statusText}!`));
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};