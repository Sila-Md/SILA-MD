const config = require('../config');
const { cmd } = require('../command');
const axios = require('axios');

cmd({
  on: "body"
}, async (conn, m, { isGroup }) => {
  try {
    if (config.MENTION_REPLY !== 'true' || !isGroup) return;
    if (!m.mentionedJid || m.mentionedJid.length === 0) return;

    const voiceClips = [
      "https://files.catbox.moe/1uc1ha.mp3",
      "https://files.catbox.moe/0zy37y.mp3",
      "https://files.catbox.moe/juudad.mp3",
      "https://files.catbox.moe/q0o69p.mp3",
      "https://files.catbox.moe/je07wf.mp3",
      "https://files.catbox.moe/5cpr03.mp3",
      "https://files.catbox.moe/e56yzo.mp3",
      "https://files.catbox.moe/bn1zm3.mp3",
      "https://files.catbox.moe/dmai20.mp3",
      "https://files.catbox.moe/vc27e7.mp3"
    ];

    const randomClip = voiceClips[Math.floor(Math.random() * voiceClips.length)];
    const botNumber = conn.user.id.split(":")[0] + '@s.whatsapp.net';

    if (m.mentionedJid.includes(botNumber)) {
      const thumbnailRes = await axios.get(config.MENU_IMAGE_URL || " https://files.catbox.moe/x24scg.jpg", {
        responseType: 'arraybuffer'
      });
      const thumbnailBuffer = Buffer.from(thumbnailRes.data, 'binary');

      await conn.sendMessage(m.chat, {
        audio: { url: randomClip },
        mimetype: 'audio/mp4',
        ptt: true,
        waveform: [99, 0, 99, 0, 99],
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          externalAdReply: {
            title: config.BOT_NAME || "SILATRIX-MD 🥀",
            body: config.DESCRIPTION || "> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙼𝚁.𝚂𝙸𝙻𝙰*",
            mediaType: 1,
            renderLargerThumbnail: true,
            thumbnail: thumbnailBuffer,
            mediaUrl: " https://files.catbox.moe/x24scg.jpg", // Static image URL
            sourceUrl: "https://wa.me/message/yourself",
            showAdAttribution: true
          }
        }
      }, { quoted: m });
    }
  } catch (e) {
    console.error(e);
    const ownerJid = conn.user.id.split(":")[0] + "@s.whatsapp.net";
    await conn.sendMessage(ownerJid, {
      text: `*Bot Error in Mention Handler:*\n${e.message}`
    });
  }
});
      
