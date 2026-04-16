const { cmd } = require('../command');
const config = require('../config');
const os = require('os');
const moment = require('moment-timezone');

// Define combined fakevCard 
const fakevCard = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "© 𝐒𝐈𝐋𝐀-𝐌𝐃",
      vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:𝐒𝐈𝐋𝐀 𝐌𝐃 𝐁𝐎𝐓\nORG:𝐒𝐈𝐋𝐀-𝐌𝐃;\nTEL;type=CELL;type=VOICE;waid=255789661031:+255789661031\nEND:VCARD`
    }
  }
};

const formatUptime = (seconds) => {
  const d = Math.floor(seconds / (24 * 3600));
  seconds %= 24 * 3600;
  const h = Math.floor(seconds / 3600);
  seconds %= 3600;
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${d}d ${h}h ${m}m ${s}s`;
};

cmd({
    pattern: "alive",
    desc: "Check if bot is alive and active",
    category: "main",
    react: "💚",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply, pushName }) => {
    try {
        const uptime = formatUptime(process.uptime());
        const timeZone = 'Africa/Dar_es_Salaam';
        const time = moment.tz(timeZone).format('hh:mm:ss A');
        const date = moment.tz(timeZone).format('DD/MM/YYYY');
        const mode = config.MODE === 'public' ? 'PUBLIC' : 'PRIVATE';
        const prefix = config.PREFIX || '.';
        
        const aliveMessage = 
`┏━❑ 𝐒𝐈𝐋𝐀-𝐌𝐃 𝐁𝐎𝐓 ━━━━━━━━━
┃ ✅ Status: ALIVE & ACTIVE
┃ 👤 User: ${pushName || sender.split('@')[0]}
┃ 🚀 Mode: ${mode}
┃ 🔧 Prefix: ${prefix}
┃ ⏱️ Uptime: ${uptime}
┃ 📅 Date: ${date}
┃ 🕐 Time: ${time}
┃ 💚 Bot Health: 100%
┗━━━━━━━━━━━━━━━━━━━━`;
        
        const imageUrl = 'https://files.catbox.moe/36vahk.png';
        
        try {
            await conn.sendMessage(from, 
                { 
                    image: { url: imageUrl },
                    caption: aliveMessage
                },
                { quoted: fakevCard }
            );
        } catch (imageError) {
            console.log("Image error, sending text only:", imageError);
            await conn.sendMessage(from, 
                { text: aliveMessage },
                { quoted: fakevCard }
            );
        }
        
    } catch (e) {
        reply("❌ Error: " + e.message);
    }
});
