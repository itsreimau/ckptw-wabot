const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "fixdb",
    aliases: ["fixdatabase"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const input = ctx.args[0] || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx.used, "user"))
        );

        if (input === "list") {
            const listText = await tools.list.get("fixdb");
            return await ctx.reply(listText);
        }

        try {
            const waitMsg = await ctx.reply(config.msg.wait);
            const dbJSON = await db.toJSON();
            const data = {
                user: dbJSON.user || {},
                group: dbJSON.group || {},
                menfess: dbJSON.menfess || {}
            };

            const filteredData = (category, item) => {
                const mappings = {
                    user: ["afk", "banned", "coin", "lastClaim", "hasSentMsg", "level", "premium", "uid", "winGame", "xp"],
                    group: ["mute", "text", "option"],
                    menfess: ["from", "to"]
                };

                return Object.fromEntries(mappings[category].map(key => item[key] !== undefined ? [key, item[key]] : null).filter(Boolean));
            };

            const processData = async (category, data) => {
                await ctx.editMessage(waitMsg.key, quote(`🔄 Memproses data ${category}...`));
                Object.keys(data).forEach(async (id) => {
                    const item = data[id] || {};
                    const filtered = filteredData(category, item);

                    if (!/^\d+$/.test(id)) {
                        await db.delete(`${category}.${id}`);
                    } else {
                        await db.set(`${category}.${id}`, filtered);
                    }
                });
            };

            switch (input) {
                case "user":
                case "group":
                case "menfess":
                    await processData(input, data[input]);
                    break;

                default:
                    return await ctx.reply(quote(`❎ Key "${input}" tidak valid!`));
            }

            return await ctx.editMessage(waitMsg.key, quote(`✅ Basis data berhasil dibersihkan untuk ${input}!`));
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};