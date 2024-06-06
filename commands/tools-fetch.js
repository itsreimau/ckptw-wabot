const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "fetch",
    aliases: ["get"],
    category: "tools",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true,
            coin: 3
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const url = ctx._args[0];

        if (!url) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} https://example.com/`)}`
        );

        try {
            new URL(url);
        } catch {
            return ctx.reply(global.msg.urlInvalid);
        }

        let response;
        try {
            const fetchPromise = fetchWithTimeout(url);
            response = await fetchPromise;

            if (response.status !== 200) return ctx.reply(`${response.statusText} (${response.status})`);
        } catch (error) {
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }

        const headers = response.headers;
        const status = response.status;
        let data;
        try {
            data = response.data;
        } catch (error) {
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: Gagal mendapatkan data respons.`);
        }

        // JSON check.
        try {
            const json = JSON.parse(data);
            return ctx.reply(walkJSON(json));
        } catch {}

        // Image, GIF, video, PDF, file, text check.
        const contentType = headers["content-type"];
        if (contentType && contentType.startsWith("image/")) {
            const imgRes = await axios.get(url, {
                responseType: "arraybuffer"
            });
            const imgBuff = Buffer.from(imgRes.data, "binary");

            return ctx.reply({
                image: imgBuff,
                mimetype: mime.contentType("png"),
                caption: null
            });
        } else if (contentType === "image/gif") {
            const gifRes = await axios.get(url, {
                responseType: "arraybuffer"
            });
            const gifBuff = Buffer.from(gifRes.data, "binary");

            return ctx.reply({
                video: gifBuff,
                mimetype: mime.contentType("gif"),
                caption: null,
                gifPlayback: true
            });
        } else if (contentType === "video/mp4") {
            const vidRes = await axios.get(url, {
                responseType: "arraybuffer"
            });
            const vidBuff = Buffer.from(vidRes.data, "binary");

            return ctx.reply({
                video: vidBuff,
                mimetype: mime.contentType("mp4"),
                caption: null,
                gifPlayback: false
            });
        } else if (contentType === "application/pdf" || url.endsWith(".pdf")) {
            const pdfRes = await axios.get(url, {
                responseType: "arraybuffer"
            });
            const pdfBuff = Buffer.from(pdfRes.data, "binary");

            return ctx.reply({
                document: pdfBuff,
                mimetype: mime.contentType("pdf")
            });
        } else if (contentType === "application/octet-stream") {
            const docRes = await axios.get(url, {
                responseType: "arraybuffer"
            });
            const docBuff = Buffer.from(docRes.data, "binary");

            return ctx.reply({
                document: docBuff,
                mimetype: mime.contentType("bin")
            });
        } else {
            return ctx.reply(
                `➲ Status: ${status}\n` +
                "➲ Respon:\n" +
                `${data}`
            );
        }
    }
};

async function fetchWithTimeout(
    url,
    options = {
        timeout: 10000,
    }
) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout);

    try {
        const response = await axios.get(url, {
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

function walkJSON(json, depth, array) {
    const arr = array || [];
    const d = depth || 0;

    for (const key in json) {
        arr.push("┊".repeat(d) + (d > 0 ? " " : "") + `*${key}:*`);
        if (typeof json[key] === "object" && json[key] !== null) walkJSON(json[key], d + 1, arr);
        else {
            arr[arr.length - 1] += " " + json[key];
        }
    }

    return arr.join("\n");
}