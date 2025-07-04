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
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            formatter.quote(tools.msg.generateCmdExample(ctx.used, "user"))
        );

        if (input.toLowercase() === "list") {
            const listText = await tools.list.get("fixdb");
            return await ctx.reply({
                text: listText,
                footer: config.msg.footer,
                interactiveButtons: []
            });
        }

        try {
            const waitMsg = await ctx.reply(config.msg.wait);
            const data = {
                user: await db.get("user") || {},
                group: await db.get("group") || {},
                menfess: await db.get("menfess") || {}
            };

            const filteredData = (category, item) => {
                const mappings = {
                    user: {
                        afk: {
                            reason: "string",
                            timestamp: "number"
                        },
                        banned: "boolean",
                        coin: "number",
                        lastClaim: {
                            daily: "number",
                            weekly: "number",
                            monthly: "number",
                            yearly: "number"
                        },
                        lastSentMsg: {
                            banned: "number",
                            cooldown: "number",
                            admin: "number",
                            botAdmin: "number",
                            coin: "number",
                            group: "number",
                            owner: "number",
                            premium: "number",
                            private: "number",
                            restrict: "number"
                        },
                        level: "number",
                        premium: "boolean",
                        premiumExpiration: "number",
                        uid: "string",
                        username: "string",
                        winGame: "number",
                        xp: "number"
                    },
                    group: {
                        maxwarnings: "number",
                        mute: "object",
                        mutebot: "boolean",
                        text: {
                            goodbye: "string",
                            intro: "string",
                            welcome: "string"
                        },
                        option: {
                            antiaudio: "boolean",
                            antidocument: "boolean",
                            antigif: "boolean",
                            antiimage: "boolean",
                            antilink: "boolean",
                            antinfsw: "boolean",
                            antisticker: "boolean",
                            antitagsw: "boolean",
                            antitoxic: "boolean",
                            antivideo: "boolean",
                            autokick: "boolean",
                            gamerestrict: "boolean",
                            welcome: "boolean"
                        },
                        sewa: "boolean",
                        sewaExpiration: "number",
                        spam: "object",
                        warnings: "object"
                    },
                    menfess: {
                        from: "string",
                        to: "string"
                    }
                };

                const validate = (obj, map) => {
                    if (typeof map === "string") {
                        return typeof obj === map;
                    } else if (typeof map === "object") {
                        if (typeof obj !== "object" || obj === null) return false;
                        const result = {};
                        for (const key in map) {
                            if (validate(obj[key], map[key])) {
                                result[key] = obj[key];
                            }
                        }
                        return result;
                    }
                    return false;
                };

                const schema = mappings[category];
                const result = validate(item, schema);
                return result || {};
            };

            const processData = async (category, data) => {
                await ctx.editMessage(waitMsg.key, formatter.quote(`🔄 Memproses data ${category}...`));
                for (const id of Object.keys(data)) {
                    const item = data[id] || {};
                    const filtered = filteredData(category, item);

                    if (!/^\d+$/.test(id) || Object.keys(filtered).length === 0) {
                        await db.delete(`${category}.${id}`);
                    } else {
                        await db.set(`${category}.${id}`, filtered);
                    }
                }
            };

            switch (input) {
                case "user":
                case "group":
                case "menfess":
                    await processData(input, data[input]);
                    break;

                default:
                    return await ctx.reply(formatter.quote(`❎ Key "${input}" tidak valid!`));
            }

            return await ctx.editMessage(waitMsg.key, formatter.quote(`✅ Database berhasil dibersihkan untuk ${input}!`));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error);
        }
    }
};