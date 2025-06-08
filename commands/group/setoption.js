const {
    monospace,
    quote
} = require("@itsreimau/ckptw-mod");

module.exports = {
    name: "setoption",
    aliases: ["setopt"],
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(`${tools.msg.generateInstruction(["send"], ["text"])}`)}\n` +
            `${quote(tools.msg.generateCommandExample(ctx.used, "antilink"))}\n` +
            quote(tools.msg.generateNotes([`Ketik ${monospace(`${ctx.used.prefix + ctx.used.command} list`)} untuk melihat daftar.`, `Ketik ${monospace(`${ctx.used.prefix + ctx.used.command} status`)} untuk melihat status.`]))
        );

        if (["l", "list"].includes(input.toLowerCase())) {
            const listText = await tools.list.get("setoption");
            return await ctx.reply(listText);
        }

        if (["s", "status"].includes(input.toLowerCase())) {
            const groupId = tools.cmd.getID(ctx.id);
            const groupOption = await db.get(`group.${groupId}.option`) || {};

            return await ctx.reply(
                `${quote(`Antiaudio: ${groupOption.antiaudio ? "Aktif" : "Nonaktif"}`)}\n` +
                `${quote(`Antidocument: ${groupOption.antidocument ? "Aktif" : "Nonaktif"}`)}\n` +
                `${quote(`Antigif: ${groupOption.antigif ? "Aktif" : "Nonaktif"}`)}\n` +
                `${quote(`Antiimage: ${groupOption.antiimage ? "Aktif" : "Nonaktif"}`)}\n` +
                `${quote(`Antilink: ${groupOption.antilink ? "Aktif" : "Nonaktif"}`)}\n` +
                `${quote(`Antinsfw: ${groupOption.antinsfw ? "Aktif" : "Nonaktif"}`)}\n` +
                `${quote(`Antispam: ${groupOption.antispam ? "Aktif" : "Nonaktif"}`)}\n` +
                `${quote(`Antisticker: ${groupOption.antisticker ? "Aktif" : "Nonaktif"}`)}\n` +
                `${quote(`Antitagsw: ${groupOption.antitagsw ? "Aktif" : "Nonaktif"}`)}\n` +
                `${quote(`Antitoxic: ${groupOption.antitoxic ? "Aktif" : "Nonaktif"}`)}\n` +
                `${quote(`Antivideo: ${groupOption.antivideo ? "Aktif" : "Nonaktif"}`)}\n` +
                `${quote(`Autokick: ${groupOption.autokick ? "Aktif" : "Nonaktif"}`)}\n` +
                `${quote(`Gamerestrict: ${groupOption.gamerestrict ? "Aktif" : "Nonaktif"}`)}\n` +
                `${quote(`Welcome: ${groupOption.welcome ? "Aktif" : "Nonaktif"}`)}\n` +
                "\n" +
                config.msg.footer
            );
        }

        try {
            const groupId = tools.cmd.getID(ctx.id);
            let setKey;

            switch (input.toLowerCase()) {
                case "antiaudio":
                case "antidocument":
                case "antigif":
                case "antiimage":
                case "antilink":
                case "antinsfw":
                case "antispam":
                case "antisticker":
                case "antitagsw":
                case "antitoxic":
                case "antivideo":
                case "autokick":
                case "gamerestrict":
                case "welcome":
                    setKey = `group.${groupId}.option.${input.toLowerCase()}`;
                    break;
                default:
                    return await ctx.reply(quote(`❎ Opsi '${input}' tidak valid!`));
            }

            const currentStatus = await db.get(setKey);
            const newStatus = !currentStatus;

            await db.set(setKey, newStatus);
            const statusText = newStatus ? "diaktifkan" : "dinonaktifkan";
            return await ctx.reply(quote(`✅ Opsi '${input}' berhasil ${statusText}!`));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};