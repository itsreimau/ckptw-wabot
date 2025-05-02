const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "jadian",
    aliases: ["jodoh"],
    category: "entertainment",
    permissions: {
        group: true
    },
    code: async (ctx) => {
        try {
            const members = await ctx.group().members();
            const memberIDs = members.map(m => m.id);

            let selected = [];
            selected[0] = tools.general.getRandomElement(memberIDs);
            do {
                selected[1] = tools.general.getRandomElement(memberIDs);
            } while (selected[1] === selected[0]);

            const apiUrl = tools.api.createUrl("https://raw.githubusercontent.com", "/BochilTeam/database/master/kata-kata/bucin.json");
            const word = tools.general.getRandomElement((await axios.get(apiUrl)).data);

            return await ctx.reply({
                text: `${quote(`@${tools.general.getID(selected[0])} ❤️ @${tools.general.getID(selected[1])}`)}\n` +
                    `${quote(word)}\n` +
                    "\n" +
                    config.msg.footer,
                mentions: selected
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};