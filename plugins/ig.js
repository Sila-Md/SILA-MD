const { cmd } = require("../command");
const { igdl } = require("ruhend-scraper");

// FakevCard sawa na zilizopita
const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": '0@s.whatsapp.net',
        "fromMe": false,
        "id": "Halo"
    },
    "message": {
        "conversation": "𝚂𝙸𝙻𝙰"
    }
};

const getContextInfo = (m) => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363402325089913@newsletter',
            newsletterName: '© 𝐒𝐈𝐋𝐀 𝐌𝐃',
            serverMessageId: 143,
        }
    };
};

const processedMessages = new Set();

cmd(
  {
    pattern: "ig",
    alias: ["insta", "instagram", "reels"],
    desc: "Download Instagram Media",
    category: "download",
    react: "📸",
    filename: __filename,
  },
  async (conn, mek, m, { from, q, sender }) => {
    try {
      if (processedMessages.has(m.key.id)) return;
      processedMessages.add(m.key.id);
      setTimeout(() => processedMessages.delete(m.key.id), 5 * 60 * 1000);

      if (!q) {
        return await conn.sendMessage(from, { 
          text: "👉 *𝙿𝚕𝚎𝚊𝚜𝚎 𝚙𝚛𝚘𝚟𝚒𝚍𝚎 𝚊𝚗 𝙸𝚗𝚜𝚝𝚊𝚐𝚛𝚊𝚖 𝚕𝚒𝚗𝚔.*\n\n> © Powered by Sila Tech", 
          contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
      }

      await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

      const downloadData = await igdl(q);
      
      if (!downloadData || !downloadData.data || downloadData.data.length === 0) {
        return await conn.sendMessage(from, { 
          text: "❌ *𝙽𝚘 𝚖𝚎𝚍𝚒𝚊 𝚏𝚘𝚞𝚗𝚍.* 𝙼𝚊𝚔𝚎 𝚜𝚞𝚛𝚎 𝚝𝚑𝚎 𝚕𝚒𝚗𝚔 𝚒𝚜 𝚙𝚞𝚋𝚕𝚒𝚌.\n\n> © Powered by Sila Tech", 
          contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
      }

      const uniqueMedia = [];
      const seenUrls = new Set();
      for (const media of downloadData.data) {
        if (media.url && !seenUrls.has(media.url)) {
          seenUrls.add(media.url);
          uniqueMedia.push(media);
        }
      }

      for (let i = 0; i < uniqueMedia.length; i++) {
        const media = uniqueMedia[i];
        
        const isVideo = 
          /\.(mp4|mov|avi|mkv|webm)/i.test(media.url) || 
          media.type === 'video' || 
          q.includes('/reel/') || 
          q.includes('/tv/');

        if (isVideo) {
          await conn.sendMessage(from, {
            video: { url: media.url },
            caption: `✨ *𝙸𝙶 𝙳𝚘𝚠𝚗𝚕𝚘𝚊𝚍𝚎𝚛 𝚋𝚢 𝚂𝙸𝙻𝙰 𝙼𝙳*\n\n✅ *𝚅𝚒𝚍𝚎𝚘 [${i + 1}/${uniqueMedia.length}]*\n\n> © Powered by Sila Tech`,
            mimetype: "video/mp4",
            fileName: `sila_md_${Date.now()}.mp4`,
            contextInfo: getContextInfo({ sender: sender })
          }, { quoted: fkontak });
        } else {
          await conn.sendMessage(from, {
            image: { url: media.url },
            caption: `✨ *𝙸𝙶 𝙳𝚘𝚠𝚗𝚕𝚘𝚊𝚍𝚎𝚛 𝚋𝚢 𝚂𝙸𝙻𝙰 𝙼𝙳*\n\n✅ *𝙸𝚖𝚊𝚐𝚎 [${i + 1}/${uniqueMedia.length}]*\n\n> © Powered by Sila Tech`,
            contextInfo: getContextInfo({ sender: sender })
          }, { quoted: fkontak });
        }

        if (uniqueMedia.length > 1) await new Promise(r => setTimeout(r, 1500));
      }

      await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

    } catch (e) {
      console.error(e);
      await conn.sendMessage(from, { 
        text: `⚠️ *𝙴𝚛𝚛𝚘𝚛:* ${e.message}\n\n> © Powered by Sila Tech`, 
        contextInfo: getContextInfo({ sender: sender })
      }, { quoted: fkontak });
    }
  }
);