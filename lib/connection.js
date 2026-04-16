const config = require('../config');
const { makeWASocket } = require(config.BAILEYS); // Example using Baileys

const conn = makeWASocket({
    // Connection configuration
});

module.exports = conn;
