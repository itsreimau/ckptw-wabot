const {
    quote
} = require("@mengkodingan/ckptw");

function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}  

module.exports = { 
    name: "apakah", 
    aliases: ["apkh"], 
    category: "entertainment",
    permissions: { 
        coin: 5
    },
    code: async (ctx) => { 
        const input = ctx.args.join(" ") || null;

        return await ctx.reply(quote(`*Pertanyaan:* apakah ${input} \n`) +
            quote(`*Jawaban:* ${getRandom([
            'Ya',
            'Yoi',
            'Iya dong',
            'Tentu',
            'Pasti',
            'Udah pasti',
            'Fix banget',
            'Gas!',
            'Seriusan iya',
            'Jelas lah',
            'Iyain aja deh',
            'Mungkin',
            'Mungkin iya',
            'Mungkin nggak',
            'Kayaknya iya',
            'Kayaknya enggak',
            '50:50',
            'Bisa jadi',
            'Entahlah',
            'Tergantung mood',
            'Tergantung siapa yang nanya',
            'Kondisional banget nih',
            'Gatau sih, cobain aja dulu',
            'Masih dipikirin',
            'Belum kepikiran',
            'Ntar dulu ya',
            'Hmm...',
            'Enggak dulu deh',
            'Tidak',
            'Ogah',
            'Nggak lah',
            'Nope',
            'Nggak mungkin',
            'Mustahil sih',
            'Apaan sih',
            'Waduh jangan',
            'Lah kok gitu?',
            'Emangnya bisa?',
            'Lu ngimpi ya?',
            'Hehe... ngarep',
            'Gitu amat yak',
            'Lu pikir gampang?',
            'Beneran nanya nih?',
            'Yaelah bro',
            'Ngaco lu',
            'Coba ulang pertanyaannya deh',
            'Nggak yakin banget',
            'Serius lo?',
            'Gajelas' ])}`) + '\n \n' + config.msg.footer);
    }
};