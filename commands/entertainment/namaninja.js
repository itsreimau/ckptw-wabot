const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = { 
    name: "namaninja", 
    aliases: ["ninja"], 
    category: "entertainment",
    permissions: { 
        coin: 5
    },
    code: async (ctx) => { 
        const input = ctx.args.join(" ") || null;

        return await ctx.reply(quote("Nama biasa : " + input + '\n') + 
            quote("Nama ninja : " + input.replace(/[a-z]/gi, v => {
            return {
                'a': 'ka',
                'b': 'tu',
                'c': 'mi',
                'd': 'te',
                'e': 'ku',
                'f': 'lu',
                'g': 'ji',
                'h': 'ri',
                'i': 'ki',
                'j': 'zu',
                'k': 'me',
                'l': 'ta',
                'm': 'rin',
                'n': 'to',
                'o': 'mo',
                'p': 'no',
                'q': 'ke',
                'r': 'shi',
                's': 'ari',
                't': 'ci',
                'u': 'do',
                'v': 'ru',
                'w': 'mei',
                'x': 'na',
                'y': 'fu',
                'z': 'zi'
            }[v.toLowerCase()] || v
        })) + '\n' + config.msg.footer)
    }
};