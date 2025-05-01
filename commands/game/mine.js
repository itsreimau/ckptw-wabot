const { monospace, quote } = require("@mengkodingan/ckptw");

const COOLDOWN = 5 * 60 * 1000; // 5 menit

module.exports = {
  name: "mine",
  category: "game",
  code: async (ctx) => {
    const userId = tools.general.getID(ctx.sender.jid);
    const now = Date.now();

    // ambil waktu terakhir mining dari database (default 0)
    const last = (await db.get(`user.${userId}.lastMineTime`)) || 0;
    if (now - last < COOLDOWN) {
      const remMs = COOLDOWN - (now - last);
      const seconds = Math.ceil(remMs / 1000);
      return ctx.reply(
        quote(`⏳ Tunggu ${monospace(seconds + "s")} lagi sebelum mining.`)
      );
    }

    // update cooldown di database
    await db.set(`user.${userId}.lastMineTime`, now);

    // ambil jenis pickaxe yang dipakai
    let pickaxe = (await db.get(`user.${userId}.pickaxe`))?.toLowerCase();
    if (!pickaxe) {
      pickaxe = "stone";
      await db.set(`user.${userId}.pickaxe`, pickaxe);
    }

    // range blok berdasarkan pickaxe
    const ranges = {
      stone:    [1, 3],
      iron:     [2, 5],
      golden:   [3, 8],
      iridium:  [4, 12],
    };
    const [minBlocks, maxBlocks] = ranges[pickaxe] || ranges.stone;

    // jumlah blok yang di-mine
    const blocks = Math.floor(Math.random() * (maxBlocks - minBlocks + 1)) + minBlocks;
    const reward = blocks * 10; // tiap blok 10 Coin

    // tambahkan koin ke database
    await db.add(`user.${userId}.coin`, reward);

    return ctx.reply(
      `${quote(`⛏️ Kamu mining dengan ${monospace(pickaxe)} pickaxe!`)}\n` +
      `${quote(`⛏️ Dapat ${monospace(blocks + " blocks")}!`)}\n` +
      `${quote(`💰 +${monospace(reward + " COIN")}`)}`
    );
  },
};
