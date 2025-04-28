// doubleornothing.js
const { monospace, quote } = require("@mengkodingan/ckptw");

// prevent multiple games per chat
const sessions = new Map();

module.exports = {
  name: "doubleornothing",
  aliases: ["don"],
  category: "game",
  code: async (ctx) => {
    const chatId = ctx.id;
    if (sessions.has(chatId)) {
      return ctx.reply(quote("🕹️ Permainan sudah berlangsung di sini!"));
    }
    sessions.set(chatId, true);

    try {
      // parse bet
      const betArg = ctx.args[0];
      const bet = parseInt(betArg, 10);
      if (!betArg || isNaN(bet) || bet < 10) {
        sessions.delete(chatId);
        return ctx.reply(quote(
          `Penggunaan: ${monospace(ctx.used.prefix + ctx.used.command)} <taruhan (>=10)>`
        ));
      }

      // load user balance
      const playerJid = ctx.sender.jid;
      const playerId = tools.general.getID(playerJid);
      const userDb = (await db.get(`user.${playerId}`)) || {};
      const balance = userDb.coin || 0;

      if (balance < bet) {
        sessions.delete(chatId);
        return ctx.reply(quote("❎ Anda tidak memiliki cukup koin!"));
      }

      // deduct initial bet
      await db.add(`user.${playerId}.coin`, -bet);
      let current = bet * 2; // first win would be double

      // perform first flip
      const win = Math.random() < 0.5;
      if (!win) {
        sessions.delete(chatId);
        return ctx.reply(quote(
          `💔 Anda kalah ${monospace(bet + " koin")} pada flip pertama!`
        ));
      }

      // on win, prompt for take or flip
      await ctx.reply(
        `${quote(`🎉 Anda menang! Kemenangan: ${monospace(current + " koin")}`)}
` +
        `${quote(`Ketik ${monospace("ambil")} untuk mengambil kemenangan, atau ${monospace("double")} untuk menggandakan lagi.`)}`
      );

      // collector for decisions
      const collector = ctx.MessageCollector({ time: 60000 });
      collector.on('collect', async m => {
        if (m.sender !== playerJid) return;
        const cmd = m.content.toLowerCase();
        if (cmd === 'ambil') {
          // cash out
          await db.add(`user.${playerId}.coin`, current);
          sessions.delete(chatId);
          await ctx.sendMessage(chatId, { text: quote(
            `💰 Anda mengambil ${monospace(current + " koin")}! Selamat!`
          )}, { quoted: m });
          collector.stop();
        } else if (cmd === 'double') {
          // attempt next flip
          const winNext = Math.random() < 0.5;
          if (!winNext) {
            sessions.delete(chatId);
            await ctx.sendMessage(chatId, { text: quote(
              `💥 Anda kalah segalanya! Kemenangan terakhir adalah ${monospace(current + " koin")}. Lebih baik beruntung lain waktu.`
            )}, { quoted: m });
            collector.stop();
          } else {
            // double current
            current *= 2;
            await ctx.sendMessage(chatId, { text: quote(
              `🎉 Bagus! Kemenangan berikutnya: ${monospace(current + " koin")}`
            )}, { quoted: m });
            // continue waiting for take or flip
          }
        }
      });
      collector.on('end', () => {
        sessions.delete(chatId);
      });

    } catch (err) {
      sessions.delete(chatId);
      console.error(err);
      return tools.cmd.handleError(ctx, err, false);
    }
  }
};

