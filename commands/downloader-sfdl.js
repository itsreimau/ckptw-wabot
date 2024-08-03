const {
    createAPIUrl
} = require("../tools/api.js");
const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const cheerio = require("cheerio");

module.exports = {
    name: "sfdl",
    aliases: ["sf", "sfile", "sfiledl"],
    category: "downloader",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            coin: 3
        });
        if (status) return ctx.reply(message);

        const input = ctx._args.join(" ") || null;

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} https://example.com/`)}`
        );

        const urlRegex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i;
        if (urlRegex.test(input)) {
            if (input.match(/(https:\/\/sfile.mobi\/)/gi)) {
                try {
                    const result = await sfileDl(input);
                    if (!result) return ctx.reply(global.msg.notFound);

                    return ctx.reply({
                        document: {
                            url: result.download
                        },
                        filename: result.filename,
                        mimetype: result.mimetype || "application/octet-stream"
                    });
                } catch (error) {
                    console.error("Error:", error);
                    return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
                }
            }
        } else {
            const [query, page] = input.split("|");
            try {
                const result = await sfileSearch(query, page);
                if (!result.length) return ctx.reply(global.msg.notFound);

                const resultText = result.map((r) =>
                    `➲ Judul: ${r.title}\n` +
                    `➲ Ukuran: ${r.size}\n` +
                    `➲ URL: ${r.link}`
                ).join(
                    "\n" +
                    "-----\n"
                );

                return ctx.reply(
                    `${bold("❖ Sfile Search")}\n` +
                    "\n" +
                    `${resultText}\n` +
                    "\n" +
                    global.msg.footer
                );
            } catch (error) {
                console.error("Error:", error);
                return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
            }
        }
    }
};

async function sfileSearch(query, page = 1) {
    try {
        let res = await axios.get(createAPIUrl("https://sfile.mobi", "/search.php", {
            q: query,
            page: page
        }));
        let $ = cheerio.load(res.data);
        let result = [];
        $("div.list").each(function() {
            let title = $(this).find("a").text();
            let size = $(this).text().trim().split("(")[1];
            let link = $(this).find("a").attr("href");
            if (link) result.push({
                title,
                size: size.replace(")", ""),
                link
            });
        });
        return result;
    } catch (error) {
        console.error("Error:", error);
        throw new Error("Error fetching search results.");
    }
}

async function sfileDl(url) {
    try {
        let res = await axios.get(url);
        let $ = cheerio.load(res.data);
        let filename = $("div.w3-row-padding").find("img").attr("alt");
        let mimetype = $("div.list").text().split(" - ")[1].split("\n")[0];
        let filesize = $("#download").text().replace(/Download File/g, "").replace(/\(|\)/g, "").trim();
        let download = $("#download").attr("href") + "&k=" + Math.floor(Math.random() * (15 - 10 + 1) + 10);
        return {
            filename,
            filesize,
            mimetype,
            download
        };
    } catch (error) {
        console.error("Error:", error);
        throw new Error("Error fetching download details.");
    }
}