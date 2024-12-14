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
            const [groupAntilink, groupAntinsfw, groupAntisticker, groupAntitoxic, groupAutokick, groupWelcome] = await Promise.all([
                db.get(`group.${groupId}.option.antilink`),
                db.get(`group.${groupId}.option.antinsfw`),
                db.get(`group.${groupId}.option.antisticker`),
                db.get(`group.${groupId}.option.antitoxic`),
                db.get(`group.${groupId}.option.autokick`),
                db.get(`group.${groupId}.option.welcome`)
            ]);

            return await ctx.reply(
                `${quote(`Antilink: ${groupAntilink ? "Aktif" : "Nonaktif"}`)}\n` +
                `${quote(`Antinsfw: ${groupAntinsfw ? "Aktif" : "Nonaktif"}`)}\n` +
                `${quote(`Antisticker: ${groupAntisticker ? "Aktif" : "Nonaktif"}`)}\n` +
                `${quote(`Antitoxic: ${groupAntitoxic ? "Aktif" : "Nonaktif"}`)}\n` +
                `${quote(`Autokick: ${groupAutokick ? "Aktif" : "Nonaktif"}`)}\n` +
                `${quote(`Welcome: ${groupWelcome ? "Aktif" : "Nonaktif"}`)}\n` +
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