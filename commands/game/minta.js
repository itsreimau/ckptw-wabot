// minta.js
const { monospace, quote } = require("@mengkodingan/ckptw");

module.exports = {
  name: "minta",
  aliases: ["beg", "minta"],
  category: "game",
  code: async (ctx) => {
    const userJid = ctx.sender.jid;
    const userId = tools.general.getID(userJid);
    const now = Date.now();
    const COOLDOWN = 60 * 1000; // 1 menit

    // cek cooldown
    const lastBeg = (await db.get(`user.${userId}.lastBeg`)) || 0;
    if (now - lastBeg < COOLDOWN) {
      const rem = Math.ceil((COOLDOWN - (now - lastBeg)) / 1000);
      return ctx.reply(
        quote(`🕔 Tunggu ${monospace(rem + "s")} lagi sebelum minta lagi!`)
      );
    }

    // update timestamp
    await db.set(`user.${userId}.lastBeg`, now);

    // random amount 
    const amount = Math.floor(Math.random() * 6);

    // possible messages
    const messages = ["Seorang dermawan memberimu beberapa koin.", "Kamu nemu koin di jalanan.", "Orang baik hati melewatimu dan memberimu sedikit koin.", "Sepeser pun saja tidak apa, kan?", "Kucing lucu menatapmu sedih, dia merasa kasihan kepadamu.", "Sekotak koin jatuh ke pangkuanmu.", "Orang lewat memasukkan koin ke embermu.", "Hanya remah-remah koin yang kamu dapat.", "Seorang pejalan kaki membantumu dengan koin.", "Kamu melihat koin di tempat sampah, kamu mengambilnya.", "Bro, dikasih recehan dikit nih, lumayan buat kopi.", "Eh, ada koin di saku bajumu yang lupa kamu simpan.", "Seseorang ga ada yang ngambil, jadi aku kasih ke kamu.", "Dapet koin dari parkiran mesin koin.", "Temenmu nitip koin tapi lupa ambil, akhirnya jadi milikmu.", "Nenek-nenek baik hati ngasih koin karena kasihan.", "Anjing lucu bawa koin jatuh di depanmu.", "Kamu nyogok tukang parkir, eh malah dapat gratis koin.", "Recehan di kolong kursi bioskop kamu kumpulkan.", "Koin jatuh dari langit… atau itu cuma hujan, ya recehan doang.", "Misterius! Sebuah kantong kecil berisi beberapa koin muncul.", "Kamu minta-minta di depan kafe, dapat diskon… yang berubah jadi koin.", "Google Adsense? Enggak, ini adsense recehan buatmu.", "Kamu nemu dompet tua, isinya cuma beberapa koin.", "Tok! Pintu jarimu ketukan, ada koin mampir ke saku."]

    // pick a random message
    const msg = messages[Math.floor(Math.random() * messages.length)];

    await db.add(`user.${userId}.coin`, amount);
    return ctx.reply(
      `${quote(msg)}\n` +
      `${quote(`+${monospace(amount + " Koin")}`)}`
    )
  }
};
