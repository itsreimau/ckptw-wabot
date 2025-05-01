// cari.js
const { monospace, quote } = require("@mengkodingan/ckptw");

module.exports = {
  name: "cari",
  aliases: ["search", "nyari"],
  category: "game",
  code: async (ctx) => {
    const userJid = ctx.sender.jid;
    const userId = tools.general.getID(userJid);
    const now = Date.now();
    const COOLDOWN = 60 * 1000; // 1 menit

    // Cooldown check
    const last = (await db.get(`user.${userId}.lastScavenge`)) || 0;
    if (now - last < COOLDOWN) {
      const rem = Math.ceil((COOLDOWN - (now - last)) / 1000);
      return ctx.reply(
        quote(`🕔 Tunggu ${monospace(rem + "s")} lagi sebelum mencari lagi!`)
      );
    }
    await db.set(`user.${userId}.lastScavenge`, now);

    // Random amount between -10 and +15
    const amount = Math.floor(Math.random() * 26) - 10;
    // Messages for positive/negative finds
    const pos = ["Kamu menemukan beberapa koin di vending machine rusak.", "Ada koin terselip di mesin cuci koin publik.", "Dompet tua di parkiran ternyata berisi beberapa koin.", "Sekumpulan receh terjatuh di tangga, kamu kumpulkan.", "Kucing lucu menuntunmu ke kantong koin tersembunyi.", "Orang lupa di warung kopi meninggalkan kembalian.", "Kotak amal kosong tiba-tiba memuntahkan koin.", "Temanmu iseng membagikan recehan, dapat sedikit koin.", "Seorang turis asing memberi tip dalam bentuk koin.", "Kamu nemu kantong kecil penuh koin di semak-semak.", "Recehan jatuh dari langit… entah dari mana asalnya.", "Kamu dapatkan kupon diskon untuk beli koin lebih murah.", "Satu koinmu membeli kupon peruntungan, ternyata kena koin."];
    const neg = ["Kamu kecopet di pasar, koinmu raib.", "Terpeleset dan koin di sakumu muncrat semua.", "Uangmu jatuh dimakan mesin parkir otomatis.", "Selembar tiket bus berubah jadi utang koin.", "Dompet sobek, koin tumpah ke got.", "Orang iseng menipu, kamu kehilangan koin.", "Kamu tertipu oleh penukar recehan palsu.", "Serangga menggigit, panik, koin terlempar.", "Hujan tiba-tiba, koinmu hilang di selokan.", "Kamu mencoba mengais, tapi malah membayar parkir.", "Kamu mencari, tapi ternyata dompetmu di rumah.", "Sarapanmu terlalu enak, malah lupa koin di meja."];

    // pick message
    let msg;
    if (amount > 0) {
      msg = pos[Math.floor(Math.random() * pos.length)];
      await db.add(`user.${userId}.coin`, amount);
      return ctx.reply(
        `${quote(msg)}\n` +
        `${quote(`+${monospace(amount + " Koin")}`)}`
      );
    } else if (amount < 0) {
      msg = neg[Math.floor(Math.random() * neg.length)];
      await db.add(`user.${userId}.coin`, amount); // amount is negative
      return ctx.reply(
        `${quote(msg)}\n` +
        `${quote(`${monospace(amount + " Koin")}`)}`
      );
    } else {
      // amount == 0
      msg = "Kamu mencari ke mana-mana… tapi tidak menemukan apa-apa.";
      return ctx.reply(quote(msg));
    }
  }
};
