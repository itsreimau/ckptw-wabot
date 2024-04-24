const path = require('path');
const {
    Low
} = require('lowdb');
const {
    JSONFile
} = require('lowdb/node');

// Database adapter to interact with JSON file.
const __dirname = path.resolve(); // Specify the directory where this script file is located
const adapter = new JSONFile(path.join(__dirname, '../database.json'));


// Default data structure for the database.
const defaultData = {
    banned: [],
    group: {},
    user: {}
};

// Lowdb instance for database operations.
const db = new Low(adapter);
global.db = db;

// Function to initialize the database by reading from and writing to it.
async function initializeDatabase() {
    await db.read();
    await db.write();
}

initializeDatabase();

/**
 * Exported object containing the Lowdb instance for database operations.
 * @type {object}
 */
exports.db = db;