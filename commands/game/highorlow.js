// highlow.js
const { monospace, quote } = require("@mengkodingan/ckptw");

module.exports = {
  name: "highorlow",
  category: "game",
  aliases: ["hol"],
  code: async (ctx) => {
    try {
      const userJid = ctx.sender.jid;
      const userId = tools.general.getID(userJid);
      const [ amtArg, choiceArg ] = ctx.args;
      const amount = parseInt(amtArg, 10);
      const choice = choiceArg?.toLowerCase();

      // pengecekan penggunaan
      if (!amtArg || !choiceArg) {
        return ctx.reply(
          quote(
            `Penggunaan: ${monospace(ctx.used.prefix + ctx.used.command)} <jumlah> <high/middle/low>`
          )
        );
      }

      // validasi jumlah
      if (isNaN(amount) || amount < 10) {
        return ctx.reply(quote("Taruhan minimal adalah 10 koin!"));
      }

      // validasi pilihan
      if (!["high", "middle", "low"].includes(choice)) {
        return ctx.reply(quote("Pilihan harus high, middle, atau low!"));
      }

      // muat data pengguna
      const userDb = (await db.get(`user.${userId}`)) || {};
      const coin = userDb.coin || 0;

      if (coin < amount) {
        return ctx.reply(quote("Koin tidak cukup!"));
      }

      // undi nomor acak 1-99
      const result = Math.floor(Math.random() * 99) + 1;
      let area;
      if (result > 50) area = "high";
      else if (result < 50) area = "low";
      else area = "middle"; // tepat 50

      // teks permainan seru
      let text = "🎲 Selamat datang di High-Middle-Low! 🎲\n\n";
      text += `✨ Nomor yang diundi: ${monospace(result.toString())} (${area.toUpperCase()})\n\n`;

      // tentukan menang atau kalah dan pembayaran
      let payout;
      if (choice === area) {
        const mult = area === "middle" ? 100 : 2;
        payout = amount * mult;
        await db.add(`user.${userId}.coin`, payout);
        text += `🎉 Boom! Anda menebak *${area}*! Anda menang ${amount} x${mult} = ${payout} koin!\n`;
      } else {
        payout = -amount;
        await db.add(`user.${userId}.coin`, payout);
        text += `💔 Oh tidak! Anda kalah ${amount} koin. Semoga beruntung di lain waktu!\n`;
      }

      const newBalance = (await db.get(`user.${userId}.coin`)) || 0;
      text += `💰 Saldo baru Anda: ${newBalance} koin.`;

      return ctx.reply(quote(text));
    } catch (err) {
      console.error(err);
      return await tools.cmd.handleError(ctx, err, false);
    }
  }
};

