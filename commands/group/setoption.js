const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "setoption",
    aliases: ["setopt"],
    category: "group",
    handler: {
        admin: true,
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(`${tools.msg.generateInstruction(["send"], ["text"])}`)}\n` +
            `${quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "antilink"))}\n` +
            quote(tools.msg.generateNotes([`Ketik ${monospace(`${ctx._used.prefix + ctx._used.command} list`)} untuk melihat daftar.`, `Ketik ${monospace(`${ctx._used.prefix + ctx._used.command} status`)} untuk melihat status.`]))
        );

        if (ctx.args[0] === "list") {
            const listText = await tools.list.get("setoption");
            return await ctx.reply(listText);
        }

        if (ctx.args[0] === "status") {
            const groupId = ctx.isGroup() ? ctx.id.split("@")[0] : null;
            const groupOption = await db.get(`group.${groupId}.option`) || {};

            return await ctx.reply(
                `${quote(`Antilink: ${groupOption.antilink ? "Aktif" : "Nonaktif"}`)}\n` +
                `${quote(`Antinsfw: ${groupOption.antinsfw ? "Aktif" : "Nonaktif"}`)}\n` +
                `${quote(`Antisticker: ${groupOption.antisticker ? "Aktif" : "Nonaktif"}`)}\n` +
                `${quote(`Antitoxic: ${groupOption.antitoxic ? "Aktif" : "Nonaktif"}`)}\n` +
                `${quote(`Autokick: ${groupOption.autokick ? "Aktif" : "Nonaktif"}`)}\n` +
                `${quote(`Welcome: ${groupOption.welcome ? "Aktif" : "Nonaktif"}`)}\n` +
                "\n" +
                config.msg.footer
            );
        }

        try {
            const groupId = ctx.isGroup() ? ctx.id.split("@")[0] : null;
            let setKey;

            switch (input.toLowerCase()) {
                case "antilink":
                    setKey = `group.${groupId}.option.antilink`;
                    break;
                case "antinsfw":
                    setKey = `group.${groupId}.option.antinsfw`;
                    break;
                case "antisticker":
                    setKey = `group.${groupId}.option.antisticker`;
                    break;
                case "antitoxic":
                    setKey = `group.${groupId}.option.antitoxic`;
                    break;
                case "autokick":
                    setKey = `group.${groupId}.option.autokick`;
                    break;
                case "welcome":
                    setKey = `group.${groupId}.option.welcome`;
                    break;
                default:
                    return await ctx.reply(quote(`❎ Key '${input}' tidak valid!`));
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