module.exports = {
    name: "waifusm",
    category: "entertainment",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (input?.toLowerCase() === "list") {
            const listText = await tools.list.get("waifusm");
            return await ctx.reply(listText);
        }

        try {
            const listWaifusm = ["animal", "animalears", "anusview", "ass", "barefoot", "bed", "bell", "bikini", "blonde", "bondage", "bra", "breasthold", "breasts", "bunnyears", "bunnygirl", "chain", "closeview", "cloudsview", "cum", "dress", "drunk", "elbowgloves", "erectnipples", "fateseries", "fingering", "flatchest", "food", "foxgirl", "gamecg", "genshin", "glasses", "gloves", "greenhair", "hatsunemiku", "hcatgirl", "headband", "headdress", "headphones", "hentaimiku", "hloli", "hneko", "hololive", "horns", "inshorts", "japanesecloths", "necklace", "nipples", "nobra", "nsfwbeach", "nsfwbell", "nsfwdemon", "nsfwidol", "nsfwmaid", "nsfwmenu", "nsfwvampire", "nude", "openshirt", "pantyhose", "pantypull", "penis", "pinkhair", "ponytail", "pussy", "schoolswimsuit", "schooluniform", "seethrough", "sex", "sex2", "sex3", "shirt", "shirtlift", "skirt", "spreadlegs", "spreadpussy", "squirt", "stockings", "sunglasses", "swimsuit", "tail", "tattoo", "tears", "thighhighs", "thogirls", "topless", "torncloths", "touhou", "twintails", "uncensored", "underwear", "vocaloid", "weapon", "white", "whitehair", "wings", "withflowers", "withguns", "withpetals", "withtie", "withtree", "wolfgirl", "yuri"];
            const waifusm = listWaifusm.includes(input) ? input : tools.cmd.getRandomElement(listWaifusm);
            const result = tools.api.createUrl("archive", `/api/waifusm/${waifusm}`);

            return await ctx.reply({
                image: {
                    url: result
                },
                mimetype: tools.mime.lookup("jpg"),
                caption: formatter.quote(`Kategori: ${tools.msg.ucwords(waifusm)}`),
                footer: config.msg.footer,
                buttons: [{
                    buttonId: `${ctx.used.prefix + ctx.used.command} ${input}`,
                    buttonText: {
                        displayText: "Ambil Lagi"
                    },
                    type: 1
                }],
                headerType: 1
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};