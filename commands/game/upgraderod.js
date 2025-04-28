// upgraderod.js
const { monospace, quote } = require("@mengkodingan/ckptw");
const { aliases } = require("../information/uptime");

module.exports = {
  name: "upgraderod",
  category: "game",
  aliases: ["uprod"],
  code: async (ctx) => {
    const userId = tools.general.getID(ctx.sender.jid);

    // mapping upgrade: current → { next level, price }
    const upgradeMap = {
      bamboo:  { next: "iron",    price: 500 },
      iron:    { next: "gold",    price: 1000 },
      gold:    { next: "iridium", price: 5000 }
    };

    // baca atau inisialisasi level pancingan sekarang (default bamboo)
    let current = (await db.get(`user.${userId}.rodlevel`))?.toLowerCase();
    if (!current) {
      current = "bamboo";
      await db.set(`user.${userId}.rodlevel`, current);
    }

    // cek apakah ada level selanjutnya
    const info = upgradeMap[current];
    if (!info) {
      return ctx.reply(
        quote(`⚠️ Pancinganmu sudah paling tinggi: ${monospace(current)}`)
      );
    }

    // ambil data user
    const userDb = (await db.get(`user.${userId}`)) || {};
    const coins = userDb.coin || 0;
    const isPremium = userDb.premium;
    const isOwner = tools.general.isOwner(userId);

    let costMessage = "";
    // jika bukan premium atau owner, harus bayar
    if (!isPremium && !isOwner) {
      if (coins < info.price) {
        return ctx.reply(
          quote(
            `💔 Koinmu kurang! Butuh ${monospace(info.price)} untuk upgrade ke ${monospace(info.next)}.`
          )
        );
      }
      // kurangi koin
      await db.add(`user.${userId}.coin`, -info.price);
      costMessage = `- ${monospace(info.price + " koin")}`;
    } else {
      costMessage = `🔓 Gratis upgrade untuk ${isOwner ? "Owner" : "Premium User"}!`;
    }

    // lakukan upgrade
    await db.set(`user.${userId}.rodlevel`, info.next);

    // konfirmasi ke user
    return ctx.reply(
      quote(
        `✅ Upgrade sukses! Pancinganmu sekarang: ${monospace(info.next)}.` +
        `\n${costMessage}`
      )
    );
  }
};
