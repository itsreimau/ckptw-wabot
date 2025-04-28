const { monospace, quote } = require("@mengkodingan/ckptw");

module.exports = {
  name: "upgradepickaxe",
  aliases: ["upickaxe", "upick"],
  category: "game",
  code: async (ctx) => {
    const userId = tools.general.getID(ctx.sender.jid);

    // mapping upgrade: current → { next level, price }
    const upgradeMap = {
      stone:   { next: "iron",    price: 500 },
      iron:    { next: "golden",  price: 2000 },
      golden:  { next: "iridium", price: 8000 }
    };

    // baca atau inisialisasi level pickaxe sekarang (default stone)
    let current = (await db.get(`user.${userId}.pickaxe`))?.toLowerCase();
    if (!current) {
      current = "stone";
      await db.set(`user.${userId}.pickaxe`, current);
    }

    // cek apakah ada level selanjutnya
    const info = upgradeMap[current];
    if (!info) {
      return ctx.reply(
        quote(`⚠️ Pickaxe-mu sudah paling tinggi: ${monospace(current)}`)
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
    await db.set(`user.${userId}.pickaxe`, info.next);

    // konfirmasi ke user
    return ctx.reply(
      quote(
        `✅ Upgrade sukses! Pickaxe-mu sekarang: ${monospace(info.next)}.` +
        `\n${costMessage}`
      )
    );
  }
};
