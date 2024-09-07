const bta = require("bing-translate-api");

async function translate(msg, lc = "id") {
    if (lc === "id") return msg;

    try {
        const {
            translation
        } = await bta.translate(msg, null, lc);
        return translation;
    } catch {
        return msg;
    }
}

module.exports = {
    translate
};