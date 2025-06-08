const {
    quote
} = require("@itsreimau/ckptw-mod");
const axios = require("axios");
const {
    performance
} = require("node:perf_hooks");

module.exports = {
    name: "speedtest",
    aliases: ["speed"],
    category: "information",
    permissions: {},
    code: async (ctx) => {
        try {
            const latencyStart = performance.now();
            const testMsg = await ctx.reply(quote("🚀 Menguji latency..."));
            const latency = (performance.now() - latencyStart).toFixed(2);

            await ctx.editMessage(testMsg.key, quote("📥 Menguji kecepatan download..."));
            const downloadStart = performance.now();
            const downloadUrl = tools.api.createUrl("https://github.com", "/itsreimau/ckptw-wabot/raw/master/README.md");
            const downloadResponse = await axios.get(downloadUrl);
            const downloadSize = downloadResponse.headers["content-length"] / 1024;
            const downloadTime = (performance.now() - downloadStart) / 1000;
            const downloadSpeed = (downloadSize / downloadTime).toFixed(2);

            await ctx.editMessage(testMsg.key, quote("📤 Menguji kecepatan upload..."));
            const uploadStart = performance.now();
            const uploadData = Buffer.alloc(1024 * 1024);
            const uploadUrl = tools.api.createUrl("https://httpbin.org", "/post");
            const uploadResponse = await axios.post(uploadUrl, uploadData, {
                headers: {
                    "Content-Type": "application/octet-stream"
                }
            });
            const uploadTime = (performance.now() - uploadStart) / 1000;
            const uploadSpeed = (50 / uploadTime).toFixed(2);

            return await ctx.editMessage(testMsg.key,
                `${quote(`Latency: ${latency}ms`)}\n` +
                `${quote(`Download: ${downloadSpeed} KB/s`)}\n` +
                `${quote(`Upload: ${uploadSpeed} KB/s`)}\n` +
                "\n" +
                config.msg.footer
            );
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};