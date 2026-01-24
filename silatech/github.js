const moment = require('moment-timezone');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

async function githubCommand(sock, chatId, message) {
  try {
    // Step 1: Send reaction first
    await sock.sendMessage(chatId, {
      react: {
        text: '🐙', // Emoji ya GitHub octopus
        key: message.key
      }
    });

    const res = await fetch('https://api.github.com/repos/Sila-Md/SILA-MD');
    if (!res.ok) throw new Error('Error fetching repository data');
    const json = await res.json();

    let txt = `┏━❑ 𝐒𝐈𝐋𝐀-𝐌𝐃 𝙶𝙸𝚃𝙷𝚄𝙱 ━━━━━━━━━
┃ 📦 𝚁𝚎𝚙𝚘𝚜𝚒𝚝𝚘𝚛𝚢: ${json.name}
┃ 👀 𝚆𝚊𝚝𝚌𝚑𝚎𝚛𝚜: ${json.watchers_count}
┃ 💾 𝚂𝚒𝚣𝚎: ${(json.size / 1024).toFixed(2)} MB
┃ 📅 𝚄𝚙𝚍𝚊𝚝𝚎𝚍: ${moment(json.updated_at).format('DD/MM/YY - HH:mm:ss')}
┃ 🔀 𝙵𝚘𝚛𝚔𝚜: ${json.forks_count}
┃ ⭐ 𝚂𝚝𝚊𝚛𝚜: ${json.stargazers_count}
┃ 🔗 𝚄𝚁𝙻: ${json.html_url}
┗━━━━━━━━━━━━━━━━━━━━

🐙 𝙶𝙸𝚃𝙷𝚄𝙱 𝚁𝙴𝙿𝙾𝚂𝙸𝚃𝙾𝚁𝚈 𝙸𝙽𝙵𝙾𝚁𝙼𝙰𝚃𝙸𝙾𝙽`;

    // Use the local asset image
    const imgPath = path.join(__dirname, '../assets/bot_image.jpg');
    const imgBuffer = fs.readFileSync(imgPath);

    await sock.sendMessage(chatId, { 
      image: imgBuffer, 
      caption: txt 
    }, { quoted: message });

  } catch (error) {
    console.error('Error in github command:', error);
    await sock.sendMessage(chatId, { 
      text: '*╭━━━〔 🐢 𝙶𝙸𝚃𝙷𝚄𝙱 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 🐢 〕━━━┈⊷*\n' +
            '*┃🐢│ 𝚂𝚃𝙰𝚃𝚄𝚂 :❯ 𝙴𝚁𝚁𝙾𝚁*\n' +
            '*┃🐢│ 𝙼𝙴𝚂𝚂𝙰𝙶𝙴 :❯ 𝙵𝙰𝙸𝙻𝙴𝙳 𝚃𝙾 𝙵𝙴𝚃𝙲𝙷 𝙳𝙰𝚃𝙰*\n' +
            '*╰━━━━━━━━━━━━━━━┈⊷*'
    }, { quoted: message });
  }
}

module.exports = githubCommand;