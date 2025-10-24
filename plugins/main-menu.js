const config = require('../config');
const { cmd } = require('../command');
const fs = require('fs');

cmd({
  pattern: 'menu',
  desc: 'Show interactive menu system',
  category: 'menu',
  react: '🛸',
  filename: __filename
}, async (conn, mek, m, { from }) => {
  try {
    const userName = m.pushName || 'User';
    const menuCaption = `
╭━⪨ 𝚂𝙸𝙻𝙰-𝙼𝙳 ⪩━┈⊷🇹🇿
├ Owner: ${config.OWNER_NAME}
├ Type: NodeJs (MD)
├ Mode: ${config.MODE}
├ Prefix: ${config.PREFIX}
├ Version: 2.0.0 Beta
╰━ Hello ${userName}, choose a menu below:

╭━⪨ 📜 MENU LIST ⪩━
├ 1️⃣ Download Menu
├ 2️⃣ Group Menu
├ 3️⃣ Fun Menu
├ 4️⃣ Owner Menu
├ 5️⃣ AI Menu
├ 6️⃣ Anime Menu
├ 7️⃣ Convert Menu
├ 8️⃣ Other Menu
├ 9️⃣ Reactions Menu
├ 🔟 Main Menu
╰━━━━━━━━━━━━━━━━━━━

> Reply with a number (1-10)
    `;

    const contextInfo = {
      mentionedJid: [m.sender],
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363422610520277@newsletter
',
        newsletterName: 'SILA TECH',
        serverMessageId: 143
      }
    };

    // Send image (fallback to text if image fails)
    const sendImage = async () => {
      try {
        return await conn.sendMessage(from, {
          image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/ftbfm1.jpg' },
          caption: menuCaption,
          contextInfo
        }, { quoted: mek });
      } catch {
        return await conn.sendMessage(from, {
          text: menuCaption,
          contextInfo
        }, { quoted: mek });
      }
    };

    // Send voice message (PTT style)
    const sendAudio = async () => {
      try {
        await new Promise(res => setTimeout(res, 1000));
        await conn.sendMessage(from, {
          audio: { url: 'https://files.catbox.moe/11f9pe.mp3' },
          mimetype: 'audio/mp4',
          ptt: true
        }, { quoted: mek });
      } catch {}
    };

    // Try to send both image and audio
    let sentMsg;
    try {
      sentMsg = await Promise.race([
        sendImage(),
        new Promise((_, reject) => setTimeout(() => reject('Timeout'), 10000))
      ]);

      await Promise.race([
        sendAudio(),
        new Promise((_, reject) => setTimeout(() => reject('Audio Timeout'), 8000))
      ]);
    } catch {
      sentMsg = await conn.sendMessage(from, {
        text: menuCaption,
        contextInfo
      }, { quoted: mek });
    }

    const messageID = sentMsg.key.id;

    // Menu response map
    const menuMap = {
      '1': '*📥 Download Menu:*\nfacebook, mediafire, tiktok, insta, spotify, play, etc.',
      '2': '*👥 Group Menu:*\nkick, add, promote, revoke, welcome, tagall, etc.',
      '3': '*😄 Fun Menu:*\njoke, ship, pickup, insult, hand, hifi, etc.',
      '4': '*👑 Owner Menu:*\nrestart, shutdown, block, unblock, listcmd, etc.',
      '5': '*🤖 AI Menu:*\nai, gpt3, gpt4, imagine, luma, jawad, etc.',
      '6': '*🎎 Anime Menu:*\nwaifu, neko, animegirl1-5, naruto, foxgirl, etc.',
      '7': '*🔄 Convert Menu:*\nsticker, emojimix, tomp3, base64, urldecode, etc.',
      '8': '*📌 Other Menu:*\ncalculate, wikipedia, githubstalk, yts, weather, etc.',
      '9': '*💞 Reactions Menu:*\nhug, pat, kiss, bonk, smile, poke, etc.',
      '10': '*🏠 Main Menu:*\nping, runtime, repo, alive, etc.'
    };

    // Handler for user replies
    const replyHandler = async (msgData) => {
      try {
        const msg = msgData.messages[0];
        const replyID = msg.message?.extendedTextMessage?.contextInfo?.stanzaId;
        if (replyID !== messageID) return;

        const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text;
        const selected = menuMap[text.trim()];

        if (selected) {
          await conn.sendMessage(from, {
            text: selected,
            contextInfo
          }, { quoted: msg });

          await conn.sendMessage(from, {
            react: { text: '✅', key: msg.key }
          });
        } else {
          await conn.sendMessage(from, {
            text: '❌ Invalid input. Please reply with a number from 1 to 10.',
            contextInfo
          }, { quoted: msg });
        }
      } catch (e) {
        console.error('Menu reply handler error:', e);
      }
    };

    conn.ev.on('messages.upsert', replyHandler);
    setTimeout(() => conn.ev.off('messages.upsert', replyHandler), 5 * 60 * 1000); // 5 min timeout

  } catch (err) {
    console.error('Menu2 command error:', err);
    await conn.sendMessage(from, {
      text: '⚠️ Menu currently unavailable. Try again later.'
    }, { quoted: mek });
  }
});
