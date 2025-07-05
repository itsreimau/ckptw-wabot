const session = new Map();

module.exports = {
    name: "suit",
    category: "game",
    permissions: {
        group: true
    },
    code: async (ctx) => {
        const accountJid = ctx?.quoted?.senderJid || ctx.msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || null;
        const accountId = ctx.getId(accountJid);

        const senderJid = ctx.sender.jid;
        const senderId = ctx.getId(senderJid);

        if (!accountJid) return await ctx.reply({
            text: `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
                `${formatter.quote(tools.msg.generateCmdExample(ctx.used, `@${senderId}`))}\n` +
                formatter.quote(tools.msg.generateNotes(["Balas atau kutip pesan untuk menjadikan pengirim sebagai akun target."])),
            mentions: [senderJid]
        });

        if (accountJid === senderJid) return await ctx.reply(formatter.quote("Tidak bisa menantang diri sendiri!"));
        if (accountId === config.bot.id) return await ctx.reply(formatter.quote("Tidak bisa menantang bot!"));

        const existingGame = [...session.values()].find(game => game.players.includes(senderJid) || game.players.includes(accountJid));
        if (existingGame) return await ctx.reply(formatter.quote("Salah satu pemain sedang dalam sesi permainan!"));

        try {
            const game = {
                players: [senderJid, accountJid],
                coin: 10,
                timeout: 120000,
                choices: new Map(),
                started: false
            };

            await ctx.reply({
                text: `${formatter.quote(`Kamu menantang @${accountId} untuk bermain suit!`)}\n` +
                    formatter.quote(`Bonus: ${game.coin} Koin`),
                mentions: [accountJid],
                footer: config.msg.footer,
                buttons: [{
                    buttonId: "accept",
                    buttonText: {
                        displayText: "Terima"
                    },
                    type: 1
                }, {
                    buttonId: "reject",
                    buttonText: {
                        displayText: "Tolak"
                    },
                    type: 1
                }],
                headerType: 1
            });

            session.set(senderJid, game);
            session.set(accountJid, game);

            const collector = ctx.MessageCollector({
                filter: (m) => [senderJid, accountJid].includes(m.sender),
                time: game.timeout,
                hears: [senderJid, accountJid]
            });

            collector.on("collect", async (m) => {
                const participantAnswer = m.content.toLowerCase();
                const participantJid = m.sender;
                const participantId = ctx.getId(participantJid);
                const isGroup = m.jid.endsWith("@g.us");

                if (!game.started && isGroup && participantId === accountId) {
                    if (participantAnswer === "accept") {
                        game.started = true;
                        await ctx.sendMessage(m.jid, {
                            text: formatter.quote(`@${accountId} menerima tantangan! Silahkan pilih di obrolan pribadi.`),
                            mentions: [accountJid]
                        }, {
                            quoted: m
                        });

                        const choiceText = formatter.quote("Silahkan pilih salah satu:");
                        const buttons = [{
                                buttonId: "batu",
                                buttonText: {
                                    displayText: "Batu"
                                },
                                type: 1
                            },
                            {
                                buttonId: "kertas",
                                buttonText: {
                                    displayText: "Kertas"
                                },
                                type: 1
                            },
                            {
                                buttonId: "gunting",
                                buttonText: {
                                    displayText: "Gunting"
                                },
                                type: 1
                            }
                        ];

                        await ctx.sendMessage(senderJid, {
                            text: choiceText,
                            buttons,
                            headerType: 1
                        });
                        await ctx.sendMessage(accountJid, {
                            text: choiceText,
                            buttons,
                            headerType: 1
                        });
                    } else if (participantAnswer === "reject") {
                        session.delete(senderJid);
                        session.delete(accountJid);
                        await ctx.reply({
                            text: formatter.quote(`@${accountId} menolak tantangan suit.`),
                            mentions: [accountJid]
                        }, {
                            quoted: m
                        });
                        return collector.stop();
                    }
                }

                if (!isGroup && game.started) {
                    const choices = {
                        batu: {
                            index: 0,
                            name: "Batu"
                        },
                        kertas: {
                            index: 1,
                            name: "Kertas"
                        },
                        gunting: {
                            index: 2,
                            name: "Gunting"
                        }
                    };
                    const choiceData = choices[participantAnswer];

                    if (choiceData) {
                        game.choices.set(participantId, choiceData);

                        await ctx.sendMessage(participantJid, {
                            text: formatter.quote(`Anda memilih: ${choiceData.name}`)
                        }, {
                            quoted: m
                        });

                        if (game.choices.size === 2) {
                            const [sChoice, aChoice] = [
                                game.choices.get(senderId),
                                game.choices.get(accountId)
                            ];

                            const result = (3 + sChoice.index - aChoice.index) % 3;
                            let winnerText, coinText = "";

                            if (result === 0) {
                                winnerText = "Seri!";
                            } else if (result === 1) {
                                winnerText = `${senderId} menang!`;
                                await db.add(`user.${senderId}.coin`, game.coin);
                                await db.add(`user.${senderId}.winGame`, 1);
                                coinText = `+${game.coin} Koin untuk @${senderId}`;
                            } else {
                                winnerText = `${accountId} menang!`;
                                await db.add(`user.${accountId}.coin`, game.coin);
                                await db.add(`user.${accountId}.winGame`, 1);
                                coinText = `+${game.coin} Koin untuk @${accountId}`;
                            }

                            await ctx.reply({
                                text: `${formatter.quote("Hasil suit:")}\n` +
                                    `${formatter.quote(`@${senderId}: ${sChoice.name}`)}\n` +
                                    `${formatter.quote(`@${accountId}: ${aChoice.name}`)}\n` +
                                    `${formatter.quote(winnerText)}\n` +
                                    formatter.quote(coinText),
                                mentions: [senderJid, accountJid]
                            });

                            session.delete(senderJid);
                            session.delete(accountJid);
                            return collector.stop();
                        }
                    }
                }
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error);
        }
    }
};