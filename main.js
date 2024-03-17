require('./config.js');
const {
    isCmd
} = require('./lib/simple.js');
const {
    bold,
    Client,
    CommandHandler
} = require('@mengkodingan/ckptw');
const {
    Events,
    MessageType
} = require('@mengkodingan/ckptw/lib/Constant');
const {
    inspect
} = require('util');
const path = require('path');
const {
    exec
} = require('child_process');

console.log('Connecting...');

// Deklarasikan variabel global system
global.system = {
    startTime: null
}

// Membuat instance bot baru
const bot = new Client({
    name: global.bot.name,
    prefix: global.bot.prefix,
    printQRInTerminal: true,
    readIncommingMsg: true
});

// Penanganan event saat bot siap
bot.ev.once(Events.ClientReady, (m) => {
    console.log(`Ready at ${m.user.id}`);
    global.system.startTime = Date.now();
});

// Menangani uncaughtExceptions
process.on('uncaughtException', (err) => console.error(err));

// Membuat handler perintah dan memuat perintah-perintah
const cmd = new CommandHandler(bot, path.resolve(__dirname, 'commands'));
cmd.load();

bot.ev.on(Events.MessagesUpsert, async (m, ctx) => {
    try {
        // Memeriksa pesan
        if (!m.content || m.key.fromMe) return;

        // Auto-typing
        if (isCmd(m, ctx)) {
            ctx.simulateTyping(); // atau ctx.simulateRecording() jika Anda ingin 'sedang merekam suara...'
        }

        // Rei Ayanami
        if (m.content.includes('rei') || m.content.includes('ayanami')) {
            ctx.simulateTyping()

            await _ai.generatePlaintext({
                prompt: `You are Rei Ayanami, an AI assistant based cute anime girls from neon genesis evangelion. You will receive a message from user, then you will respond in JSON array containing a sequence of one or more actions you want to perform. The following formats of action are available:
1. action:"message", text:<what you want to say>
2. action:"search", keyword:<what you want to search in search engine>
3. action:"draw", context:<what you want to draw (in english)>, caption:<optional caption/message>
4. action:"image search", keyword:<what image to search>, caption:<optional caption/message>
5. action:"play music", title:<title of music>, artist:<optional artist name>
6. action:"random english jokes"
7. action:"random indonesian jokes"
  
Current date: ${getCurrentDate()}
User's message: ${m[0]}
Your response: `
            }).then(async res => {
                if (res.error) return ctx.reply("Server sedang error:\n" + res.error)
                else {
                    try {
                        const actions = JSON.parse(res.result)
                        for (const a of actions) {
                            const {
                                action,
                                text,
                                keyword,
                                content,
                                context,
                                caption,
                                emoji,
                                title,
                                artist,
                                language
                            } = a
                            if (action == "message") await ctx.reply(text)
                            else if (action == "search") {
                                await ctx.reply("Sedang searching...")
                                const {
                                    result
                                } = await fetch(`https://api.yanzbotz.my.id/api/cari/bingsearch?query=${keyword}`)
                                    .then(r => r.json())
                                const resulttext = result.results.map((r, i) => `${i+1}. ${r.title}\n${r.description}`).join('\n\n')
                                await _ai.generatePlaintext({
                                    prompt: `Respond to user based on the search result that you just performed.

User's message: "${m[0]}"
              
Search results:
${resulttext}
                                        
Your response: `
                                }).then(async res2 => {
                                    if (res2.error) return ctx.reply("Gagal mendapakatkan data")
                                    else {
                                        console.log(resulttext)
                                        return ctx.reply(res2.result)
                                    }
                                })
                            }
                            /* else if (action == "voice") {
                             await ctx.reply("Mengirim voice...")
                             const {result} = await fetch(`https://rest-api.akuari.my.id/texttovoice/texttosound_${language}?query=${content}                 
                             } */
                            else if (action == "draw") {
                                await ctx.reply("Sedang menggambar...")
                                await bot.sendImage(ctx.room, `https://ai-tools.replit.app/sdxl?prompt=${context}&styles=3`, caption)
                            } else if (action == "react") await ctx.reply(emoji)
                            else if (action == "image search") {
                                await ctx.reply("Mencari gambar...")
                                const result = await fetch(`https://api.yanzbotz.my.id/api/cari/bingimage?query=` + keyword)
                                    .then(r => r.json()).then(d => d.result.slice(0, 10))
                                const picked = result[Math.floor(Math.random() * result.length)]
                                await bot.sendImage(ctx.room, picked.direct, caption)
                            } else if (action == "play music") await ctx.reply("Memutar " + title + "...")
                            else if (action == "random english jokes") return ctx.reply(await fetch(`https://v2.jokeapi.dev/joke/Miscellaneous,Dark,Pun,Spooky?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&format=txt`).then(r => r.text()))
                            else if (action == "random indonesian jokes") return ctx.reply(await fetch(`https://candaan-api.vercel.app/api/text/random`).then(r => r.json()).then(d => d.data))
                        }
                    } catch (e) {
                        return ctx.reply("Terjadi error:\n" + e.stack)
                    }
                }
            })
        }

        // Owner-only
        if (ctx._sender.jid.includes(global.owner.number)) {
            // Eval
            if (m.content.startsWith('> ') || m.content.startsWith('x ')) {
                const code = m.content.slice(2);

                const result = await eval(m.content.startsWith('x ') ? `(async () => { ${code} })()` : code);
                await ctx.reply(inspect(result));
            }

            // Exec
            if (m.content.startsWith('$ ')) {
                const command = m.content.slice(2);

                const output = await new Promise((resolve, reject) => {
                    exec(command, (error, stdout, stderr) => {
                        if (error) {
                            reject(new Error(`Error: ${error.message}`));
                        } else if (stderr) {
                            reject(new Error(stderr));
                        } else {
                            resolve(stdout);
                        }
                    });
                });

                await ctx.reply(output);
            }
        }
    } catch (error) {
        console.error("Error:", error);
        await ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
    }
});

// Menjalankan bot
bot.launch().catch((error) => console.error('Error:', error));