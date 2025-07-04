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

        const existingGame = [...session.values()].find(game => game.players.includes(senderJid) || game.players.includes(accountJid));
        if (existingGame) return await ctx.reply(formatter.quote("🎮 Salah satu pemain sedang dalam sesi permainan!"));

        try {
            const game = {
                players: [senderJid, accountJid],
                coin: 10,
                timeout: 120000,
                choices: new Map()
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
                time: game.timeout,
                hears: [senderJid, accountJid]
            });

            collector.on("collect", async (m) => {
                const participantAnswer = m.content.toLowerCase();
                const participantId = ctx.getId(m.sender);
                const isGroup = m.jid.endsWith("@g.us");

                if (isGroup && participantId === accountId) {
                    if (participantAnswer === "accept") {
                        await ctx.sendMessage({
                            text: formatter.quote(`@${accountId} menerima tantangan suit! Silahkan pilih di obrolan pribadi.`),
                            mentions: [accountJid]
                        }, {
                            quoted: m
                        });

                        const choiceText = formatter.quote("Silahkan pilih salah satu!");
                        const buttons = [{
                                buttonId: "gunting",
                                buttonText: {
                                    displayText: "Gunting"
                                },
                                type: 1
                            }, {
                                buttonId: "kertas",
                                buttonText: {
                                    displayText: "Kertas"
                                },
                                type: 1
                            },
                            {
                                buttonId: "batu",
                                buttonText: {
                                    displayText: "Batu"
                                },
                                type: 1
                            }
                        ];

                        await ctx.sendMessage(senderJid, {
                            text: choiceText,
                            footer: config.msg.footer,
                            buttons,
                            headerType: 1
                        });
                        await ctx.sendMessage(accountJid, {
                            text: choiceText,
                            footer: config.msg.footer,
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

                if (!isGroup) {
                    const participantJid = m.sender;
                    const currentGame = session.get(participantJid);
                    if (!currentGame) return;

                    const choices = {
                        batu: 0,
                        kertas: 1,
                        gunting: 2
                    };
                    const selectedChoice = choices[participantAnswer];

                    if (selectedChoice) {
                        currentGame.choices.set(participantId, selectedChoice);

                        await ctx.reply({
                            text: formatter.quote(`Anda memilih: ${selectedChoice}`)
                        }, {
                            quoted: m
                        });

                        if (currentGame.choices.has(senderId) && currentGame.choices.has(accountId)) {
                            const [sChoice, aChoice] = [currentGame.choices.get(senderId), currentGame.choices.get(accountId)];
                            const result = (3 + choices[sChoice] - choices[aChoice]) % 3;

                            let winner;
                            if (result === 0) {
                                winner = "Seri!";
                            } else if (result === 1) {
                                winner = `@${senderId} menang!`;
                                await db.add(`user.${senderId}.coin`, currentGame.coin);
                                await db.add(`user.${senderId}.winGame`, 1);
                            } else {
                                winner = `@${accountId} menang!`;
                                await db.add(`user.${accountId}.coin`, currentGame.coin);
                                await db.add(`user.${accountId}.winGame`, 1);
                            }

                            await ctx.reply({
                                text: `${formatter.quote("Hasil suit:")}\n` +
                                    `${formatter.quote(`@${senderId}: ${sChoice}`)}\n` +
                                    `${formatter.quote(`@${accountId}: ${aChoice}`)}\n` +
                                    `${formatter.quote(winner)}\n` +
                                    formatter.quote(`+${currentGame.coin} Koin`),
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
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};