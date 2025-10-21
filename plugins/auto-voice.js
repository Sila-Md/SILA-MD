const fs = require('fs');
const path = require('path');
const mime = require('mime-types'); // ← Add this
const config = require('../config');
const { cmd } = require('../command');

cmd({
  on: "body"
},
async (conn, mek, m, { from, body }) => {
    const filePath = path.join(__dirname, '../assets/autovoice.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    for (const text in data) {
        if (body.toLowerCase() === text.toLowerCase()) {
            if (config.AUTO_VOICE === 'true') {
                const audioPath = path.join(__dirname, '../assets/autovoice', data[text]);

                if (fs.existsSync(audioPath)) {
                    const audioBuffer = fs.readFileSync(audioPath);
                    const mimeType = mime.lookup(audioPath) || 'audio/mp4'; // auto-detect mime

                    await conn.sendMessage(from, {
                        audio: audioBuffer,
                        mimetype: mimeType,
                        ptt: true // Set false if you want it as a regular audio
                    }, { quoted: mek });
                } else {
                    console.warn(`Audio not found: ${audioPath}`);
                }
            }
        }
    }
});
