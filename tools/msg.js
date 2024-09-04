const bta = require("bing-translate-api");

async function translate(msg, lc) {
    if (lc === "en") {
        return msg; // Not translated due to system language
    }

    try {
        const {
            translation
        } = await bta.translate(msg, null, lc);
        return translation;
    } catch (error) {
        console.error("Error:", error);
    }
}

module.exports = {
    translate
};