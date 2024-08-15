require("./config.js");
const pkg = require("./package.json");
const CFonts = require("cfonts");

console.log("Starting...");

// Display title using CFonts.
CFonts.say(pkg.name, {
    font: "chrome",
    align: "center",
    gradient: ["red", "magenta"]
});

// Displays package information.
const authorName = pkg.author.name || pkg.author;
CFonts.say(
    `'${pkg.description}'\n` +
    `By ${authorName}`, {
        font: "console",
        align: "center",
        gradient: ["red", "magenta"]
    });

// Import and run the main module.
require("./main.js");