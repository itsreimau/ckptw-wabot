const api = require("./api.js");
const axios = require("axios");
const cheerio = require("cheerio");

const languages = [{
        name: "Deteksi Bahasa Otomatis",
        code: "auto",
        alias: "au"
    },
    {
        name: "Afrikaans",
        code: "af"
    },
    {
        name: "Albanian",
        code: "sq"
    },
    {
        name: "Arabic",
        code: "ar"
    },
    {
        name: "Azerbaijani",
        code: "az"
    },
    {
        name: "Basque",
        code: "eu"
    },
    {
        name: "Bengali",
        code: "bn"
    },
    {
        name: "Belarusian",
        code: "be"
    },
    {
        name: "Bulgarian",
        code: "bg"
    },
    {
        name: "Catalan",
        code: "ca"
    },
    {
        name: "Chinese Simplified",
        code: "zh-CN",
        alias: "cn"
    },
    {
        name: "Chinese Traditional",
        code: "zh-TW",
        alias: "cnt"
    },
    {
        name: "Croatian",
        code: "hr"
    },
    {
        name: "Czech",
        code: "cs"
    },
    {
        name: "Danish",
        code: "da"
    },
    {
        name: "Dutch",
        code: "nl"
    },
    {
        name: "English",
        code: "en"
    },
    {
        name: "Esperanto",
        code: "eo"
    },
    {
        name: "Estonian",
        code: "et"
    },
    {
        name: "Filipino",
        code: "tl"
    },
    {
        name: "Finnish",
        code: "fi"
    },
    {
        name: "French",
        code: "fr"
    },
    {
        name: "Galician",
        code: "gl"
    },
    {
        name: "Georgian",
        code: "ka"
    },
    {
        name: "German",
        code: "de"
    },
    {
        name: "Greek",
        code: "el"
    },
    {
        name: "Gujarati",
        code: "gu"
    },
    {
        name: "Haitian Creole",
        code: "ht"
    },
    {
        name: "Hebrew",
        code: "iw"
    },
    {
        name: "Hindi",
        code: "hi"
    },
    {
        name: "Hungarian",
        code: "hu"
    },
    {
        name: "Icelandic",
        code: "is"
    },
    {
        name: "Indonesian",
        code: "id"
    },
    {
        name: "Irish",
        code: "ga"
    },
    {
        name: "Italian",
        code: "it"
    },
    {
        name: "Japanese",
        code: "ja"
    },
    {
        name: "Javanese",
        code: "jw"
    },
    {
        name: "Kannada",
        code: "kn"
    },
    {
        name: "Kazakh",
        code: "kk"
    },
    {
        name: "Korean",
        code: "ko"
    },
    {
        name: "Latin",
        code: "la"
    },
    {
        name: "Latvian",
        code: "lv"
    },
    {
        name: "Lithuanian",
        code: "lt"
    },
    {
        name: "Macedonian",
        code: "mk"
    },
    {
        name: "Malay",
        code: "ms"
    },
    {
        name: "Maltese",
        code: "mt"
    },
    {
        name: "Norwegian",
        code: "no"
    },
    {
        name: "Pashto",
        code: "ps"
    },
    {
        name: "Persian",
        code: "fa"
    },
    {
        name: "Polish",
        code: "pl"
    },
    {
        name: "Portuguese",
        code: "pt"
    },
    {
        name: "Romanian",
        code: "ro"
    },
    {
        name: "Russian",
        code: "ru"
    },
    {
        name: "Serbian",
        code: "sr"
    },
    {
        name: "Slovak",
        code: "sk"
    },
    {
        name: "Slovenian",
        code: "sl"
    },
    {
        name: "Spanish",
        code: "es"
    },
    {
        name: "Sundanese",
        code: "su"
    },
    {
        name: "Swahili",
        code: "sw"
    },
    {
        name: "Swedish",
        code: "sv"
    },
    {
        name: "Tamil",
        code: "ta"
    },
    {
        name: "Telugu",
        code: "te"
    },
    {
        name: "Thai",
        code: "th"
    },
    {
        name: "Turkish",
        code: "tr"
    },
    {
        name: "Ukrainian",
        code: "uk"
    },
    {
        name: "Urdu",
        code: "ur"
    },
    {
        name: "Vietnamese",
        code: "vi"
    },
    {
        name: "Welsh",
        code: "cy"
    },
    {
        name: "Yiddish",
        code: "yi"
    }
]

async function getSourceAndTargetCodes(from, to) {
    const source = languages.find(l => l.code === from || l.alias === from).code;
    const target = languages.find(l => l.code === to || l.alias === to).code;
    return {
        source,
        target
    };
}

async function fetchTranslation(source, target, text) {
    const url = api.createUrl("https://translate.google.co.id", `/m?sl=${source}&tl=${target}&q=${encodeURIComponent(text)}&hl=en`, {});

    try {
        const response = await axios.get(url);
        if (response.status !== 200) {
            throw {
                status: response.status,
                message: response.statusText
            };
        }
        return response.data;
    } catch (error) {
        console.error(`Error fetching translation: ${error.message}`);
        throw error;
    }
}

async function extractTranslation(html) {
    const $ = cheerio.load(html);
    const direction = $("div.sl-and-tl").text();
    const translation = $("div.result-container").text();
    return {
        direction,
        translation
    };
}

async function call(from, to, text) {
    const {
        source,
        target
    } = await getSourceAndTargetCodes(from, to);
    const lines = text.split("\n");
    let direction;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;
        const html = await fetchTranslation(source, target, line);
        const {
            direction: dir,
            translation
        } = await extractTranslation(html);
        direction ??= dir;
        lines[i] = translation;
    }
    return {
        direction,
        translation: lines.join("\n")
    };
}

module.exports = {
    languages,
    call
};