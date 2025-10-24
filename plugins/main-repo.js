const config = require('../config');
const { cmd } = require('../command');

const MUSIC_URL = "https://files.catbox.moe/ebj284.jpg"; // Customize if needed

cmd({
    pattern: "repo",
    alias: ["speed", "pong"],
    use: '.repo',
    desc: "Check bot's response time.",
    category: "main",
    react: "🍁",
    filename: __filename
},
