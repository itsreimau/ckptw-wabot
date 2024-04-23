require('./config.js');
const package = require('./package.json');
const CFonts = require('cfonts');

console.log('Starting...');

// Display title using CFonts.
CFonts.say(package.name, {
    font: 'chrome',
    align: 'center',
    gradient: ['red', 'magenta']
});

// Displays package information.
const authorName = package.author.name || package.author;
CFonts.say(
    `'${package.description}'\n` +
    `By ${authorName}`, {
        font: 'console',
        align: 'center',
        gradient: ['red', 'magenta']
    });

// Import and run the main module.
require('./main.js');