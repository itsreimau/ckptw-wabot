const {
    createAPIUrl
} = require("../tools/api.js");
const {
    formatSize
} = require("../tools/general.js");
const {
    bold,
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "gddl",
    aliases: ["gd", "gdrive", "gdrivedl", "googledrive", "googledrivedl"],
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
            `${quote(global.msg.argument)}\n` +
            quote(`Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} https://example.com/`)}`)
        );

        const urlRegex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i;
        if (!urlRegex.test(input)) return ctx.reply(global.msg.urlInvalid);

        try {
            const result = await googleDriveDl(input);

            if (!result) return ctx.reply(global.msg.notFound);

            return ctx.reply({
                document: {
                    url: result.downloadUrl
                },
                filename: result.fileName,
                mimetype: mime.contentType(result.contentType) || "application/octet-stream"
            });
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};

async function googleDriveDl(url) {
    let id;
    if (!(url && url.match(/drive\.google/i))) throw "Invalid URL";
    id = (url.match(/\/?id=(.+)/i) || url.match(/\/d\/(.*?)\//))[1];
    if (!id) throw "ID not found!";

    let res;
    try {
        res = await axios.post(createAPIUrl("https://drive.google.com", "/uc", {
            id: id,
            authuser: 0,
            export: "download"
        }), null, {
            headers: {
                "accept-encoding": "gzip, deflate, br",
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                "origin": "https://drive.google.com",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36",
                "x-client-data": "CKG1yQEIkbbJAQiitskBCMS2yQEIqZ3KAQioo8oBGLeYygE=",
                "x-drive-first-party": "DriveWebUi",
                "x-json-requested": "true"
            }
        });
    } catch (error) {
        throw `Request to Drive API failed: ${error.message}`;
    }

    let {
        fileName,
        sizeBytes,
        downloadUrl
    } = JSON.parse(res.data.slice(4));
    if (!downloadUrl) throw "Download limit!";

    let data;
    try {
        data = await axios.get(downloadUrl, {
            responseType: "stream"
        });
    } catch (error) {
        throw `Download failed: ${error.message}`;
    }

    return {
        downloadUrl,
        fileName,
        fileSize: formatSize(sizeBytes),
        contentType: data.headers["content-type"]
    };
}